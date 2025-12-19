import asyncio
import base64
import io
from typing import Dict, List, Optional
import uuid
from datetime import datetime
import numpy as np
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from ..database.database import get_db
from ..models.chat_session import ChatSession as ChatSessionModel
from ..services.content_indexer import content_indexer

router = APIRouter()

import os
# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key and os.getenv("TESTING"):
    openai_api_key = "sk-fake-key-for-testing"

openai_client = AsyncOpenAI(api_key=openai_api_key)

# Pydantic models based on data-model.md and API contracts
class ChatQueryRequest(BaseModel):
    query: str
    context: Optional[str] = None
    userId: Optional[str] = None

class ChatSelectionRequest(BaseModel):
    selectedText: str
    query: str
    userId: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    confidence: float

class ChatSessionResponse(BaseModel):
    id: str
    userId: Optional[str]
    query: str
    response: str
    context: Optional[str]
    timestamp: datetime
    feedback: Optional[dict]

class VoiceCommandRequest(BaseModel):
    audio_data: str  # Base64 encoded audio data
    audio_format: str = "wav"  # Format of the audio data
    language: Optional[str] = "en"  # Language code (e.g., 'en', 'es', 'fr')

class VoiceCommandResponse(BaseModel):
    success: bool
    transcription: str
    intent: str
    confidence: float
    action_commands: List[str]

class VoiceProcessingService:
    def __init__(self):
        self.client = openai_client

    async def transcribe_audio(self, audio_data: bytes, language: str = "en") -> str:
        """
        Transcribe audio using OpenAI Whisper
        """
        try:
            # Create a BytesIO object from the audio data
            audio_file = io.BytesIO(audio_data)
            audio_file.name = f"audio.{language}.wav"  # Temporary name for the file

            # Call Whisper API
            transcription = await self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language,
                response_format="text"
            )

            return transcription
        except Exception as e:
            print(f"Error in Whisper transcription: {e}")
            raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    def extract_intent(self, text: str) -> Dict[str, any]:
        """
        Extract intent and relevant information from transcribed text
        """
        # This is a simplified intent extraction
        # In a real implementation, you would use more sophisticated NLP
        if not text or not text.strip():
            return {
                "intent": "unknown",
                "confidence": 0.0,
                "raw_text": text,
                "error": "Empty or invalid transcription"
            }

        text_lower = text.lower()

        intents = {
            "move": ["move", "go", "walk", "step", "forward", "backward", "left", "right"],
            "grasp": ["grasp", "grab", "pick", "take", "lift", "hold"],
            "place": ["place", "put", "set", "down", "release"],
            "stop": ["stop", "halt", "pause", "wait"],
            "find": ["find", "locate", "search", "look for"],
            "follow": ["follow", "track", "chase", "accompany"]
        }

        detected_intent = "unknown"
        confidence = 0.0

        for intent, keywords in intents.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected_intent = intent
                    confidence = 0.8  # Base confidence
                    break
            if detected_intent != "unknown":
                break

        return {
            "intent": detected_intent,
            "confidence": confidence,
            "raw_text": text,
            "detected_keywords": [kw for kw_list in intents.values() for kw in kw_list if kw in text_lower]
        }

    def generate_action_commands(self, intent_data: Dict) -> List[str]:
        """
        Generate specific action commands based on detected intent
        """
        intent = intent_data["intent"]

        action_mapping = {
            "move": ["navigate_to_target", "adjust_position", "change_location"],
            "grasp": ["approach_object", "activate_gripper", "secure_object"],
            "place": ["navigate_to_destination", "release_object", "position_item"],
            "stop": ["halt_motors", "freeze_position", "cease_movement"],
            "find": ["scan_environment", "identify_target", "focus_on_object"],
            "follow": ["track_target", "maintain_distance", "adjust_path"]
        }

        return action_mapping.get(intent, ["standby"])

    def validate_transcription_quality(self, transcription: str, original_audio_duration: float = None) -> Dict[str, any]:
        """
        Validate the quality of the transcription
        """
        quality_metrics = {
            "length": len(transcription.strip()),
            "word_count": len(transcription.split()),
            "contains_unrecognized_chars": "UNRECOGNIZED" in transcription.upper(),
            "confidence_indicators": [],
            "quality_score": 0.0
        }

        # Quality checks
        if quality_metrics["length"] == 0:
            quality_metrics["confidence_indicators"].append("empty_transcription")
            quality_metrics["quality_score"] = 0.0
        elif quality_metrics["length"] < 3:
            quality_metrics["confidence_indicators"].append("very_short")
            quality_metrics["quality_score"] = 0.2
        elif quality_metrics["word_count"] >= 100:  # Very long transcription might be problematic
            quality_metrics["confidence_indicators"].append("very_long")
            quality_metrics["quality_score"] = 0.3
        else:
            quality_metrics["quality_score"] = min(1.0, quality_metrics["word_count"] * 0.1)

        if quality_metrics["contains_unrecognized_chars"]:
            quality_metrics["confidence_indicators"].append("unrecognized_content")
            quality_metrics["quality_score"] *= 0.5

        return quality_metrics

voice_service = VoiceProcessingService()

@router.post("/query", response_model=ChatResponse)
async def chat_query(request: ChatQueryRequest, db = Depends(get_db)):
    """
    Process a chat query against the RAG system.
    """
    try:
        # Get embeddings for the query
        query_embedding = await content_indexer.get_content_embeddings(request.query)

        # Search for relevant content in the vector database
        search_results = content_indexer.vector_db.search_content(query_embedding, limit=5)

        # Prepare context from search results
        context_text = ""
        sources = []
        for result in search_results:
            context_text += f"\n\n{result['text']}"
            sources.append(result.get("metadata", {}).get("title", "Unknown Source"))

        # If we have context, use it to generate a response
        if context_text.strip():
            # Use OpenAI to generate a response based on the context and query
            response = await openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an assistant for the Physical AI & Humanoid Robotics Book. Use the provided context to answer questions about the content. Be helpful, accurate, and educational."},
                    {"role": "user", "content": f"Context: {context_text}\n\nQuestion: {request.query}"}
                ],
                max_tokens=500,
                temperature=0.7
            )
            response_text = response.choices[0].message.content
        else:
            # If no context found, provide a general response
            response_text = f"I couldn't find specific information about '{request.query}' in the content. The Physical AI & Humanoid Robotics Book covers topics on ROS 2, Digital Twins, AI-robot brains, and Vision-Language-Action systems."

        # Create a chat session record
        session_id = str(uuid.uuid4())
        chat_session = ChatSessionModel(
            id=session_id,
            user_id=request.userId,
            query=request.query,
            response=response_text,
            context=context_text[:1000] if context_text else None,  # Limit context length
            timestamp=datetime.utcnow(),
            feedback={}
        )

        db.add(chat_session)
        await db.commit()

        return ChatResponse(
            response=response_text,
            sources=sources if sources else ["No specific sources found in content"],
            confidence=0.8  # In a real implementation, this would come from the model
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/selection", response_model=ChatResponse)
async def chat_selection(request: ChatSelectionRequest, db = Depends(get_db)):
    """
    Process a query about selected text in the content.
    """
    try:
        # Use the selected text as context for the query
        context_text = request.selectedText

        # Use OpenAI to generate a response based on the selected text and query
        response = await openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant for the Physical AI & Humanoid Robotics Book. Explain the selected text in the context of the user's question. Be helpful, accurate, and educational."},
                {"role": "user", "content": f"Selected text: {context_text}\n\nQuestion about this text: {request.query}"}
            ],
            max_tokens=500,
            temperature=0.7
        )

        response_text = response.choices[0].message.content

        # Create a chat session record
        session_id = str(uuid.uuid4())
        chat_session = ChatSessionModel(
            id=session_id,
            user_id=request.userId,
            query=f"About selected text: {request.query}",
            response=response_text,
            context=context_text[:1000],  # Limit context length
            timestamp=datetime.utcnow(),
            feedback={}
        )

        db.add(chat_session)
        await db.commit()

        return ChatResponse(
            response=response_text,
            sources=["Selected text context"],
            confidence=0.7
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing selection query: {str(e)}")

@router.post("/voice-command", response_model=VoiceCommandResponse)
async def process_voice_command(request: VoiceCommandRequest):
    """
    Process a voice command through Whisper and return actionable commands
    """
    try:
        # Validate input
        if not request.audio_data:
            raise HTTPException(status_code=400, detail="Audio data is required")

        # Decode the base64 audio data
        try:
            audio_bytes = base64.b64decode(request.audio_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid audio data format: {str(e)}")

        # Transcribe the audio using Whisper
        transcription = await voice_service.transcribe_audio(
            audio_bytes,
            language=request.language
        )

        # Validate transcription quality
        quality_metrics = voice_service.validate_transcription_quality(transcription)

        # If transcription quality is poor, return with low confidence
        if quality_metrics["quality_score"] < 0.3:
            return VoiceCommandResponse(
                success=False,
                transcription=transcription,
                intent="unknown",
                confidence=quality_metrics["quality_score"],
                action_commands=["standby"],
                error_message="Poor transcription quality. Please speak more clearly."
            )

        # Extract intent from the transcription
        intent_data = voice_service.extract_intent(transcription)

        # Check if extraction had errors
        if "error" in intent_data:
            return VoiceCommandResponse(
                success=False,
                transcription=transcription,
                intent="unknown",
                confidence=0.0,
                action_commands=["standby"],
                error_message=intent_data["error"]
            )

        # Generate action commands based on the intent
        action_commands = voice_service.generate_action_commands(intent_data)

        response = VoiceCommandResponse(
            success=True,
            transcription=transcription,
            intent=intent_data["intent"],
            confidence=intent_data["confidence"],
            action_commands=action_commands
        )

        return response

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Error processing voice command: {e}")
        return VoiceCommandResponse(
            success=False,
            transcription="",
            intent="unknown",
            confidence=0.0,
            action_commands=["standby"],
            error_message=f"Voice command processing failed: {str(e)}"
        )

class VoiceCommandResponse(BaseModel):
    success: bool
    transcription: str
    intent: str
    confidence: float
    action_commands: List[str]
    error_message: Optional[str] = None

@router.post("/voice-upload", response_model=VoiceCommandResponse)
async def process_voice_upload(audio_file: UploadFile = File(...), language: str = "en"):
    """
    Process an uploaded audio file through Whisper
    """
    try:
        # Validate file
        if not audio_file:
            raise HTTPException(status_code=400, detail="Audio file is required")

        # Check file size (limit to 25MB)
        file_content = await audio_file.read()
        if len(file_content) > 25 * 1024 * 1024:  # 25MB limit
            raise HTTPException(status_code=400, detail="Audio file too large. Maximum size is 25MB.")

        # Reset file pointer for reading again
        await audio_file.seek(0)
        audio_bytes = await audio_file.read()

        # Transcribe the audio using Whisper
        transcription = await voice_service.transcribe_audio(audio_bytes, language=language)

        # Validate transcription quality
        quality_metrics = voice_service.validate_transcription_quality(transcription)

        # If transcription quality is poor, return with low confidence
        if quality_metrics["quality_score"] < 0.3:
            return VoiceCommandResponse(
                success=False,
                transcription=transcription,
                intent="unknown",
                confidence=quality_metrics["quality_score"],
                action_commands=["standby"],
                error_message="Poor transcription quality. Please speak more clearly."
            )

        # Extract intent from the transcription
        intent_data = voice_service.extract_intent(transcription)

        # Check if extraction had errors
        if "error" in intent_data:
            return VoiceCommandResponse(
                success=False,
                transcription=transcription,
                intent="unknown",
                confidence=0.0,
                action_commands=["standby"],
                error_message=intent_data["error"]
            )

        # Generate action commands based on the intent
        action_commands = voice_service.generate_action_commands(intent_data)

        response = VoiceCommandResponse(
            success=True,
            transcription=transcription,
            intent=intent_data["intent"],
            confidence=intent_data["confidence"],
            action_commands=action_commands
        )

        return response

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Error processing uploaded voice: {e}")
        return VoiceCommandResponse(
            success=False,
            transcription="",
            intent="unknown",
            confidence=0.0,
            action_commands=["standby"],
            error_message=f"Voice upload processing failed: {str(e)}"
        )
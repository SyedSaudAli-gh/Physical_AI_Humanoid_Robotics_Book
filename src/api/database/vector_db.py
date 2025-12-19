from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

class VectorDB:
    def __init__(self):
        # Initialize Qdrant client
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        if qdrant_url:
            # Use cloud instance
            self.client = QdrantClient(
                url=qdrant_url,
                api_key=qdrant_api_key,
                prefer_grpc=True
            )
        else:
            # Use local instance for development
            self.client = QdrantClient(host="localhost", port=6333)

        # Collection name for the content
        self.collection_name = "book_content"

        # Initialize the collection if it doesn't exist
        self._init_collection()

    def _init_collection(self):
        """
        Initialize the Qdrant collection for storing book content vectors
        """
        try:
            # Check if collection exists
            self.client.get_collection(self.collection_name)
        except:
            # Create collection if it doesn't exist
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=1536,  # Default size for OpenAI embeddings
                    distance=models.Distance.COSINE
                )
            )

    def add_content(self, content_id: str, text: str, metadata: Dict = None, vector: List[float] = None):
        """
        Add content to the vector database
        If vector is not provided, it should be generated elsewhere (e.g., using OpenAI embeddings)
        """
        if vector is None:
            # In a real implementation, we would generate the embedding here
            # For now, using a placeholder
            vector = [0.0] * 1536  # Placeholder vector

        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=content_id,
                    vector=vector,
                    payload={
                        "content_id": content_id,
                        "text": text,
                        "metadata": metadata or {}
                    }
                )
            ]
        )

    def search_content(self, query_vector: List[float], limit: int = 5) -> List[Dict]:
        """
        Search for content similar to the query vector
        """
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )

        return [
            {
                "content_id": result.payload.get("content_id"),
                "text": result.payload.get("text"),
                "metadata": result.payload.get("metadata"),
                "score": result.score
            }
            for result in results
        ]

    def delete_content(self, content_id: str):
        """
        Delete content from the vector database
        """
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=models.PointIdsList(
                points=[content_id]
            )
        )

    def update_content(self, content_id: str, text: str, metadata: Dict = None, vector: List[float] = None):
        """
        Update existing content in the vector database
        """
        # First delete the old content
        self.delete_content(content_id)

        # Then add the updated content
        self.add_content(content_id, text, metadata, vector)

def get_vector_db_instance():
    """
    Factory function to get vector database instance.
    This allows for mocking in tests.
    """
    return VectorDB()

# Create a global instance
vector_db = get_vector_db_instance()
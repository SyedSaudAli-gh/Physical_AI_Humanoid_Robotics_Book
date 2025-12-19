from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=True)  # nullable for anonymous users
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    context = Column(Text, nullable=True)  # content context used for response
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    feedback = Column(JSONB, nullable=True, default={})
    session_id = Column(String, nullable=True)  # for conversation context
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Personalization(Base):
    __tablename__ = "personalization"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, unique=True)  # references user
    preferences = Column(JSONB, nullable=False, default={})  # personalization settings
    module_progress = Column(JSONB, nullable=False, default={})  # progress tracking per module
    learning_path = Column(String, nullable=True)  # suggested learning sequence
    last_accessed = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
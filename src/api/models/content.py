from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Content(Base):
    __tablename__ = "content"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String, nullable=False, index=True)
    chapter_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # Main content in Markdown format
    urdu_content = Column(Text, nullable=True)  # Urdu translation of content
    type = Column(String, nullable=False)  # content type: 'module', 'chapter', 'exercise', 'resource'
    content_metadata = Column(JSONB, nullable=True, default={})
    order = Column(Integer, nullable=False)  # display order within module/chapter
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
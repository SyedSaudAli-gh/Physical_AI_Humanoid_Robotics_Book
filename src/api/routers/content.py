from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

from ..database.database import get_db
from ..models.content import Content as ContentModel
from sqlalchemy import select

router = APIRouter()

# Pydantic models based on data-model.md
class ContentCreateRequest(BaseModel):
    module_id: str
    chapter_id: str
    title: str
    content: str
    urdu_content: Optional[str] = None
    type: str
    metadata: Optional[dict] = {}
    order: int

class ContentUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    urdu_content: Optional[str] = None
    metadata: Optional[dict] = None
    order: Optional[int] = None

class ContentResponse(BaseModel):
    id: str
    module_id: str
    chapter_id: str
    title: str
    content: str
    urdu_content: Optional[str] = None
    type: str
    metadata: Optional[dict] = {}
    order: int
    created_at: datetime
    updated_at: datetime

class ContentSearchResponse(BaseModel):
    id: str
    title: str
    snippet: str
    score: float

class SearchResponse(BaseModel):
    results: List[ContentSearchResponse]

@router.get("/{module_id}/{chapter_id}", response_model=ContentResponse)
async def get_content(module_id: str, chapter_id: str, db = Depends(get_db)):
    """
    Get content for a specific module and chapter.
    """
    result = await db.execute(
        select(ContentModel).where(
            ContentModel.module_id == module_id,
            ContentModel.chapter_id == chapter_id
        )
    )
    content_item = result.scalar_one_or_none()

    if content_item:
        return content_item
    else:
        # If not found in database, return default response for intro content
        default_content = ContentModel(
            id=str(uuid.uuid4()),
            module_id=module_id,
            chapter_id=chapter_id,
            title=f"Introduction to {module_id.replace('-', ' ').title()}",
            content=f"Welcome to {module_id.replace('-', ' ').title()} module. This is the introduction content for chapter {chapter_id}.",
            urdu_content=f"{module_id.replace('-', ' ').title()} کا تعارف. یہ {chapter_id} کے باب کا تعارفی مواد ہے۔",
            type="chapter",
            metadata={"module": module_id, "chapter": chapter_id},
            order=1,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        return default_content

@router.post("/", response_model=ContentResponse)
async def create_content(content_data: ContentCreateRequest, db = Depends(get_db)):
    """
    Create new content.
    """
    content_id = str(uuid.uuid4())
    now = datetime.utcnow()

    new_content = ContentModel(
        id=content_id,
        module_id=content_data.module_id,
        chapter_id=content_data.chapter_id,
        title=content_data.title,
        content=content_data.content,
        urdu_content=content_data.urdu_content,
        type=content_data.type,
        metadata=content_data.metadata,
        order=content_data.order,
        created_at=now,
        updated_at=now
    )

    db.add(new_content)
    await db.commit()
    await db.refresh(new_content)

    return new_content

@router.put("/{content_id}", response_model=ContentResponse)
async def update_content(content_id: str, content_data: ContentUpdateRequest, db = Depends(get_db)):
    """
    Update existing content.
    """
    result = await db.execute(
        select(ContentModel).where(ContentModel.id == content_id)
    )
    content_item = result.scalar_one_or_none()

    if not content_item:
        raise HTTPException(status_code=404, detail="Content not found")

    # Update fields that were provided
    if content_data.title is not None:
        content_item.title = content_data.title
    if content_data.content is not None:
        content_item.content = content_data.content
    if content_data.urdu_content is not None:
        content_item.urdu_content = content_data.urdu_content
    if content_data.metadata is not None:
        content_item.metadata = content_data.metadata
    if content_data.order is not None:
        content_item.order = content_data.order

    content_item.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(content_item)

    return content_item

@router.delete("/{content_id}")
async def delete_content(content_id: str, db = Depends(get_db)):
    """
    Delete content.
    """
    result = await db.execute(
        select(ContentModel).where(ContentModel.id == content_id)
    )
    content_item = result.scalar_one_or_none()

    if not content_item:
        raise HTTPException(status_code=404, detail="Content not found")

    await db.delete(content_item)
    await db.commit()

    return {"message": "Content deleted successfully"}

@router.get("/", response_model=List[ContentResponse])
async def list_content(module_id: Optional[str] = None, db = Depends(get_db)):
    """
    List all content, optionally filtered by module.
    """
    query = select(ContentModel)
    if module_id:
        query = query.where(ContentModel.module_id == module_id)

    query = query.order_by(ContentModel.order)

    result = await db.execute(query)
    content_items = result.scalars().all()

    return content_items

@router.get("/search", response_model=SearchResponse)
async def search_content(q: str, lang: Optional[str] = "en", db = Depends(get_db)):
    """
    Search content based on query string.
    """
    # This is a basic implementation - in a real system, you'd use the vector database
    # For now, we'll do a simple text search in the database

    query = select(ContentModel).where(
        ContentModel.content.contains(q) | ContentModel.title.contains(q)
    )

    result = await db.execute(query)
    content_items = result.scalars().all()

    search_results = []
    for content_item in content_items:
        snippet = content_item.content[:200] + "..." if len(content_item.content) > 200 else content_item.content
        search_results.append({
            "id": content_item.id,
            "title": content_item.title,
            "snippet": snippet,
            "score": 0.8  # In a real implementation, this would come from the search algorithm
        })

    # If no results found in database, return some default results
    if not search_results:
        search_results = [
            {
                "id": str(uuid.uuid4()),
                "title": f"Search results for: {q}",
                "snippet": f"No specific content found for '{q}', but you might find relevant information in the modules.",
                "score": 0.5
            }
        ]

    return SearchResponse(results=search_results)
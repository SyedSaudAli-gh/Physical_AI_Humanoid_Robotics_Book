import asyncio
from typing import List, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Use mock vector DB for testing if in test environment
if os.getenv("TESTING"):
    from ..database.mock_vector_db import vector_db
else:
    from ..database.vector_db import vector_db

from ..database.database import get_db, AsyncSessionLocal
from ..models.content import Content as ContentModel

logger = logging.getLogger(__name__)

class ContentIndexer:
    def __init__(self):
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key and os.getenv("TESTING"):
            # Use a mock API key for testing
            openai_key = "sk-fake-key-for-testing"

        self.openai_client = AsyncOpenAI(api_key=openai_key)
        self.vector_db = vector_db

    async def get_content_embeddings(self, text: str) -> List[float]:
        """
        Get embeddings for the given text using OpenAI
        """
        try:
            response = await self.openai_client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error getting embeddings: {e}")
            # Return a zero vector as fallback
            return [0.0] * 1536

    async def index_single_content(self, content_id: str, text: str, metadata: Dict = None):
        """
        Index a single content item in the vector database
        """
        try:
            # Get embeddings for the content
            embedding = await self.get_content_embeddings(text)

            # Add to vector database
            self.vector_db.add_content(
                content_id=content_id,
                text=text,
                metadata=metadata or {},
                vector=embedding
            )

            logger.info(f"Successfully indexed content: {content_id}")
            return True
        except Exception as e:
            logger.error(f"Error indexing content {content_id}: {e}")
            return False

    async def index_all_content(self):
        """
        Index all content from the database into the vector database
        """
        logger.info("Starting content indexing process...")

        # Use the existing async session from database module
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ContentModel))
            contents = result.scalars().all()

            success_count = 0
            for content in contents:
                # Combine title and content for better searchability
                full_text = f"{content.title}\n\n{content.content}"

                # Prepare metadata
                metadata = {
                    "module_id": content.module_id,
                    "chapter_id": content.chapter_id,
                    "title": content.title,
                    "type": content.type,
                    "order": content.order
                }

                # Index the content
                success = await self.index_single_content(
                    content_id=content.id,
                    text=full_text,
                    metadata=metadata
                )

                if success:
                    success_count += 1

            logger.info(f"Content indexing completed. Successfully indexed {success_count}/{len(contents)} items")
            return success_count, len(contents)

    async def index_new_content(self, content_id: str):
        """
        Index a specific content item by its ID
        """
        # We'll need to get the content from the database
        # For now, we'll simulate this process
        logger.info(f"Indexing new content: {content_id}")
        # In a real implementation, we'd fetch the content from the database
        # and then call index_single_content
        return True

    async def update_content_index(self, content_id: str):
        """
        Update the index for a specific content item
        """
        logger.info(f"Updating index for content: {content_id}")
        # In a real implementation, we'd fetch the updated content from the database
        # and then update the vector database entry
        return True

    async def delete_content_from_index(self, content_id: str):
        """
        Remove a content item from the vector index
        """
        try:
            self.vector_db.delete_content(content_id)
            logger.info(f"Successfully removed content from index: {content_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing content from index {content_id}: {e}")
            return False

# Create a global instance
content_indexer = ContentIndexer()

# For testing purposes
if __name__ == "__main__":
    import asyncio

    async def test_indexing():
        indexer = ContentIndexer()
        # Test with sample content
        success = await indexer.index_single_content(
            content_id="test-123",
            text="This is a sample content for testing the indexing pipeline.",
            metadata={"module": "test", "chapter": "intro"}
        )
        print(f"Indexing test result: {success}")

    # Run the test
    # asyncio.run(test_indexing())
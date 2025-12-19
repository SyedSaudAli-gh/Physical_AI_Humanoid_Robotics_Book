from typing import List, Dict, Optional
import uuid

class MockVectorDB:
    """
    Mock implementation of VectorDB for testing purposes.
    This doesn't require an actual Qdrant service to be running.
    """
    def __init__(self):
        # In-memory storage for testing
        self.storage = {}
        self.collection_name = "book_content"

    def add_content(self, content_id: str, text: str, metadata: Dict = None, vector: List[float] = None):
        """
        Add content to the mock vector database
        """
        if vector is None:
            # Create a simple mock vector
            vector = [0.0] * 1536

        self.storage[content_id] = {
            "content_id": content_id,
            "text": text,
            "metadata": metadata or {},
            "vector": vector
        }

    def search_content(self, query_vector: List[float], limit: int = 5) -> List[Dict]:
        """
        Mock search that returns some sample results
        """
        # For testing, return some mock results
        mock_results = []
        for i in range(min(limit, 3)):  # Return up to 3 mock results
            mock_results.append({
                "content_id": f"mock_content_{i}",
                "text": f"This is mock content result {i} for testing purposes.",
                "metadata": {"title": f"Mock Content {i}", "module": "test", "chapter": "intro"},
                "score": 0.8 - (i * 0.1)  # Decreasing scores
            })
        return mock_results

    def delete_content(self, content_id: str):
        """
        Delete content from the mock vector database
        """
        if content_id in self.storage:
            del self.storage[content_id]

    def update_content(self, content_id: str, text: str, metadata: Dict = None, vector: List[float] = None):
        """
        Update existing content in the mock vector database
        """
        if content_id in self.storage:
            self.delete_content(content_id)

        self.add_content(content_id, text, metadata, vector)

def get_vector_db_instance():
    """
    Factory function to get mock vector database instance for testing.
    """
    return MockVectorDB()

# Create a global instance
vector_db = get_vector_db_instance()
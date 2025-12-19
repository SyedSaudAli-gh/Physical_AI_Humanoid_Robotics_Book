import asyncio
from .database import engine, Base
from sqlalchemy import text
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

async def init_database():
    """
    Initialize the database by creating all tables
    """
    print("Initializing database...")

    # Create all tables defined in the models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Database initialized successfully!")

async def test_connection():
    """
    Test the database connection
    """
    try:
        async with engine.begin() as conn:
            # Execute a simple query to test the connection
            result = await conn.execute(text("SELECT 1"))
            print("Database connection test successful!")
            return True
    except Exception as e:
        print(f"Database connection test failed: {e}")
        return False

if __name__ == "__main__":
    # For now, just run the initialization
    # In a real application, you might want to use asyncio.run(init_database())
    print("Database initialization script - Run with proper async setup in your application")
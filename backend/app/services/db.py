import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise ValueError("MONGODB_URI environment variable is not set")
        # Use certifi's bundle for SSL verification (common fix for Azure/Atlas)
        _client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where())
    return _client


def get_db():
    return get_client()["text_summarizer"]

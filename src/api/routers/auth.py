from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from ..database.database import get_db
from ..models.user import User as UserModel

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token creation
SECRET_KEY = os.getenv("JWT_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"

# Pydantic models based on data-model.md
class UserCreateRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    background: Optional[dict] = {}

class UserUpdatePreferencesRequest(BaseModel):
    preferences: dict

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    background: Optional[dict]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def authenticate_user(db, email: str, password: str):
    result = await db.execute(UserModel.__table__.select().where(UserModel.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreateRequest, db = Depends(get_db)):
    """
    Register a new user with email, password, and background information.
    """
    # Check if user already exists
    result = await db.execute(UserModel.__table__.select().where(UserModel.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_id = str(uuid.uuid4())
    now = datetime.utcnow()
    new_user = UserModel(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        background=user_data.background,
        preferences={},
        created_at=now,
        updated_at=now,
        hashed_password=hashed_password
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

@router.post("/login")
async def login_user(credentials: UserCreateRequest, db = Depends(get_db)):
    """
    Login user with email and password.
    """
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }

@router.get("/profile", response_model=UserResponse)
async def get_profile(db = Depends(get_db)):
    """
    Get current user profile.
    """
    # This would require authentication in real implementation
    # For now, return a mock user
    # In a real implementation, we would extract user ID from JWT token
    from sqlalchemy import select
    result = await db.execute(select(UserModel).limit(1))
    user = result.scalar_one_or_none()

    if user:
        return user
    else:
        # Return a default response if no user found
        mock_user = UserModel(
            id=str(uuid.uuid4()),
            email="user@example.com",
            name="Test User",
            background={},
            preferences={},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            hashed_password="dummy_hash"
        )
        return mock_user

@router.put("/preferences")
async def update_preferences(request: UserUpdatePreferencesRequest, db = Depends(get_db)):
    """
    Update user preferences.
    """
    # This would require authentication in real implementation
    return {"success": True, "preferences": request.preferences}
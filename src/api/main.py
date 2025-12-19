from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging first
from .utils.logging_config import setup_logging, get_logger
logger = setup_logging()

# Import error handlers
from .utils.error_handlers import add_exception_handlers

# Import routers
from .routers import auth, content, rag
from .routers.vision import router as vision_router

app = FastAPI(
    title="Physical AI & Humanoid Robotics API",
    description="Backend API for the educational platform with RAG functionality",
    version="1.0.0",
    docs_url="/docs",  # Enable API documentation
    redoc_url="/redoc"  # Enable ReDoc documentation
)

# Add exception handlers
app = add_exception_handlers(app)

# Configure allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# Add CORS middleware with security settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    # Expose headers that frontend might need
    expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
)

# Add security headers via middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(rag.router, prefix="/api/chat", tags=["chat"])
app.include_router(vision_router, prefix="/api/vision", tags=["vision"])

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Physical AI & Humanoid Robotics API", "status": "running"}

@app.get("/health")
def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "healthy", "service": "api"}

if __name__ == "__main__":
    import uvicorn
    # Use host and port from environment or default values
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    logger.info(f"Starting API server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
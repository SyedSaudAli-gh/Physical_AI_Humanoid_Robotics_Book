from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .logging_config import get_logger
import traceback
from typing import Dict, Any

logger = get_logger(__name__)

class APIError(Exception):
    """
    Base exception class for API errors
    """
    def __init__(self, message: str, status_code: int = 500, details: Any = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

class ValidationError(APIError):
    """
    Exception raised for validation errors
    """
    def __init__(self, message: str, details: Any = None):
        super().__init__(message, 400, details)

class AuthenticationError(APIError):
    """
    Exception raised for authentication errors
    """
    def __init__(self, message: str = "Authentication failed", details: Any = None):
        super().__init__(message, 401, details)

class AuthorizationError(APIError):
    """
    Exception raised for authorization errors
    """
    def __init__(self, message: str = "Authorization failed", details: Any = None):
        super().__init__(message, 403, details)

class NotFoundError(APIError):
    """
    Exception raised when a resource is not found
    """
    def __init__(self, message: str = "Resource not found", details: Any = None):
        super().__init__(message, 404, details)

class DatabaseError(APIError):
    """
    Exception raised for database errors
    """
    def __init__(self, message: str = "Database error", details: Any = None):
        super().__init__(message, 500, details)

class ExternalServiceError(APIError):
    """
    Exception raised for external service errors (e.g., OpenAI, Qdrant)
    """
    def __init__(self, message: str = "External service error", details: Any = None):
        super().__init__(message, 502, details)

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handle HTTP exceptions
    """
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "http_exception",
                "message": str(exc.detail),
                "status_code": exc.status_code,
                "path": str(request.url)
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle request validation exceptions
    """
    logger.error(f"Validation Exception: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "validation_error",
                "message": "Request validation failed",
                "status_code": 422,
                "details": exc.errors(),
                "path": str(request.url)
            }
        }
    )

async def api_exception_handler(request: Request, exc: APIError):
    """
    Handle custom API exceptions
    """
    logger.error(f"API Exception: {exc.status_code} - {exc.message}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": exc.__class__.__name__,
                "message": exc.message,
                "status_code": exc.status_code,
                "details": exc.details,
                "path": str(request.url)
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions
    """
    logger.error(f"General Exception: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")

    # Log the full traceback for debugging
    error_id = f"err_{hash(str(exc) + str(request.url)) % 1000000}"

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "internal_server_error",
                "message": "An internal server error occurred",
                "status_code": 500,
                "error_id": error_id,
                "path": str(request.url)
            }
        }
    )

def add_exception_handlers(app):
    """
    Add exception handlers to the FastAPI application
    """
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(APIError, api_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    return app
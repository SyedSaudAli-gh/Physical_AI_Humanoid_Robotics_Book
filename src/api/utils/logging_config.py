import logging
import sys
from datetime import datetime
import os
from pythonjsonlogger import jsonlogger

def setup_logging():
    """
    Set up logging configuration for the application
    """
    # Create logs directory if it doesn't exist
    logs_dir = "logs"
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)

    # Create a custom formatter
    class CustomFormatter(logging.Formatter):
        def format(self, record):
            # Add extra fields to the record
            record.timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            record.service = "physical-ai-humanoid-api"
            record.level = record.levelname.lower()
            return super().format(record)

    # Configure the root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Create file handler for general logs
    file_handler = logging.FileHandler(f"logs/app.log")
    file_handler.setLevel(logging.INFO)

    # Create error file handler
    error_handler = logging.FileHandler(f"logs/error.log")
    error_handler.setLevel(logging.ERROR)

    # Create JSON formatter
    json_formatter = jsonlogger.JsonFormatter(
        '%(timestamp)s %(service)s %(level)s %(name)s %(message)s',
        rename_fields={'levelname': 'level', 'name': 'logger'}
    )

    # Create text formatter
    text_formatter = CustomFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Set formatters
    console_handler.setFormatter(text_formatter)
    file_handler.setFormatter(json_formatter)
    error_handler.setFormatter(json_formatter)

    # Add handlers to root logger
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)

    # Set specific loggers to appropriate levels
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)  # Reduce SQLAlchemy logs
    logging.getLogger("urllib3").setLevel(logging.WARNING)     # Reduce urllib3 logs
    logging.getLogger("asyncio").setLevel(logging.INFO)       # Appropriate for asyncio

    return root_logger

def get_logger(name: str) -> logging.Logger:
    """
    Get a logger with the specified name
    """
    return logging.getLogger(name)

# Initialize logging
logger = setup_logging()
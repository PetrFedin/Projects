import sys
from loguru import logger
from app.core.config import settings

def setup_logging():
    # Remove default handler
    logger.remove()
    
    # Add standardized handler
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="INFO",
    )
    
    # Optional: file logging for production
    logger.add(
        "logs/app.log",
        rotation="10 MB",
        retention="1 week",
        level="WARNING",
    )

setup_logging()

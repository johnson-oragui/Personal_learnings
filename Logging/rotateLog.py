#!/usr/bin/env python
"""
The basicConfig method configures the logging settings with two handlers: a StreamHandler for logging to the console and a RotatingFileHandler for logging to a file with rotation based on size (maxBytes) and backup count (backupCount).
The logger object is created with the __name__ parameter.
Log messages at different levels are emitted, and they will be directed to both the console and the rotating log file.
The rotating file handler (RotatingFileHandler) ensures that log files don't grow indefinitely. When a log file reaches the specified size (maxBytes), it gets rotated, and the backup count (backupCount) determines how many rotated log files to keep.

You can customize the configuration based on your specific needs, and you may also explore other handlers provided by the logging module to achieve various logging scenarios.
"""
import logging
from logging.handlers import RotatingFileHandler

# configure the logging settings
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',  # customize format of log messages
    handlers=[
        logging.StreamHandler(),  # log to console
        RotatingFileHandler('example2.log', maxBytes=100000, backupCount=3)
    ]
    )

# create a logger
logger = logging.getLogger(__name__)

# Log messages at different levels
logger.debug("This is a debug message")
logger.info("This is an info message")
logger.warning("This is a warning message")
logger.error("This is an error message")
logger.critical("This is a critical message")

def division(a: int, b: int) -> float:
    """
    """
    try:
        result = a / b
        logger.debug(f'Division result: {result}')
    except ZeroDivisionError as e:
        logger.error(f'Division by zero: {e}')
        result = None
    except Exception as e:
        logger.exception(f'An unexpected error occurred: {e}')
        result = None
    
    return result

if __name__ == '__main__':
    result = division(10, 2)
    result = division(10, 0)
    result = division('10', 2)

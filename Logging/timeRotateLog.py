#!/usr/bin/env python
"""
The basicConfig method configures the logging settings with two handlers: a StreamHandler for logging to the console and a TimedRotatingFileHandler for logging to a file with rotation based on a specified time interval (when="midnight") and a daily rotation (interval=1 day). The backupCount parameter determines how many rotated log files to keep.

The logger object is created with the __name__ parameter.

Log messages at different levels are emitted, and they will be directed to both the console and the timed rotating log file.

The TimedRotatingFileHandler is particularly useful when you want to create log files that rotate at specific intervals, such as daily or hourly, based on the specified when and interval parameters.
"""
import logging
from logging.handlers import TimedRotatingFileHandler

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(), # log to console
        TimedRotatingFileHandler('timeLog.log', when='midnight', interval=1, backupCount=3)  # log to time rorating file
    ]
)

logger = logging.getLogger(__name__)

def division(a, b):
    result = None
    try:
        result = a / b
        logger.debug(f'division result: {result}')
    except ZeroDivisionError as e:
        logger.error(f'Division by zero: {e}')
    except Exception as e:
        logger.exception(f'An error occurred: {e}')

    return result


if __name__ == '__main__':
    result = division(10, 5)

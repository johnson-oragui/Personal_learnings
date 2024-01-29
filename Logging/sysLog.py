#!/usr.bin/wnv python3
"""
The basicConfig method configures the logging settings with two handlers: a StreamHandler for logging to the console and a SysLogHandler for sending log messages to the system logger.

The SysLogHandler is configured with the address='/dev/log', assuming a Unix-like system where /dev/log is the syslog socket.

The logger object is created with the __name__ parameter.

Log messages at different levels are emitted. They will be directed to both the console and the system logger.

Practical use cases for SysLogHandler include centralized logging on a Unix-like system where syslog is the standard logging facility. The messages sent to syslog can then be aggregated and analyzed centrally, providing a centralized view of the system's log events.
"""
import logging
from logging.handlers import SysLogHandler

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Log to the console
        SysLogHandler(address='/dev/log')  # Send log messages to syslog
    ]
)


logger = logging.getLogger(__name__)

def division(a, b):
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

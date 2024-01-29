#!/usr/bin/env python

import logging
from typing import List

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('example.log'),
        logging.StreamHandler(),  # log to console
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

#!/usr/bin/env python

import logging

# configure the logging settings
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',  # customize format of log messages
    handlers=[
        logging.FileHandler('example.log'),  # log to a file
        logging.StreamHandler()  # log to console
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

#!/usr/bin/env python
"""`
The primary purpose of the capacity parameter is to control the batching of log records. For example, if you set capacity=5, the MemoryHandler will hold up to 5 log records in memory before flushing them to the target handler.

In the case where you have a MemoryHandler with a capacity of 2 and you log a single message, that message will still be flushed to the target handler (in this case, a FileHandler). The MemoryHandler is not preventing the immediate writing of a single log record; instead, it's designed to buffer records and flush when the specified capacity is reached.

The MemoryHandler doesn't wait for the capacity to be reached before writing records to the target; it simply starts buffering records. If you log a single record, it will be written to the target handler immediately. The capacity parameter becomes relevant when you log more records, and the buffer starts filling up.
"""
import logging

from logging.handlers import MemoryHandler


logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        MemoryHandler(capacity=2, target=logging.FileHandler('buffered_log.log'))
        # Buffer log records in memory and flush to a file when capacity is reached
    ]
)


logger = logging.getLogger(__name__)

logger.debug('hello')
# Log messages at different levels
for i in range(1):
    logger.debug(f"This is log message {i}")

# Log messages at different levels again, exceeding the buffer capacity
for i in range(1):
    logger.debug(f"This is another log message {i}")

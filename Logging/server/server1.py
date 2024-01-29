#!/usr/bin/env python

import logging
import logging.handlers
import threading
import time

def start_service1():
    logger = logging.getLogger("Service1")
    logger.setLevel(logging.DEBUG)

    socket_handler = logging.handlers.SocketHandler('localhost', logging.handlers.DEFAULT_TCP_LOGGING_PORT)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    socket_handler.setFormatter(formatter)
    logger.addHandler(socket_handler)

    for i in range(5):
        logger.info(f"Service1 log message {i}")
        time.sleep(1)

if __name__ == "__main__":
    service1_thread = threading.Thread(target=start_service1)
    service1_thread.start()
    service1_thread.join()

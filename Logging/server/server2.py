#!/usr/bin/env python


import logging
import logging.handlers
import threading
import time

def start_service2():
    logger = logging.getLogger("Service2")
    logger.setLevel(logging.DEBUG)

    socket_handler = logging.handlers.SocketHandler('localhost', logging.handlers.DEFAULT_TCP_LOGGING_PORT)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    socket_handler.setFormatter(formatter)
    logger.addHandler(socket_handler)

    for i in range(3):
        logger.warning(f"Service2 log message {i}")
        time.sleep(2)

if __name__ == "__main__":
    service2_thread = threading.Thread(target=start_service2)
    service2_thread.start()
    service2_thread.join()

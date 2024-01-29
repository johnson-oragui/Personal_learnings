import logging
import logging.handlers
import socketserver
import threading
from queue import Queue
from typing import Optional

class LogRecordStreamHandler(socketserver.StreamRequestHandler):
    def handle(self):
        while True:
            try:
                # Use Optional to handle the case where log_record_queue might not be present
                record_queue: Optional[Queue] = getattr(self.server, 'log_record_queue', None)
                if record_queue is None:
                    break
                record = record_queue.get()
                if record is None:
                    break
                self.send(record)
            except (BrokenPipeError, ConnectionResetError):
                break

    def send(self, record):
        try:
            msg = self.format_record(record)
            self.wfile.write(msg.encode('utf-8'))
            self.wfile.flush()
        except Exception as e:
            self.server.handleError(record)

    def format_record(self, record: logging.LogRecord) -> str:
        # Use the default formatter for now
        formatter = logging.Formatter()
        return formatter.format(record)

def start_logging_server():
    log_record_queue = Queue()

    file_handler = logging.FileHandler('server.log')  # Add a FileHandler for logging to a file
    queue_handler = logging.handlers.QueueHandler(log_record_queue)

    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

    root_logger = logging.getLogger()
    root_logger.addHandler(file_handler)
    root_logger.addHandler(queue_handler)


    server = socketserver.ThreadingTCPServer(('localhost', 9020), LogRecordStreamHandler)
    server.log_record_queue = log_record_queue
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.start()
    return server_thread

if __name__ == "__main__":
    # Configure logging using basicConfig or a logging.config file if needed
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
    
    server_thread = start_logging_server()
    
    # Optional: Allow the server to run indefinitely
    # server_thread.join()

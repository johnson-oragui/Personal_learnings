#!/usr/bin/env python3
"""
Module to obfuscate data
"""
import re
import logging
from typing import List

def filter_datum(fields: List[str], redaction: str,
                 message: str, separator: str) -> str:
    """
    Function to obsfuscate
    """
    for field in fields: 
        message = re.sub(r"{}=.*?{}".format(field, separator),
                         f"{field}={redaction}{separator}", message)
    return message

class RedactingFormatter(logging.Formatter):
    """
    Redacting formater class
    """
    REDACTION = '***'
    FORMAT = "[HOLBERTON] %(name)s %(levelname)s %(asctime)-15s: %(message)s"
    SEPARATOR = ';'

    def __init__(self, fields):
        super(RedactingFormatter, self).__init__(self.FORMAT)
        self.fields = fields

    def format(self, record):
        new_message = filter_datum(self.fields,
                                   self.REDACTION,
                                   super().format(record),
                                   self.SEPARATOR)
        return new_message


if __name__ == '__main__':
    message = "name=Bob;email=bob@dylan.com;ssn=000-123-0000;password=bobby2019;"
    log_record = logging.LogRecord("my_logger", logging.INFO, None, None, message, None, None)
    formatter = RedactingFormatter(fields=("email", "ssn", "password"))
    print(formatter.format(log_record))

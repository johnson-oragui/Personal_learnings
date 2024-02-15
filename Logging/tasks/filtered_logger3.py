#!/usr/bin/env python3
import re
import logging
import os


PII_FIELDS = ('email', 'phone', 'ssn', 'password', 'ip')

def filter_datum(fields, redaction, message, separator):
    for field in fields: 
        message = re.sub(r"{}=.*?{}".format(field, separator),
                         f"{field}={redaction}{separator}", message)
    return message

def main():
    fields = ["password", "date_of_birth"]
    messages = ["name=egg;email=eggmin@eggsample.com;password=eggcellent;date_of_birth=12/12/1986;", "name=bob;email=bob@dylan.com;password=bobbycool;date_of_birth=03/04/1993;"]

    for message in messages:
        print(filter_datum(fields, 'xxx', message, ';'))


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
        message = filter_datum(self.fields, self.REDACTION, super().format(record), self.SEPARATOR)
        return message

def get_logger() -> logging.Logger:
    formatter = RedactingFormatter(list(PII_FIELDS))
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger = logging.getLogger('user_data')
    logger.propagate = False
    logger.setLevel(logging.INFO)
    logger.addHandler(stream_handler)
    return logger
    
if __name__ == '__main__':
    print(get_logger.__annotations__.get('return'))
    print("PII_FIELDS: {}".format(len(PII_FIELDS)))


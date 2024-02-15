#!/usr/bin/env python3
"""
Regular expression module
"""
import re
from typing import List

def filter_datum(fields: List, redaction: str, message: str, separator: str) -> str:  # noqa
    """FUnction for Detail redaction

    Args:
        fields (List): [a list of strings representing all fields to obfuscate]
        redaction (str): [ string representing by what the field will be obfuscated]
        message (str): [a string representing the log line]
        separator (str): [a string representing by which character is separating all fields in the log line]

    Returns:
        str: [str representation of the log line]
    """
    for field in fields: 
        message = re.sub(r"{}=.*?{}".format(field, separator),
                         f"{field}={redaction}{separator}", message)
    return message

def main() -> None:
    """
    """
    fields = ["password", "date_of_birth"]
    messages = ["name=egg;email=eggmin@eggsample.com;password=eggcellent;date_of_birth=12/12/1986;", "name=bob;email=bob@dylan.com;password=bobbycool;date_of_birth=03/04/1993;"]

    for message in messages:
        print(filter_datum(fields, 'xxx', message, ';'))

    
if __name__ == '__main__':
    main()


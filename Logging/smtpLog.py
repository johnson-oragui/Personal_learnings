#!/usr/bin/env python
"""
The mailhost parameter is set to ("smtp.gmail.com", 587), which are the Gmail SMTP server details.
The fromaddr parameter is set to your Gmail address.
The credentials parameter is set to your Gmail credentials, where the first element is your Gmail address and the second element is your Gmail password.
The secure parameter is set to (None, None), which means to use STARTTLS for encryption. Gmail's SMTP server supports STARTTLS.
Note: Using your Gmail password directly in the code may not be secure. Consider using an app-specific password or other secure authentication methods. Additionally, enabling less secure apps in your Gmail account may be required for this to work.

Always be cautious with credentials and consider using secure methods when dealing with sensitive information.
"""
import logging
from logging.handlers import SMTPHandler

logging.basicConfig(
    level=logging.ERROR,  # logging level to error
    format='%(asctime)s - %(levelname)s - %(message)s',  # log format
    handlers=[
        logging.StreamHandler(),  # log to the console
        SMTPHandler(
            mailhost=('smtp.gmail.com', 587),  # gmail smtp server details
            fromaddr='your@gmail.com',  # your gmail address
            toaddrs=['recepient@gmail.com'],  # recipient addresses
            subject='log m,essage',  # subject of the message
            credentials=('your@gmail.com', 'password'),  # your gmail credentials
            secure=(),  # use STARTTLS for ecryption
        )  # send log message via email
    ]
)

logger = logging.getLogger(__name__)

def division(a, b):
    """
    """
    result = None
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

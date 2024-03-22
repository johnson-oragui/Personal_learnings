from email_validator import validate_email
import re
from typing import Optional

def email_format_validation(email: str) -> Optional[bool]:
    """
    Validate email format using email_validator library.
    """
    try:
        valid = validate_email(email)
        return valid
    except Exception:
        return False

def validate_phone_number(phone_number: str) -> bool:
    """
    Validate phone number format using regular expressions.
    """
    # Define a regular expression pattern for phone numbers
    # This pattern matches:
    # - Optional country code (starting with '+', followed by digits)
    # - Optional area code (enclosed in parentheses, followed by digits)
    # - Phone number digits separated by hyphens, periods, or spaces
    pattern = r'^(\+\d+)?(\(\d+\))?[\d\-\. ]+$'
    return re.match(pattern, phone_number) is not None

def validate_user_inputs(inputs: dict)-> bool:
    """
    
    """
    for key, value in inputs.items():
        if (value and value.strip() == '') or not value:
            return False
    return True

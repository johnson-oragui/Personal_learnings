from email_validator import validate_email, EmailNotValidError
import bleach
import re
from typing import Optional

def email_format_validation(email: str) -> Optional[object]:
    """
    Validate email format using email_validator library.
    """
    try:
        valid = validate_email(email)
        return valid
    except EmailNotValidError:
        return

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
    Validates input values
    """
    try:
        for key, value in inputs.items():
            if (value and value.strip() == '') or not value:
                return False
    except Exception:
        raise Exception('Could not validate inputs')
    return True

def xssSanitizer(inputs: dict) -> dict:
    """
    Sanitizes inputs against xss
    """
    ALLOWED_TAGS = {
        'first_name': [],  # Allow basic formatting for names
        'last_name': [],
        'email': [],  # No tags allowed for email
        'phone_number': [],  # No tags allowed for phone number
        'username': [],  # No tags allowed for username
        'password': [],  # No tags allowed for password
        'account_type': [],  # No tags allowed for account type
    }

    ALLOWED_ATTRIBUTES = {
        '*': ['class']  # Allow 'class' attribute on all allowed tags
    }
    try:
        sanitized_data = {}
        for key, value in inputs.items():
            if key in ALLOWED_TAGS:
                tags = ALLOWED_TAGS[key]
                attrs = ALLOWED_ATTRIBUTES
            else:
                tags = []
                attrs = {}
            if key != 'password':  # Skip sanitization for password
                sanitized_data[key] = bleach.clean(value, tags=tags, attributes=attrs, strip=True)
            else:
                sanitized_data[key] = value  # No sanitization for password
    except Exception as exc:
        raise(Exception(exc))
    print('sanitized_data: ', sanitized_data)
    return sanitized_data

def allowed_characters(names: dict) -> tuple:
    """
    
    """
    try:
        alphanumeric_underscore_hyphen = r"[a-zA-Z0-9_-]+"

        letters_only = r"[a-zA-Z]+"

        for key, value in names.items():
            if key == 'first_name':
                first_name_bool = re.match(letters_only, value)
                print('first_name_bool: ', first_name_bool)
            elif key == 'last_name':
                last_name_bool = re.match(letters_only, value)
                print('last_name_bool: ', last_name_bool)
            elif key == 'username':
                username_bool = re.match(alphanumeric_underscore_hyphen, value)
                print('username_bool: ', username_bool)
    except Exception:
        raise ValueError('Could not validate via allowed_characters')
    return first_name_bool, last_name_bool, username_bool

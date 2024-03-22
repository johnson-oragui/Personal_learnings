import re

def validate_email(email: str) -> bool:
    """
    Validate email format using regular expressions.
    """
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

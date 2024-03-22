def validate_user_inputs(inputs: dict)-> bool:
    """
    
    """
    for key, value in inputs.items():
        if (value and value.strip() == '') or not value:
            return False
    return True

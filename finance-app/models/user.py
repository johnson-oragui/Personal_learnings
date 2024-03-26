from bson import ObjectId
import bcrypt

def check_password(password: str, db_pwd) -> bool:
    """
    Compare the password
    """
    # Check if the provided password matches the hashed password
    return bcrypt.checkpw(password.encode('utf-8'), db_pwd.encode('utf-8'))

class User:
    """
    User class that represents a user
    """
    def __init__(self, user_data: dict) -> None:
      self.id = ObjectId()
      self.first_name = user_data.get('first_name')
      self.last_name = user_data.get('last_name')
      self.email = user_data.get('email')
      self.phone_number = user_data.get('phone_number')
      self.username = user_data.get('username')
      self.password = self._hash_password(user_data.get('password'))
      self.account_type = user_data.get('account_type')

    def _hash_password(self, password: str) -> str:
        """
        Hash password
        """
        # Hash the password securely using bcrypt
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def to_dict(self) -> dict:
        """
        COnverts to a dictionary
        """
        return {
          "_id": self.id,
          "firstName": str(self.first_name),
          "lastName": str(self.last_name),
          "email": str(self.email),
          "phoneNumber": self.phone_number,
          "username": str(self.username),
          "password": self.password,
          "accountType": self.account_type,
        }
    

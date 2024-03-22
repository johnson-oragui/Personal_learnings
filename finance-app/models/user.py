from bson import ObjectId
import bcrypt
from app import mongo

class User:
    def __init__(self, first_name, last_name, email, phone_number, username, password, account_type):
      self.id = ObjectId()
      self.first_name = first_name
      self.last_name = last_name
      self.email = email
      self.phone_number = phone_number
      self.username = username
      self.password = self._hash_password(password)
      self.account_type = account_type

    def _hash_password(self, password):
        # Hash the password securely using bcrypt
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        # Check if the provided password matches the hashed password
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self):
        """
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
    


from typing import Optional

class DB:
    """
    Mongo DB implementation class
    """
    def __init__(self):
        from app import mongo

        self.USER_COLLECTIONS = mongo.db.users

        self.ACCOUNT_COLLECTIONS = mongo.db.accounts

        self.TRANSACTION_COLLECTIONS = mongo.db.transactions

    
    def find_user_by_email(self, email: str) -> Optional[dict]:
        """
        Find a user by email in the database.
        """
        try:
            user = self.USER_COLLECTIONS.find_one({"email": email})
            if not user:
                return
        except Exception:
            return
        print(user)
        return user
    
    def find_user_by_username(self, username: str) -> Optional[dict]:
        """
        Find a user by username in the database.
        """
        try:
            user = self.USER_COLLECTIONS.find_one({"username": username})
            if not user:
                return
        except Exception:
            return
        print(user)
        return user

    def create_user(self, data: dict) -> Optional[dict]:
        """
        Create a new user in the database.
        """
        try:
            # Implement user creation logic using pymongo insert_one
            new_user = self.USER_COLLECTIONS.insert_one(data)
            return new_user.inserted_id
        except Exception:
            return
            

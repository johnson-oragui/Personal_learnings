from bson import ObjectId
from typing import Optional, Tuple
from models.account import Account

class DB:
    """
    Mongo DB implementation class
    """
    def __init__(self):
        from app import client

        self.USER_COLLECTIONS = client.db.users

        self.ACCOUNT_COLLECTIONS = client.db.accounts

        self.TRANSACTION_COLLECTIONS = client.db.transactions

    
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

    def create_user(self, user_dict: dict) -> Optional[Tuple[ObjectId, ObjectId]]:
        """
        Create a new user in the user database.
        """
        try:
            # Implement user creation logic using pymongo insert_one
            new_user = self.USER_COLLECTIONS.insert_one(user_dict)
            if new_user.inserted_id:
                account = Account(user_dict)
                account_dict = account.to_dict()
                new_account = self.ACCOUNT_COLLECTIONS.insert_one(account_dict)
                if new_account.inserted_id:
                    return new_user.inserted_id, new_account.inserted_id
                if not new_account.inserted_id:
                    deleted_user = self.USER_COLLECTIONS.delete_one({"_id": user_dict.get('_id')})
                    if deleted_user.deleted_count == 0:
                        self.USER_COLLECTIONS.delete_one({"_id": user_dict.get('_id')})
                    else:
                        return None, None
        except Exception:
            return None, None
        return None, None
            

    def create_user_with_transaction(self, user_dict: dict) -> Optional[tuple]:
        """
        Create a new user in the user database.
        """
        from app import client
        session = client.cx.start_session()
        try:
            with session.start_transaction():
                new_user = self.USER_COLLECTIONS.insert_one(user_dict)
                if new_user.inserted_id:
                    account = Account(user_dict)
                    account_dict = account.to_dict()
                    new_account = self.ACCOUNT_COLLECTIONS.insert_one(account_dict)
                    if new_account.inserted_id:
                        return new_user.inserted_id, new_account.inserted_id
                    else:
                        raise Exception('Failed to insert account')
                else:
                    raise Exception('Failed to insert user')
        except Exception as e:
            print(f"An error occurred: {e}")
            session.abort_transaction()
            raise e
        finally:
            session.end_session()

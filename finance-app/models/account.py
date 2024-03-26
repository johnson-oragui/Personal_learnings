import uuid
from datetime import datetime

class Account:
    def __init__(self, user: dict) -> None:
      self.user_id = user.get('_id')
      self.account_holder = f"{user.get('firstName')} {user.get('lastName')}"
      self.account_id = f'ACC{str(uuid.uuid4())[:8]}'
      self.account_type = user.get('accountType')
      self.account_balance = 0
      self.limit = 10000
      self.last_updated = datetime.now()

    def to_dict(self) -> dict:
      """
      Converts to dict representation
      """
      return {
        "user_id": self.user_id,
        "accountHolder": self.account_holder,
        "accountId": self.account_id,
        "accountType": self.account_type,
        "accountBalance": self.account_balance,
        "accountLimit": self.limit,
        "lastUpdated": self.last_updated,
    }

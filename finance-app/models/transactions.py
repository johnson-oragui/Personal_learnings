from bson import ObjectId
from datetime import datetime
from uuid import uuid4

class Transaction:
    def __init__(self, account: dict, receiver: str, amount: int) -> None:
      self.id = ObjectId()
      self.sender = account.get('accountHolder')
      self._receiver = receiver
      self.account_id = account.get('accountId')
      self._amount = amount
      self.code = str(uuid4())[:8]
      self.date_of_transaction = datetime.now()

      @property
      def _receiver(self):
          return self._receiver
      
      @_receiver.setter
      def _receiver(self, value):
          """
          """
          if isinstance(value, str):
              self._receiver = value
      
      @property
      def _amount(self):
          return self._amount
      
      @_amount.setter
      def _amount(self, value):
          """
          """
          if isinstance(value, int):
              self._amount = value

    def to_dict(self)-> dict:
      """
      """
      return {
        "_id": self.id,
        "sender": self.sender,
        "receiver": self._receiver,
        "accountId": self.account_id,
        "amount": self._amount,
        "code": self.code,
        "date_of_transaction": self.date_of_transaction
    }

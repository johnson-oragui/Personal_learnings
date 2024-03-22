from models.user import User
from models.account import Account
from models.transactions import Transaction
from app import mongo


# Create a new user
new_user = User("John", "Doe", "john@example.com", "1234567890", "johndoe", "password", "standard")
user_dict = new_user.to_dict()
user_result = mongo.db.users.insert_one(user_dict)
print('user_dict: ', user_dict)
print('user_result: ', user_result)
print()
# Create an account for the new user
new_account = Account(user_dict)
account_dict = new_account.to_dict()
account_result = mongo.db.accounts.insert_one(account_dict)
print('user_result: ', account_dict)
print('user_result: ', account_result)

transfer = Transaction(account_dict, 'Ben dier', 100)
transfer_dict = transfer.to_dict()
transfer_result = mongo.db.transactions.insert_one(transfer_dict)

filter = {"accountId": account_dict["accountId"]}
account_balance = mongo.db.accounts.find_one_and_update(filter, {"$inc": {"accountBalance": -100}})
print('account_balance: ', account_balance)

print()

print('transfer_dict: ', transfer_dict)
print('transfer_result: ', transfer_result)

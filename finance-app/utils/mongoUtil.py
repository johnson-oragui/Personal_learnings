from pymongo import MongoClient


class MongoDB:

    mongoDB = MongoClient('mongodb://localhost:27017/')
    DB = mongoDB['finance']
    users_collection = DB['users']
    accounts_collection = DB['accounts']
    transactions_collection = DB['transactions']

from flask import Blueprint

auth_views = Blueprint('auth_views', __name__)
account_views = Blueprint('account_views', __name__)
transactions_views = Blueprint('transactions_views', __name__)
pin_views = Blueprint('pin_views', __name__)

from views.auth import *
from views.account import *
from views.pin import *
from views.transactions import *

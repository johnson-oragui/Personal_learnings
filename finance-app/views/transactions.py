from flask import request, render_template
from views import transactions_views


@transactions_views.route('/transactions/:id')
def all_transactions(user_id):
    """
    Register new user
    """
    if request.method == 'POST':
        pass
    render_template('register.html')


@transactions_views.route('/transaction/:id')
def transaction(user_id):
    """
    Register new user
    """
    if request.method == 'POST':
        pass
    render_template('register.html')


@transactions_views.route('/transfer/:id', methods=['GET', 'POST'])
def transfer(user_id):
    """
    Register new user
    """
    if request.method == 'POST':
        pass
    render_template('register.html')

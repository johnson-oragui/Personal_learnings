from flask import request, render_template
from views import account_views


@account_views.route('/dashboard/', strict_slashes=False)
def dashboard():
    """
    Get user account
    """
    return render_template('dashboard.html')


@account_views.route('/account/:id')
def account(user_id):
    """
    Get user account
    """
    render_template('account.html')


@account_views.route('/update_account/:id', methods=['GET', 'POST'])
def update_account(user_id):
    """
    Get user account
    """
    if request.method == 'POST':
        pass
    render_template('update.html')


@account_views.route('/delete_account/:id', methods=['GET', 'POST'])
def delete_account(user_id):
    """
    Get user account
    """
    if request.method == 'POST':
        pass
    render_template('delete.html')

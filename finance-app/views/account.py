from flask import request, render_template, redirect, url_for, flash
from flask_jwt_extended import jwt_required, get_jwt_identity
from views import account_views


@account_views.before_request
def check_jwt_presence():
    """
    checks for jwt for every request
    """
    try:
        get_jwt_identity()
    except Exception:
        flash('Login to access this page', 'error')
        return redirect(url_for('auth_views.login'))


@account_views.route('/dashboard', strict_slashes=False)
@jwt_required()
def dashboard():
    """
    Get user account
    """
    current_user = get_jwt_identity()
    print('current_user from dashboard: ', current_user)
    return render_template('dashboard.html', username=current_user.get('username'))


@account_views.route('/account/:id')
@jwt_required()
def account(user_id):
    """
    Get user account
    """
    try:
        current_user = get_jwt_identity()
        print(request.headers.get('Authorization'))
        render_template('account.html')
    except Exception:
        return redirect(url_for('auth_views.login'))


@account_views.route('/update_account/:id', methods=['GET', 'POST'])
@jwt_required()
def update_account(user_id):
    """
    Get user account
    """
    if request.method == 'POST':
        pass
    render_template('update.html')


@account_views.route('/delete_account/:id', methods=['GET', 'POST'])
@jwt_required()
def delete_account(user_id):
    """
    Get user account
    """
    if request.method == 'POST':
        pass
    render_template('delete.html')

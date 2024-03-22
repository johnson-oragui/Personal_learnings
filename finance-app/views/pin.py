from flask import request, render_template
from views import pin_views


@pin_views.route('/pin/:id')
def change_pin(user_id):
    """
    Register new user
    """
    if request.method == 'POST':
        pass
    render_template('register.html')


@pin_views.route('/pin/:id')
def confirm_change_pin(user_id):
    """
    Register new user
    """
    if request.method == 'POST':
        pass
    render_template('register.html')

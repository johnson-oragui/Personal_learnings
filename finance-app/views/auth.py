from flask import request, render_template
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from views import auth_views
from utils.helperFunc.validate_user_inputs import validate_user_inputs


@auth_views.route('/register', methods=['GET', 'POST'])
def register():
    """
    Register new user
    """
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        phone_number = request.form.get('phone_number')
        username = request.form.get('username')
        password = request.form.get('password')

        inputs: dict = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "username": username,
            "password": password
        }
        # validate user inputs are not empty, returns true if not empty
        user_inputs: bool = validate_user_inputs(inputs)
        if not user_inputs:
            return render_template('register.html', inputs=inputs)

        # validate email format

        # check if email already exists in database

        # vaalidate phone number format

        # validate length of username, and password

        # sanitized user inputs
    return render_template('register.html')


@auth_views.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """
    Login new user
    """
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(username)
        print(password)
        return render_template('login.html')

        # validate user inputs are not empty

        # sanitized user inputs
    return render_template('login.html')


@auth_views.route('/logout/:id')
@jwt_required()
def logout(user_id):
    """
    Logout new user
    """
    return render_template('login.html')

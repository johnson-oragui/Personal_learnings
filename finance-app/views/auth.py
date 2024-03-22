from flask import request, render_template, flash, redirect, url_for
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from . import auth_views
from utils.helperFunc.db_helpers import DB
from utils.helperFunc.user_inputs_helpers import *
from models.user import User



@auth_views.route('/register', methods=['GET', 'POST'])
def register():
    """
    Register new user
    """
    db = DB()
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        phone_number = request.form.get('phone_number')
        username = request.form.get('username')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        account_type = request.form.get('account_type')

        inputs: dict = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "username": username,
            "password": password,
            "account_type": account_type
        }
        if not (password == password2):
            flash('Both passwords must be the same', 'error')
            return render_template('register.html', inputs=inputs)
        # validate user inputs are not empty, returns true if not empty
        user_inputs: bool = validate_user_inputs(inputs)
        if not user_inputs:
            flash('All fields must be filled', 'error')
            return render_template('register.html', inputs=inputs)

        # validate email format
        email_format = email_format_validation(email)
        if not email_format:
            flash('Invalid email format', 'error')
            return render_template('register.html', inputs=inputs)

        # check if email already exists in database
        user_email_exists = db.find_user_by_email(email)
        if user_email_exists:
            print('user exist')
            flash('Email already exists', 'error')
            return render_template('register.html', inputs=inputs)
        
        # check if email already exists in database
        username_exists = db.find_user_by_username(username)
        if username_exists:
            print('user exist')
            flash('username already exists', 'error')
            return render_template('register.html', inputs=inputs)

        # vaalidate phone number format
        pone_number_validate = validate_phone_number(phone_number)
        if not pone_number_validate:
            flash('Invalid phone number format', 'error')
            return render_template('register.html', inputs=inputs)

        # validate length of username, and password
        if len(username) <= 3:
            flash('Username must be up to 4 characters', 'error')
            return render_template('register.html', inputs=inputs)
        
        # sanitized user inputs

        user = User(first_name, last_name, email, phone_number, username, password, account_type)

        new_user = db.create_user(user.to_dict())
        if not new_user:
            flash('User could not be created, try again', 'error')
            return render_template('register.html', inputs=inputs)
        return redirect(url_for('/login'))
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


@auth_views.route('/logout/')
@jwt_required()
def logout():
    """
    Logout new user
    """
    return render_template('login.html')

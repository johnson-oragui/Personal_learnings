from os import getenv
from flask import request, render_template, flash, redirect, url_for, make_response
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, unset_jwt_cookies
from datetime import timedelta
from . import auth_views
from utils.mongodb_manager import DB
from utils.user_inputs_manager import *
from models.user import *



@auth_views.route('/register', methods=['GET', 'POST'])
def register():
    """
    Register new user
    """
    # create an instance of mongodb manager
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
        
        # validate user inputs are not empty, returns true if not empty
        user_inputs: bool = validate_user_inputs(inputs)
        if not user_inputs:
            flash('All fields must be filled', 'error')
            return render_template('register.html', inputs=inputs)
        
        # define allowed characters for first, last, and user name.
        # returns boolean indicating whether the field has a xter allowed
        try:
            fn, ln, us = allowed_characters({"first_name": first_name,
                                            "last_name": last_name,
                                            "username": username
                                            })
        except ValueError:
            flash('COuld not proccess the form, try again', 'error')
            return render_template('register.html', inputs=inputs)
        if not fn:
            flash('Only alphabets allowed for first name', 'error')
            return render_template('register.html', inputs=inputs)
        if not ln:
            flash('Only alphabets allowed for last name', 'error')
            return render_template('register.html', inputs=inputs)
        if not us:
            flash('Only alphabets, numbers, underscore, and hyphen allowed', 'error')
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
        
        # vaalidate phone number format
        phone_number_validate = validate_phone_number(phone_number)
        if not phone_number_validate:
            flash('Invalid phone number format', 'error')
            return render_template('register.html', inputs=inputs)
        
        # check if email already exists in database
        username_exists = db.find_user_by_username(username)
        if username_exists:
            print('user exist')
            flash('username already exists', 'error')
            return render_template('register.html', inputs=inputs)
        
        if not (password == password2):
            flash('Both passwords must be the same', 'error')
            return render_template('register.html', inputs=inputs)
        if len(password) < 6:
            flash('password must be up to six characters', 'error')
            return render_template('register.html', inputs=inputs)

        # validate length of username, and password
        if len(username) <= 3:
            flash('Username must be up to 4 characters', 'error')
            return render_template('register.html', inputs=inputs)
        
        try:
            # sanitized user inputs against xss, csrf
            user_data = xssSanitizer(inputs)
        except Exception:
            flash(f'form contains not allowed characters', 'error')
            return render_template('register.html', inputs=inputs)
        print('user_data: ', user_data)
        try:
            user = User(user_data)
        except Exception as e:
            print('failed to create user object', e)
            flash('User could not be registered', 'error')
            return render_template('register.html', inputs=inputs)

        try:
            user_id, account_id = db.create_user_with_transaction(user.to_dict())
            if user_id and account_id:
                return redirect(url_for('auth_views.login'))
        except Exception as e:
            print('except: ', e)
            flash('User could not be created, try again', 'error')
            return render_template('register.html', inputs=inputs)
        
    return render_template('register.html')


@auth_views.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """
    Login new user
    """
    db = DB()
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(username)
        print(password)
        try:
            validated_inputs = validate_user_inputs({"username": username,
                                                     "password": password})
            if not validated_inputs:
                flash('All fields must not be empty', 'error')
                return render_template('login.html', username=username)
        except Exception:
            flash('Could not validate inputs', 'error')
            return render_template('login.html', username=username)
        try:
            username_exists = db.find_user_by_username(username)
        except :
            flash('Could not validate username', 'error')
            return render_template('login.html', username=username)
        if not username_exists:
            print('incorrect username/password')
            flash('incorrect username/password', 'error')
            return render_template('login.html', username=username)
        pwd_check = check_password(password, username_exists.get('password'))
        if not pwd_check:
            print('wrong password')
            flash('incorrect username/password', 'error')
            return render_template('login.html', username=username)
        identity = {
            "_id": str(username_exists.get('_id')),
            "username": username_exists.get('username')
        }
        access_token = create_access_token(identity=identity, additional_claims={"ie": getenv("JWT_ADDITIONAL_CLAIMS"), "audience": getenv("JWT_AUDIENCE")})
        # print('access_token: ', access_token)
        

        response = make_response(render_template('dashboard.html'))


        set_access_cookies(response, access_token)
        print('access_token: ', access_token)

        return response

    return render_template('login.html')


@auth_views.route('/logout/')
@jwt_required()
def logout():
    """
    Logout new user
    """
    response = redirect(url_for('login'))
    # response.headers['Authorization'] = ''
    unset_jwt_cookies(response)
    return response

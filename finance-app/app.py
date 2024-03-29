from os import getenv
import dotenv
from datetime import timedelta
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from views import auth_views, account_views, transactions_views, pin_views


app = Flask(__name__, template_folder='templates')

app.config['SECRET_KEY'] = getenv('SECRET_KEY')
# Setup the Flask-JWT-Extended extension
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)

app.config['STRICT_SLASHES'] = False
jwt = JWTManager(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/test"

client = PyMongo(app)


try:
    # Register blueprints (once)
    app.register_blueprint(auth_views)
    app.register_blueprint(account_views)
    app.register_blueprint(transactions_views)
    app.register_blueprint(pin_views)
except AssertionError as e:
    print("Error registering blueprints:", e)


@app.route('/')
def home():
    """
    Home page
    """
    return render_template('home.html')

@app.route('/about')
def about():
    """
    about page
    """
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000, threaded=True)

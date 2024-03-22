from os import getenv
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from views import auth_views, account_views, transactions_views, pin_views

app = Flask(__name__, template_folder='templates')

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/test"

mongo = PyMongo(app)


app.register_blueprint(auth_views)
app.register_blueprint(account_views)
app.register_blueprint(transactions_views)
app.register_blueprint(pin_views)


@app.route('/')
def home():
    """
    Home page
    """
    return render_template('home.html')


@app.route('/')
def about():
    """
    about page
    """
    render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000, threaded=True)

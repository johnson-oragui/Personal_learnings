#!/usr/bin/env python

from flask import Flask, request
import logging

app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='web_app_requests.log'
)

# Add a function to be called before each request
@app.before_request
def log_request_info():
    app.logger.info(f"Received request: {request.method} {request.path}")

@app.route('/')
def index():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)

#!/usr/bin/env python

import requests
import logging

# Configure logging to capture HTTP requests and save logs to a file
logging.basicConfig(level=logging.INFO)
logging.getLogger('requests').setLevel(logging.DEBUG)
logging.getLogger('urllib3').setLevel(logging.DEBUG)

# Create a FileHandler and set its level to DEBUG
file_handler = logging.FileHandler('http_requests.log')
file_handler.setLevel(logging.DEBUG)

# Create a formatter and add it to the handler
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the FileHandler to the root logger
logging.getLogger().addHandler(file_handler)

# Make an HTTP request using the requests library
url = 'https://www.example.com'
response = requests.get(url)

# The request and response details will be logged to both the console and the file

const axios = require('axios');
const qs = require('qs');

// Replace '<access_token>' with the actual access token value
const accessToken = 'access_token';

const cookie = 'token=my_token';

// Define the API endpoint URL
const apiUrl = 'http://localhost:5000/api/todo/login';

// Define the headers with the access token
const header = {
  Cookie: cookie,
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json', // Optional: Add any other headers if needed
};

// Make the API call using Axios
axios.post(apiUrl, { username: 'Johnson', password: 'my_password' }, { headers: header })
  .then(response => {
    console.log('API Response:', response.data);
    // Handle the response data
  })
  .catch(error => {
    console.error('API Error:', error.response.data);
    // Handle the error
  });


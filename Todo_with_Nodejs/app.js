import express from 'express';
import path from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
import MongoClient from './Todo/Utils/mongodb';
import router from './Todo/routes';

require('dotenv').config();


const app = express();

// middleware for static folders
app.use(express.static(path.join(__dirname, 'static')));

app.use(expressEjsLayouts);


// middleware for parsing json requests
app.use(express.json());

// middleware for decoding url-ncoded form data
app.use(express.urlencoded({ extended: false }));

// connect to MongoDB
MongoClient();

// middleware for rendering html contents
app.set('layout', path.join(__dirname, '/views/layouts/main'));

// middleware for template engine to be used
app.set('view engine', 'ejs');

app.use('/', router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

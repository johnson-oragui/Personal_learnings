import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import router from './src/routes/home.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app running on localhost:${PORT}`);
});

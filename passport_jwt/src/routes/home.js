import express from 'express';
import GetHome from '../controllers/index.js';
import Login from '../controllers/login.js';
import Logout from '../controllers/logout.js';
import SecuredRoute from '../controllers/secure.js';
import SignUp from '../controllers/signup.js';

const router = express.Router();

router.get('/', GetHome.get);
router.get('/login', Login.get);
router.get('/logout', Logout.get);
router.get('/securedroute', SecuredRoute.get);
router.get('/signup', SignUp.get);

router.get('/signup', SignUp.post);
router.post('/login', Login.post);
router.post('/logout', Logout.post);

export default router;

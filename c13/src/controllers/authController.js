const xssValidator = require('../helperFunctions/xssValidator');
const regDataFieldCheck = require('../helperFunctions/regDataFieldCheck');
const validateEmail = require('../helperFunctions/validateEmail');
const usernameConstraints = require('../helperFunctions/usernameConstraints');
const phoneNumberValidation = require('../helperFunctions/phoneNumberValidation');
const createUser = require('../helperFunctions/createUser');
const loginDataFieldCheck = require('../helperFunctions/loginDataFiledCheck');
const allowedUsername = require('../helperFunctions/allowedUsername');
const findUser = require('../helperFunctions/findUser');
const generateAccessToken = require('../Utils/jwtUtils/generateAccessToken');
const generateRefreshToken = require('../Utils/jwtUtils/generateRefreshToken');
const updateUser = require('../helperFunctions/updateUser');
const revokeRefreshToken = require('../helperFunctions/revokeRefreshToken');
const revokeAccessToken = require('../helperFunctions/revokeAccessToken');
const verifyAccessToken = require('../Utils/jwtUtils/verifyAccessToken');

class AuthController {
  static async postRegister(req, res) {
    const { password } = req.body;
    // Sanitize all user-provided fields
    const sanitizedFN = xssValidator(req.body.firstName).toLowerCase();
    const sanitizedLN = xssValidator(req.body.lastName).toLowerCase();
    const sanitizedEmail = xssValidator(req.body.email).toLowerCase();
    const sanitizedUN = xssValidator(req.body.username).toLowerCase();
    // Password doesn't need sanitization

    // sanitized first and last names to have no space inbetween

    // Sanitize only if provided
    const sanitizedPhoneN = req.body.phoneNumber && xssValidator(req.body.phoneNumber);

    // checkes for the availability of all fields for registration, returns true if all available
    const fields = regDataFieldCheck(
      sanitizedFN,
      sanitizedLN,
      sanitizedEmail,
      sanitizedUN,
      password,
    );

    if (!fields) {
      console.error('no firstName, lastName, username, email and password found postLogin method: ');
      return res.status(400).json({ error: 'must include firstName, lastName, username, email and password' });
    }
    // Validate email format if provided
    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    // IMPLEMENT email verification

    // Validate password strength (e.g., minimum length)
    if ((password.trim()).length < 6 || (password.trim()).length > 50) {
      return res.status(400).json({ error: 'Password must be at least 6 and not more than 50 characters long' });
    }
    // returns false if unallowed chars are used
    const regexedUsername = usernameConstraints(sanitizedEmail);
    if (!regexedUsername) {
      return res.status(400).json({ error: 'could not validate username, allowed chars: "-", "_"' });
    }
    // check username length
    if (sanitizedUN.length > 20) {
      return res.status(400).json({ error: 'username must not be greater than 20 characters long' });
    }
    // check for not allowed usernames, returns true if allowed
    const allowedUserN = allowedUsername(sanitizedUN);
    if (!allowedUserN) {
      return res.status(400).json({ error: 'username not allowed' });
    }
    // Check if phoneNumber is provided and validate its format
    if (sanitizedPhoneN && !phoneNumberValidation(sanitizedPhoneN)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const userData = {
      firstName: sanitizedFN,
      lastName: sanitizedLN,
      email: sanitizedEmail,
      username: sanitizedUN,
      hashedPassword: password,
      phoneNumber: sanitizedPhoneN || '',
    };
    try {
      const registeredUser = await createUser(userData);
      if (registeredUser === 'username') {
        console.error('username already exists postLogin method: ');
        return res.status(400).json({ error: 'User already exists with same username' });
      }
      if (registeredUser === 'email') {
        console.error('email already exists postLogin method: ');
        return res.status(400).json({ error: 'User already exists with same email' });
      }
      return res.status(200).json({ message: 'user successfully registered' });
    } catch (error) {
      console.error('error in postRegister user: ', error);
      throw new Error('Failed to register user: ', error);
    }
  }

  // Login/Create a user controller
  static async postLogin(req, res) {
    const {
      username,
      email,
      password,
    } = req.body;
    const sanitizedUN = xssValidator(username).toLowerCase();
    const sanitizedEmail = xssValidator(email).toLowerCase();

    // check login data, returns true if all fileds are provided
    const loginDataProvided = loginDataFieldCheck(sanitizedUN || sanitizedEmail, password);

    if (!loginDataProvided) {
      console.error('no username or email found postLogin method: ');
      return res.status(400).json({ error: 'must include username/email and password' });
    }
    // Validate email format if provided
    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // returns false if unallowed chars are used
    const regexedUsername = sanitizedUN && usernameConstraints(sanitizedUN);
    console.log('here: ', regexedUsername);
    if (username && username.trim() !== '' && !regexedUsername) {
      return res.status(400).json({ error: 'could not validate username, allowed chars: "-", "_"' });
    }
    // check username length
    if (sanitizedUN.length > 20) {
      return res.status(400).json({ error: 'username must not be greater than 20 characters long' });
    }
    // check for not allowed usernames, returns true if allowed
    const allowedUserN = allowedUsername(sanitizedUN);
    if (!allowedUserN) {
      return res.status(400).json({ error: 'username not allowed' });
    }

    // Validate password strength (e.g., minimum length)
    if ((password.trim()).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const userData = {};

    if (sanitizedUN) userData.username = sanitizedUN;
    if (sanitizedEmail) userData.email = sanitizedEmail;
    if (password) userData.password = password;

    console.log('userData: ', userData);

    let user;
    try {
      if (userData.email) {
        user = await findUser(userData);
      } else if (userData.username) {
        user = await findUser(userData);
      }

      console.log('user in login found: ', user);
      if (!user) {
        console.log('user not found: ', user);
        return res.status(404).json({ error: 'user does not exist' });
      }

      // implement a check to see if user already has a valid refreshToken
      if (user.refreshToken) {
        // revoke refreshToken from the database
        await revokeRefreshToken(user.refreshToken, user._id);
      }

      let reqToken;
      if (req.headers.authorization) {
        // eslint-disable-next-line prefer-destructuring
        reqToken = req.headers.authorization.split('Bearer ')[1];
      }
      if (reqToken) {
        console.log('reqToken from login: ', reqToken);
        // verify token
        const validToken = await verifyAccessToken(reqToken);
        // tell user token still valid
        if (validToken.success) {
          // still valid
          console.log('token still valid:in login ');
          return res.status(200).json({ message: 'token is still valid, logout to revoke token' });
        // eslint-disable-next-line no-else-return
        } else {
          // goto refresh route to refresh Token
          console.log('token expired or revoked from login: ');
          return res.status(404).json({
            error: 'token expired or revoke',
            message: 'please refresh Token or provide a valid token',
          });
        }
      }
      // prepare user data for generating token and refreshToken
      const payload = {
        id: user._id,
        username: user.username,
        role: user.role,
      };

      const token = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.setHeader('Authorization', `Bearer ${token}`);

      // update the refreshToken in the database for the user
      await updateUser(user._id, { refreshToken });

      return res.status(200).json({
        message: 'login successfull',
        refreshToken,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login user' });
      console.error('error in postLogin method: ', error.message);
      throw new Error('Failed to login User: ', error.message);
    }
  }

  static async postLogout(req, res) {
    // Token for authentication
    const token = req.headers.authorization.split(' ')[1];

    console.log('from logout, token: ', token);

    if (!token) {
      console.error('token missing');
      return res.status(400).json({ error: 'token missing, already logged out' });
    }
    const { refreshToken } = req.body;
    if (!refreshToken) {
      console.error('refreshToken missing');
      return res.status(400).json({ error: 'refreshToken missing, already logged out' });
    }

    const { userId } = req.params;
    // revoke token
    const tokenRevokded = await revokeAccessToken(String(token), userId);
    if (tokenRevokded) {
      console.log('tokenRevokded: ', tokenRevokded);
    }

    // revoke refreshToken
    const refreshTokenRevokded = await revokeRefreshToken(String(refreshToken), userId);
    if (refreshTokenRevokded) {
      console.log('refreshTokenRevokded: ', refreshTokenRevokded);
    }

    // delete cookie
    // await deleteCookie(res);

    return res.status(200).json({ message: 'logout' });
  }
}

module.exports = AuthController;

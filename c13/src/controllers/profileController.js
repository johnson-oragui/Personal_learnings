// import isFileImage from '../helperFunctions/isFileImage';
const multer = require('multer');
const uuid = require('uuid');
const fs = require('fs');
const sharp = require('sharp');
const xssValidate = require('../helperFunctions/xssValidator');
const confirmUserId = require('../helperFunctions/confirmUserId');
const updateUser = require('../helperFunctions/updateUser');
// yet to implement fileQueue
// const fileQueue = require('../helperFunctions/fileQueue');
const phoneNumberValidation = require('../helperFunctions/phoneNumberValidation');
const validateEmail = require('../helperFunctions/validateEmail');
const usernameConstraints = require('../helperFunctions/usernameConstraints');
const isImageUrl = require('../helperFunctions/isImageUrl');
const updateUserAvatar = require('../helperFunctions/updateUserAvatar');
const isFileImage = require('../helperFunctions/isFileImage');
const downloadImage = require('../helperFunctions/downloadImage');

// multer configurations
const storage = multer.memoryStorage();
const upload = multer({ storage });

class ProfileController {
  // /api/todo/userId/profile - PUT: Update the profile details of the authenticated user.
  static async putProfile(req, res, next) {
    try {
      // get the userId from params
      const { userId } = req.params;

      // get the user details to update, eg: username, email, firstName, or lastName
      const {
        firstName, lastName, email, username, phoneNumber,
      } = req.body;

      let sanitizedEmail;
      let sanitizedFN;
      let sanitizedLN;
      let sanitizedUN;

      // sanitized them form data, and convert them toLowerCase
      if (firstName && firstName.length < 20 && firstName.trim() !== '') {
        sanitizedFN = xssValidate(firstName);
      }
      if (lastName && lastName.length < 20 && lastName.trim() !== '') {
        sanitizedLN = xssValidate(lastName);
      }
      if (email && email.length < 40 && email.trim() !== '') {
        sanitizedEmail = xssValidate(email);
      }
      if (username && username.length < 20 && username.trim() !== '') {
        sanitizedUN = xssValidate(username);
      }

      // validate phone number
      if (phoneNumber && phoneNumber.trim() !== '') {
        const validPhoneNo = phoneNumberValidation(phoneNumber);
        if (!validPhoneNo) return res.status(400).json({ error: 'Invalid phone number' });
      }

      if (!sanitizedFN && !sanitizedLN && !sanitizedUN && !sanitizedEmail && !phoneNumber) {
        return res.status(400).json({ error: 'Must include at least one field' });
      }

      // validate email
      if (sanitizedEmail) {
        const validEmailNo = validateEmail(sanitizedEmail);
        if (!validEmailNo) return res.status(400).json({ error: 'Invalid email' });
      }

      // validate username contraints
      if (sanitizedUN) {
        const validUsername = usernameConstraints(sanitizedUN);
        if (!validUsername) return res.status(400).json({ error: 'characters allowed: "_", "-"' });
      }

      // check if userId exists in database
      const userExists = await confirmUserId(userId);
      if (!userExists) {
        return res.status(404).json({ error: 'user not found' });
      }

      // create a userData object
      const userData = {};
      if (sanitizedFN) userData.firstName = sanitizedFN;
      if (sanitizedLN) userData.lastName = sanitizedLN;
      if (sanitizedUN) userData.username = sanitizedUN;
      if (sanitizedEmail) userData.email = sanitizedEmail;
      if (phoneNumber) userData.phoneNumber = phoneNumber;

      // update the userModel with the validated userData
      const updatedUser = await updateUser(userId, userData);
      if (!updatedUser) {
        return res.status(400).json({ error: 'could not update user details' });
      }

      // send back success feedback to client
      return res.status(200).json({ message: 'update profile', userData: updatedUser });
    } catch (error) {
      console.error('error in putProfile controller', error);
      return next(error);
    }
  }

  // /api/todo/userId/password - PUT: Update the password of the authenticated user.
  static async putPassword(req, res, next) {
    try {
      // get userId from request params
      const { userId } = req.params;

      // get userEmail from request body
      const { email } = req.body;

      // confirm user by email from database
      const confirmEmail = await confirmUserId(email);

      // compare the found user's id with userId from params
      if (confirmEmail._id !== userId) {
        return res.status(404).json({ error: 'user not found' });
      }

      // send a generated token to the user's email
      const resetPwdToken = uuid.v4();

      // update the user's resetPwdToken in the database and expire it in 10 minutes
      const updateUserResetToken = await updateUser(userId, { resetPwdToken });
      if (!updateUserResetToken) return res.status(400).json({ error: 'could not generate token' });

      // tell the user to use the token withing 10 minutes to create new password
      return res.status(200).json({ message: 'access your email to use reset token to reset password' });

      // create another route to handle the password update
    } catch (error) {
      console.error('error in putPassword controller', error);
      return next(error);
    }
  }

  // /api/todo/userId/avatar - PUT: Update the avatar of the authenticated user.
  static async putAvatar(req, res, next) {
    try {
      // get userId from params
      const { userId } = req.params;

      // get  url from request body
      const { url } = req.body;
      // get file from request body
      // eslint-disable-next-line prefer-destructuring
      const file = req.file;

      // sanitized the file
      const sanitizedurl = xssValidate(url);

      // confirm the userId
      const userConfirmation = await confirmUserId(userId);
      if (!userConfirmation) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // check if url is present
      if (sanitizedurl && userConfirmation) {
        // check if url is an image
        isImageUrl(url, async (error, isImage) => {
          if (error) {
            console.error('Error checking image URL:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          if (isImage) {
            try {
              const imageToUpload = await downloadImage(sanitizedurl);
              const resizedImageBuffer = await sharp(imageToUpload)
                .resize({ width: 200, height: 200, fit: 'cover' }) // Adjust width, height, and fit as needed
                .toBuffer();
              const avatarUpdated = await updateUserAvatar(userId, { imageToUpload });
            } catch (error) {
              console.error('Error saving image URL to MongoDB:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (avatarUpdated) {
              return res.status(200).json({ message: 'Image saved successfully' });
            // eslint-disable-next-line no-else-return
            } else {
              return res.status(400).json({ message: 'Provided url is not an image' });
            }
          }
          return null;
        });
      } else if (file && userConfirmation) {
        if (isFileImage(file.path)) {
          try {
            const [_, contentType] = await isFileImage(file.path);
            if (req.file.mimetype !== contentType) {
              return res.status(400).json({ message: 'Provided url is not an image' });
            }
            // Resize the uploaded image before saving
            const resizedImageBuffer = await sharp(fs.readFileSync(file.path))
              .resize({ width: 200, height: 200, fit: 'cover' }) // Adjust width, height, and fit as needed
              .toBuffer();
            const avatarUpdated = await updateUserAvatar(userId, { avatar: file, contentType });
          } catch (error) {
            console.error('Error saving image URL to MongoDB:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          if (avatarUpdated) {
            return res.status(200).json({ message: 'Image saved successfully' });
          // eslint-disable-next-line no-else-return
          } else {
            return res.status(400).json({ message: 'Provided url is not an image' });
          }
        }
      }
    } catch (error) {
      console.error('error saving avatar: ', error.message);
      return next(error);
    }
  }
}

module.exports = ProfileController;

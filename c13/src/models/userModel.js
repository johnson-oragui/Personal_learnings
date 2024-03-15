const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Must include first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Must include last name'],
  },
  email: {
    type: String,
    required: [true, 'Must include email'],
    unique: [true, 'Email already in use'],
  },
  username: {
    type: String,
    required: [true, 'Must include username'],
    unique: [true, 'username already in use'],
  },
  hashedPassword: {
    type: String,
    required: [true, 'Must include passworde'],
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },
  phoneNumber: String,
  avatar: {
    type: {
      data: Buffer,
      contentType: String,
      url: String,
    },
  },
  passwordToken: String,
  refreshToken: String,
  revokedRefreshTokens: [
    {
      refreshToken: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  revokedAccessTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// expire refreshToken after 7 days, since refreshToken has an age of 7 days
// userSchema.index({ refreshToken: 1 }, { expires: '7d' });

// Pre-save to hash the password before saving to the database
userSchema.pre('save', async function hasher(next) {
  try {
    // hash password only if it is modified or newly created
    if (!this.isModified('hashedPassword')) {
      return next();
    }

    // generate a salt
    const salt = await bcrypt.genSalt();
    // hash password with salt
    const hashedPwd = await bcrypt.hash(this.hashedPassword, salt);
    // replace the plain text password with the hashed password
    this.hashedPassword = hashedPwd;
    // proceed to save the user
    return next();
  } catch (error) {
    console.error('error hashing password: ', error.name, error.message);
    return next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function compare(providedPassword) {
  try {
    return await bcrypt.compare(providedPassword, this.hashedPassword);
  } catch (error) {
    console.error('error comparing passwords: ', error.name, error.message);
    throw new Error(error);
  }
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
// const User = mongoose.model('User', userSchema, { collection: 'my_users' });  // Custom collection name
module.exports = User;

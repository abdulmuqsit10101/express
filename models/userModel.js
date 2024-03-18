const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // This will only work on CREATE or SAVE.
    validate: function (el) {
      return el === this.password;
    },
  },
});

// Encrypting the password
userSchema.pre('save', async function (next) {
  // Return next if the password field is not modified!
  if (!this.isModified('password')) return next();

  // Use the bcryptjs hash to encrypt the password with cost of 12;
  this.password = await bcrypt.hash(this.password, 12);

  // Remove the passwordConfirm from the document.
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

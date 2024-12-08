const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user'], default: 'user' },
  authorize: { type: Boolean, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
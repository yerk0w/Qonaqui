/* eslint-env node */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // --- НОВОЕ ПОЛЕ ---
  role: {
    type: String,
    enum: ['user', 'admin'], // Допускаются только эти два значения
    default: 'user',        // По умолчанию все новые - 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
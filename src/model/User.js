const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true },
  refreshToken: { type: String },
  passwordHash: { type: String },
});

module.exports = model('User', UserSchema);

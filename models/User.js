const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { 
    type: String,
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email_is_verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
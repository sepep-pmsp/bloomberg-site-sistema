const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  nome: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  senha: { 
    type: String, 
    required: true 
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: { type: String, default: null },
}, { 
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  email: String,
  ip: String,
  status: { type: String, enum: ['success', 'failed'] },
  userAgent: String,
  reason: String 
}, { timestamps: true });

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
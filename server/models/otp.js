const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure OTPs are unique per email
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m' // Document expires after 10 minutes
  }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;

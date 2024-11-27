const express = require('express');
const router = express.Router();
const otpController = require('../Controllers/otpcontroller'); // Adjust the path as necessary

// Route to send OTP
router.post('/send-otp', otpController.sendOTP);

// Route to verify OTP
router.post('/verify-otp', otpController.verifyOTP);

module.exports = router;

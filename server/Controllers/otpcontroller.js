const OTP = require('../models/otp'); // Adjust the path as necessary
const { sendEmail } = require('../Controllers/emailcontroller');
const Customer = require('../models/customer');
const Employee = require('../models/employee');

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

exports.sendOTP = async (req, res) => {
    const { email, login } = req.body; // Assuming the request body contains the email and login flag
    const otp = generateOTP();

    try {
        // Check if the email belongs to a customer or employee
        let user = await Customer.findOne({ email });
        if (!user) {
            user = await Employee.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const name = user.name;

        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        // Prepare the personalized OTP email content
        const emailContent = `Dear ${name},

Please use the OTP ${otp} to ${login ? 'securely log in' : 'reset your password'}. Please do not share it with anyone.

Best Regards,
Team BEES`;

        // Send the OTP via email
        await sendEmail(email, 'OTP Code for Verification', emailContent);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};




exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the OTP record for the given email
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Optional: Check if the OTP is expired
        const currentTime = new Date();
        if (otpRecord.expiresAt < currentTime) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

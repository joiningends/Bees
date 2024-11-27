const Birth = require('../models/birthday');
const Customer = require('../models/customer');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendEmailattachment } = require('../Controllers/emailcontroller');
const { sendMediaMessage } = require('../Controllers/whatsappcontroller');

// Create a new birth record
exports.createBirth = async (req, res) => {
    try {
        const newBirth = new Birth({
            message: req.body.message,
            sub: req.body.sub,
            Attachment: req.file ? `public/uploads/${req.file.filename}` : null
        });
        const savedBirth = await newBirth.save();
        res.status(201).json(savedBirth);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all birth records
exports.getAllBirths = async (req, res) => {
    try {
        const births = await Birth.find();
        res.status(200).json(births);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a birth record by ID
exports.getBirthById = async (req, res) => {
    try {
        const birth = await Birth.findById(req.params.id);
        if (!birth) {
            return res.status(404).json({ message: 'Birth record not found' });
        }
        res.status(200).json(birth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a birth record by ID
exports.updateBirthById = async (req, res) => {
    try {
        const birthRecord = await Birth.findById(req.params.id);
        if (!birthRecord) {
            return res.status(404).json({ message: 'Birth record not found' });
        }

        const updatedData = {
            message: req.body.message,
            sub: req.body.sub,
        };

        if (req.file) {
            const oldAttachment = birthRecord.Attachment;
            updatedData.Attachment = `public/uploads/${req.file.filename}`;

            // Delete old file if it exists
            if (oldAttachment && fs.existsSync(oldAttachment)) {
                fs.unlinkSync(oldAttachment);
            }
        }

        const updatedBirth = await Birth.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedBirth) {
            return res.status(404).json({ message: 'Birth record not found after update' });
        }

        res.status(200).json(updatedBirth);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Define sendBirthdayWishes function
const sendBirthdayWishes = async () => {
    console.log('sendBirthdayWishes function started');

    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Zero-padded month
    const currentDay = String(today.getDate()).padStart(2, '0'); // Zero-padded day

    try {
        // Fetch active customers with birthdays today
        const customers = await Customer.find({
            dob: { $regex: `^${currentMonth}/${currentDay}` }, // Regex to match MM/DD format
            Active: true
        });

        console.log('Customers with birthdays today:', customers);

        // Fetch the birthday message
        const birthRecord = await Birth.findOne();
        if (!birthRecord) {
            console.error('No birth record found');
            return;
        }

        const message = birthRecord.message || 'Happy Birthday!';
        const sub = birthRecord.sub;
        const mediaUrl = `https://as1.ftcdn.net/v2/jpg/04/42/62/12/1000_F_442621279_PYhie13pVGcSSYTAm1eqlC3e7Lcy0oNV.jpg`;
        const filename = birthRecord.Attachment.split('/').pop();

        console.log(`Message: ${message}`);
        console.log(`Media URL: ${mediaUrl}`);
        console.log(`Filename: ${filename}`);

        for (const customer of customers) {
            const emailContentCustomer = `Dear ${customer.name},\n\n${message}\n\nBest wishes,\nTeam Bees`;

            // Send email with or without attachment (using the media URL)
            if (birthRecord.Attachment) {
                await sendEmailattachment(customer.email, sub, emailContentCustomer, mediaUrl);
            } else {
                await sendEmail(customer.email, sub, emailContentCustomer);
            }
            console.log(`Email sent to ${customer.email}`);

            // Send WhatsApp message with media
            await sendMediaMessage(customer.phone, mediaUrl, filename, message);
            console.log(`WhatsApp message sent to ${customer.phone}`);
        }
    } catch (error) {
        console.error(`Error in sendBirthdayWishes: ${error.message}`);
    }
};






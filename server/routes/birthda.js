const express = require('express');
const router = express.Router();
const birthController = require('../Controllers/birthdaycontroller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|pdf|xls|xlsx/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg, .png, .pdf, .xls, and .xlsx files are allowed!'));
        }
    }
});

// Create a new birth record
router.post('/', upload.single('file'), birthController.createBirth);

// Get all birth records
router.get('/', birthController.getAllBirths);

// Get a birth record by ID
router.get('/:id', birthController.getBirthById);

// Update a birth record by ID
router.put('/:id', upload.single('file'), birthController.updateBirthById);

module.exports = router;

const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/coustomercontroller');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });


// POST request to create a new customer
router.post('/', customerController.createCustomer);
router.post('/upload', upload.single('file'), customerController.uploadExcel);
// GET request to get a customer by ID
router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.getAllCustomers);
router.get('/ticket/create', customerController.getAllCustomerst);
// PUT request to update a customer by ID
router.put('/:id', customerController.updateCustomerById);
router.get('/code/:coustomercode', customerController.getCustomerByCode);
router.put('/update/password', customerController.updatePassword);
router.get('/check-customercode/:customercode', customerController.customerCodeExists);
module.exports = router;

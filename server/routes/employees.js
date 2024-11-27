const express = require('express');
const router = express.Router();
const employeeController = require('../Controllers/employeecontroller'); // Adjust the path according to your project structure

// Route to handle POST request for creating a new employee
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/ticket/create', employeeController.getAllEmployeest);
// GET request to get an employee by ID
router.get('/:id', employeeController.getEmployeeById);

// PUT request to update an employee by ID
router.put('/:id', employeeController.updateEmployeeById);
router.put('/update/password', employeeController.updateEmployeePassword);

module.exports = router;

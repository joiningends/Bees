const Employee = require('../models/employee'); // Adjust the path according to your project structure
const bcrypt = require('bcryptjs');

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, phone, active, terminate } = req.body;

       
        const newEmployee = new Employee({
            name,
            email,
            phone,
            Active: active,
            Terminate: terminate,
            
        });

        // Save the employee to the database
        const savedEmployee = await newEmployee.save();

        // Return the saved employee
        res.status(201).json(savedEmployee);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();;
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllEmployeest = async (req, res) => {
    try {
        const employees = await Employee.find({ Active: true, Terminate: false });;
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee by ID
exports.updateEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updates = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.updateEmployeePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Validate request
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        // Find employee by email
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash with salt rounds

        // Update employee password
        employee.password = hashedPassword;
        await employee.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
};

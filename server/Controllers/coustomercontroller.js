const Customer = require('../models/customer');



exports.createCustomer = async (req, res) => {
    try {
        const { name, email, phone, dob, Active, Terminate,customercode } = req.body;
        
        const newCustomer = new Customer({
            name,
            email,
            phone,
            dob,
            customercode,
            Active,
            Terminate
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const XLSX = require('xlsx');

const moment = require('moment');

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Parse the Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const sheet = sheetNames[0]; // Assuming the data is in the first sheet
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        // Validate and process each row of the data
        for (const row of data) {
            // Example: Assuming Excel columns are named 'Name', 'Email', 'Phone', 'Dob', 'CustomerCode'
            const { Name, Email, Phone, Dob, CustomerCode } = row;

            if (!Name || !Email) {
                return res.status(400).json({ message: 'Missing required fields in the Excel file' });
            }

            // Format Dob
            let formattedDob;
            if (Dob) {
                // Ensure Dob is a string
                const dobStr = Dob.toString().trim();
                console.log(`Processing DOB: ${dobStr}`);

                if (dobStr.length === 7) {
                    // Handle the 8092024 format (MDDYYYY)
                    let month = dobStr.slice(0, 1); // Month is 1 digit
                    let day = dobStr.slice(1, 3);   // Day is 2 digits
                    let year = dobStr.slice(3);     // Year is 4 digits

                    // Add leading zero to month if needed
                    if (month.length === 1) month = '0' + month;

                    // Construct ISO date
                    const isoDate = `${year}-${month}-${day}`;
                    formattedDob = moment(isoDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
                    console.log(`ISO Date: ${isoDate}`);
                } else if (dobStr.length === 8) {
                    // Handle the DDMMYYYY format
                    let day = dobStr.slice(0, 2);
                    let month = dobStr.slice(2, 4);
                    let year = dobStr.slice(4);

                    // Construct ISO date
                    const isoDate = `${year}-${month}-${day}`;
                    formattedDob = moment(isoDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
                } else {
                    console.error(`Invalid DOB format: ${dobStr}`);
                    return res.status(400).json({ message: `Invalid DOB format: ${dobStr}` });
                }

                // Verify the date is valid
                if (!moment(formattedDob, 'DD/MM/YYYY', true).isValid()) {
                    console.error(`Invalid DOB date: ${formattedDob}`);
                    return res.status(400).json({ message: `Invalid DOB date: ${formattedDob}` });
                }
            } else {
                formattedDob = null;
                return res.status(400).json({ message: 'Please check, Dob is in wrong format' });
            }

            // Check if the customer already exists
            const existingCustomer = await Customer.findOne({ customercode: CustomerCode });

            if (existingCustomer) {
                // Update existing customer record with new data
                existingCustomer.name = Name;
                existingCustomer.email = Email;
                existingCustomer.phone = Phone;
                existingCustomer.dob = formattedDob;

                await existingCustomer.save();
            } else {
                // Create a new customer record
                const newCustomer = new Customer({
                    name: Name,
                    email: Email,
                    phone: Phone,
                    dob: formattedDob,
                    customercode: CustomerCode,
                    active: true,
                    terminate: false
                });

                await newCustomer.save();
            }
        }

        res.status(201).json({ message: 'Customers processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};









// Get customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllCustomerst = async (req, res) => {
    try {
        const customers = await Customer.find({ Active: true, Terminate: false });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update customer by ID
exports.updateCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updates = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updates, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getCustomerByCode = async (req, res) => {
    const { coustomercode } = req.params;

    try {
        const customer = await Customer.findOne({ coustomercode });

        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const bcrypt = require('bcryptjs');

exports.updatePassword = async (req, res) => {
    const { customercode, newPassword } = req.body;

    try {
        // Validate request
        if (!customercode || !newPassword) {
            return res.status(400).json({ message: 'Customercode and new password are required' });
        }

        // Find customer by customercode
        const customer = await Customer.findOne({ customercode });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash with salt rounds

        // Update customer password
        customer.password = hashedPassword;
        await customer.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
};


const finall = async (customercode) => {
    try {
      const customer = await Customer.findOne({ customercode });
  
      if (customer) {
        return false; // Customer code already exists
      }
      return true; // Customer code does not exist
    } catch (error) {
      console.error('Error in finall:', error.message);
      throw new Error('Error checking customer code uniqueness');
    }
  };
  
 
  
  
exports.customerCodeExists = async (req, res) => {
    const { customercode } = req.params;
  
    try {
      const isUnique = await finall(customercode);
  
      if (!isUnique) {
        return res.status(409).json({ message: 'Customer code already exists' });
      } else {
        return res.status(200).json({ message: 'Customer code does not exist' });
      }
    } catch (error) {
      console.error('Error in customerCodeExists:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
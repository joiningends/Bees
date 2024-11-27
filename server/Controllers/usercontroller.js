const jwt = require("jsonwebtoken");
const Customer = require('../models/customer');
const Employee = require('../models/employee');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Status = require('../models/status');
const Ticket = require('../models/ticket');
const status = require("../models/status");


exports.loginUser = async (req, res) => {
    const { email, password, customercode } = req.body;

    try {
        let user = null;
        let role = '';

        if (customercode) {
            // Check Customer collection using customercode
            user = await Customer.findOne({ customercode });
            role = 'customer';
        } else {
            // Check User (admin) collection using email
            user = await User.findOne({ email });
            role = 'admin';

            if (!user) {
                // Check Employee collection using email
                user = await Employee.findOne({ email });
                role = 'employee';
            }

            if (!user) {
                // Check Customer collection using email
                user = await Customer.findOne({ email });
                role = 'customer';
            }
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            // Generate JWT token
            const secret = process.env.SECRET || 'your_jwt_secret';
            const token = jwt.sign(
                {
                    userId: user._id,
                    role: role
                },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                userId: user._id,
                email: user.email,
                role: role,
                token: token
            });
        }

        res.status(400).json({ message: 'Invalid email, customercode, or password!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in', details: error.message });
    }
};



  

  
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        let identify = 0; // Use -1 to indicate no user found initially
        let user = await User.findOne({ email: email });
        
        if (!user) {
            user = await Employee.findOne({ email: email });
            identify = 1; // Employee found
        }
        
        if (!user) {
            user = await Customer.findOne({ email: email });
            identify = 2; // Customer found
        }

        if (user) {
            res.status(200).json({ user, identify });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.createUser = async (req, res) => {
  const { email, password, mobileNumber, instanceId } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10); // Encrypt the password
      const newUser = new User({ email, password: hashedPassword, mobileNumber, instanceId });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findById(id);

      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, mobileNumber, instanceId } = req.body;

  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (email) user.email = email;
      
      if (mobileNumber) user.mobileNumber = mobileNumber;
      if (instanceId) user.instanceId = instanceId;

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



exports.emailexsit = async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ email });
      const customer = await Customer.findOne({ email });
      const employee = await Employee.findOne({ email });
  
      if (user || customer || employee) {
        return res.status(409).json({ message: 'Email already exists' });
      } else {
        return res.status(200).json({ message: 'Email does not exist' });
      }
    } catch (error) {
      console.error('Error in emailexsit:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  



  
 
  
  exports.getDashboardCounts = async (req, res) => {
      try {
          const totalCustomers = await Customer.countDocuments();
          const totalEmployees = await Employee.countDocuments();
  
          // Group tickets by status and count them
          const ticketsByStatusCounts = await Ticket.aggregate([
              {
                  $group: {
                      _id: "$status",
                      count: { $sum: 1 }
                  }
              }
          ]);
  
          // Get all statuses
          const allStatuses = await Status.find({}, { _id: 1, status: 1 });
  
          // Merge counts with statuses, defaulting to count 0 if not present
          const ticketsByStatus = allStatuses.map(status => {
              const found = ticketsByStatusCounts.find(ticket => ticket._id.equals(status._id));
              return {
                  status: status.status,
                  count: found ? found.count : 0
              };
          });
  
          const data = {
              totalCustomers,
              totalEmployees,
              ticketsByStatus
          };
  
          res.status(200).json(data);
      } catch (error) {
          console.error(`Error fetching dashboard counts: ${error.message}`);
          res.status(500).json({ error: 'Internal server error' });
      }
  };
  
  
  exports.getDashboardCountsByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params.id;

        // Group tickets by status and count them for a specific customer
        const ticketsByStatusCounts = await Ticket.aggregate([
            { $match: { customerId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get all statuses
        const allStatuses = await Status.find({}, { _id: 1, status: 1 });

        // Merge counts with statuses, defaulting to count 0 if not present
        const ticketsByStatus = allStatuses.map(status => {
            const found = ticketsByStatusCounts.find(ticket => ticket._id.equals(status._id));
            return {
                status: status.status,
                count: found ? found.count : 0
            };
        });

        const data = {
            
            ticketsByStatus
        };

        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching dashboard counts for customer: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDashboardCountsByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params.id;

        // Group tickets by status and count them for a specific employee
        const ticketsByStatusCounts = await Ticket.aggregate([
            { $match: { assignToEmployeeId : employeeId} },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get all statuses
        const allStatuses = await Status.find({}, { _id: 1, status: 1 });

        // Merge counts with statuses, defaulting to count 0 if not present
        const ticketsByStatus = allStatuses.map(status => {
            const found = ticketsByStatusCounts.find(ticket => ticket._id.equals(status._id));
            return {
                status: status.status,
                count: found ? found.count : 0
            };
        });

        const data = {
            
            ticketsByStatus
        };

        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching dashboard counts for employee: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/reportcontroller'); // Adjust path as needed

// Route to get closed tickets by type
router.get('/closed/type/:ticketTypeId', reportController.getClosedTicketsByType);

// Route to get closed tickets by customer ID
router.get('/closed/customer/:customerId', reportController.getClosedTicketsByCustomerId);

// Route to get closed tickets by employee ID
router.get('/closed/employee/:employeeId', reportController.getClosedTicketsByEmployeeId);

router.get('/:ticketTypeId', reportController.getClosedTicketsByTypedaterange);

// Route to get closed tickets by customer with date range filtering
router.get('/customer/:customerId', reportController.getClosedTicketsByCustomerIddaterange);

// Route to get closed tickets by employee with date range filtering
router.get('/employee/:employeeId', reportController.getClosedTicketsByEmployeeIddaterange);
router.get('/csv/type/:ticketTypeId', reportController.getClosedTicketsByTypecsv);

// Route to get closed tickets by customer ID
router.get('/csv/customer/:customerId', reportController.getClosedTicketsByCustomerIdcsv);

// Route to get closed tickets by employee ID
router.get('/csv/employee/:employeeId', reportController.getClosedTicketsByEmployeeIdcsv);

router.get('/csv/:ticketTypeId/:statusId', reportController.getClosedTicketsByTypedaterangecsv);

// Route to get closed tickets by customer with date range filtering
router.get('/csv/customer/:customerId', reportController.getClosedTicketsByCustomerIddaterangecsv);

// Route to get closed tickets by employee with date range filtering
router.get('/csv/employee/:employeeId', reportController.getClosedTicketsByEmployeeIddaterangecsv);




module.exports = router;

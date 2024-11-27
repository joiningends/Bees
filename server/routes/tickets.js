const express = require('express');
const router = express.Router();
const ticketController = require('../Controllers/ticketcontroller'); // Adjust path as needed

// POST request to create a new ticket
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.get('/status/:status', ticketController.getPendingTickets);
router.get('/status/:status/:id', ticketController.getPendingTicketsbyid);
router.get('/status/:status/coustomer/:id', ticketController.getPendingTicketsbyidcustomer);
router.put('/update/:id', ticketController.editTicket);
router.delete('/', ticketController.deleteAllTickets)

module.exports = router;

const express = require('express');
const router = express.Router();
const ticketTypeController = require('../Controllers/tickettypecontroller'); // Adjust the path as necessary

// Define routes
router.post('/', ticketTypeController.createTicketType);
router.get('/', ticketTypeController.getAllTicketTypes);
router.get('/:id', ticketTypeController.getTicketTypeById);
router.put('/:id', ticketTypeController.updateTicketTypeById);
router.delete('/:id', ticketTypeController.deleteTicketTypeById);

module.exports = router;
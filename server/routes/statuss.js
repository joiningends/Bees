
const express = require('express');
const router = express.Router();
const statusController= require('../Controllers/statuscontroller');

// POST request to create a new status
router.post('/', statusController.createStatus);

// GET request to fetch all statuses
router.get('/', statusController.getStatuses);
router.get('/tickets/all', statusController.getStatusesticket);

// GET request to fetch a status by ID
router.get('/:id', statusController.getStatusById);

// PUT request to update a status by ID
router.put('/:id', statusController.updateStatus);

module.exports = router;

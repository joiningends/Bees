// controllers/statusController.js
const Status = require('../models/status');

// Controller to create a new status
exports.createStatus = async (req, res) => {
    try {
        const status = new Status(req.body);
        const savedStatus = await status.save();
        res.status(201).json(savedStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get all statuses
exports.getStatuses = async (req, res) => {
    try {
        const statuses = await Status.find();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getStatusesticket = async (req, res) => {
    try {
        const statuses = await Status.find({ Active: true, Terminate: false });
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Controller to get a status by ID
exports.getStatusById = async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);
        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateStatus = async (req, res) => {
    try {
        const statusId = req.params.id;

        // Check if attempting to terminate the status
        if (req.body.Terminate === true) {
            // Check if the status exists in any ticket
            const ticketWithStatus = await Ticket.findOne({ status: statusId });
            if (ticketWithStatus) {
                return res.status(400).json({ message: 'Cannot  this status as it is associated with tickets' });
            }
        }

        // Proceed with the update
        const status = await Status.findByIdAndUpdate(
            statusId,
            req.body,
            { new: true }
        );
        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

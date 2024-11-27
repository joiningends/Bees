const TicketType = require('../models/tickettype'); // Adjust the path as necessary

// Create a new ticket type
const createTicketType = async (req, res) => {
    try {
        const { name } = req.body;
        const ticketType = new TicketType({ name });
        await ticketType.save();
        res.status(201).send(ticketType);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all ticket types
const getAllTicketTypes = async (req, res) => {
    try {
        const ticketTypes = await TicketType.find();
        res.status(200).send(ticketTypes);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a ticket type by ID
const getTicketTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketType = await TicketType.findById(id);
        if (!ticketType) {
            return res.status(404).send({ error: 'TicketType not found' });
        }
        res.status(200).send(ticketType);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a ticket type by ID
const updateTicketTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const ticketType = await TicketType.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        if (!ticketType) {
            return res.status(404).send({ error: 'TicketType not found' });
        }
        res.status(200).send(ticketType);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a ticket type by ID
const deleteTicketTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketType = await TicketType.findByIdAndDelete(id);
        if (!ticketType) {
            return res.status(404).send({ error: 'TicketType not found' });
        }
        res.status(200).send({ message: 'TicketType deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createTicketType,
    getAllTicketTypes,
    getTicketTypeById,
    updateTicketTypeById,
    deleteTicketTypeById
};

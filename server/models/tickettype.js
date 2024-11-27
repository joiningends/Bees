const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ticketTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});


const TicketType = mongoose.model('TicketType', ticketTypeSchema);

module.exports = TicketType;

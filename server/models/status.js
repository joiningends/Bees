// models/Status.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    Active: {
        type: Boolean,
        default: true, // Default value set to true
    },
    Terminate: {
        type: Boolean,
        default: false, // Default value set to false
    },
});


const Status= mongoose.model('Status', statusSchema);

module.exports = Status;

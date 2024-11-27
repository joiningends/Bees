
const mongoose = require('mongoose');

const birthSchema = new mongoose.Schema({
    message: {
        type: String,
      
    },
    sub: {
        type: String,
        required: true, // Default value set to true
    },
    Attachment: {
        type: String,
       
    },
});

const Birth = mongoose.model('Birth', birthSchema);

module.exports = Birth;

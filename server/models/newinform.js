
const mongoose = require('mongoose');

const newinformationSchema = new mongoose.Schema({
    message: {
        type: String,
      
    },
    sub: {
        type: String,
        required: true, // Default value set to true
    },
    attachment: {
        type: String,
       
    },
});

const Newinformation = mongoose.model('Newinformation', newinformationSchema);

module.exports = Newinformation;

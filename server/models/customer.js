const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const coustmerSchema = new Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        
    },
    phone: {
        type: String,
       
        trim: true
    },
    dob:{
        type:String
    },
    Active: {
        type: Boolean,
       
       
    },
    Terminate: {
        type: Boolean,
       
       
    },
    password: {
        type: String,
        
        minlength: 6
    },
    customercode:{
        type:String,
        unique: true,
        
    }

});


const Customer = mongoose.model('Customer', coustmerSchema);

module.exports = Customer;

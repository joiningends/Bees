const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeSchema = new Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    phone: {
        type: String,
       
        trim: true
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
    }

});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

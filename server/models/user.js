const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email:{
        type: String,  
    },
    password:{
        type: String   
    },
    mobileNumber: {
        type: String,
        
        trim: true
    },
    instanceId: {
        type: String,
       
    }

});


const User = mongoose.model('User', userSchema);

module.exports = User;

const axios = require('axios');
const User = require('../models/user');

async function sendtextmessage(number, message) {
    try {
        console.log(number)

        // Retrieve user details (assuming there's only one user)
        const user = await User.findOne(); // Assuming you only need one user; adjust if necessary
        if (!user) {
            throw new Error('User not found');
        }

        const { instanceId } = user; // Assuming instanceId is the correct field name

        // Format the number
        const formattedNumber = number.startsWith('91') ? number : `91${number}`;

        // Prepare the payload
        const payload = {
            instance_id: instanceId,
            number: formattedNumber,
            message,
            clientid:"667bd983d4c5b43a46f0f1dd"
        };

        // Send the POST request
        const response = await axios.post('https://connectje.in/api/v1/wa/api/single', payload);

        // Return the API response
        return { status: response.status, data: response.data };
    } catch (error) {
        // Handle errors
        return { status: error.response ? error.response.status : 500, message: 'Error sending message', error: error.message };
    }
}

const sendMediaMessage = async (number, mediaUrl, filename, message) => {
    try {
        // Retrieve user details (assuming there's only one user)
        const user = await User.findOne(); // Adjust if necessary
        if (!user) {
            throw new Error('User not found');
        }

        const { instanceId } = user;

        // Format the number
        const formattedNumber = number.startsWith('91') ? number : `91${number}`;

        // Prepare the payload
        const payload = {
            instance_id: instanceId,
            number: formattedNumber,
            filename,
            media_url: mediaUrl,
            message,
           clientid: "667bd983d4c5b43a46f0f1dd"
        };

        // Send the POST request
        const response = await axios.post('https://connectje.in/api/v1/wa/api/media/single', payload);

        // Return the API response
        return { status: response.status, data: response.data };
    } catch (error) {
        // Handle errors
        console.error(`Error sending media message to ${number}: ${error.message}`);
        return { status: error.response ? error.response.status : 500, message: 'Error sending media', error: error.message };
    }
};




module.exports = { sendtextmessage ,sendMediaMessage };

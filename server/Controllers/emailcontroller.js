const nodemailer = require('nodemailer');
const Customer = require('../models/customer');
const Employee = require('../models/employee');
const User = require('../models/user');


async function sendEmail(email,subject,text ) {
    console.log(email)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'Contact@bees.in',
            pass: 'hasa gmmq bacj jazd',
        },
    });

    const mailOptions = {
        from: 'Contact@bees.in',
        to: email,
        subject: subject,
        text: text,
    };

    await transporter.sendMail(mailOptions);
}
//joiningends93@gmail.com
/**
 * Checks if the provided email exists in any of the collections (User, Customer, Employee).
 * @param {string} email - The email to check.
 * @throws Will throw an error if the email already exists.
 */
const checkUniqueEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    const customer = await Customer.findOne({ email });
    const employee = await Employee.findOne({ email });

    if (user || customer || employee) {
      throw new Error('Email already exists ');
    }
  } catch (error) {
    console.error('Error in checkUniqueEmail:', error.message);
    throw new Error('Email already exists');
  }
};


async function sendEmailattachment(to, subject, text, attachment)  {
  console.log(to)
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'Contact@bees.in',
          pass: 'hasa gmmq bacj jazd',
      },
  });

  const mailOptions = {
      from: 'Contact@bees.in',
      to,
      subject,
      text,
      attachments: attachment ? [{ path: attachment }] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email to ${to}: ${error.message}`);
        } else {
            console.log(`Email sent to ${to}: ${info.response}`);
        }
    });
};







module.exports = { sendEmail, checkUniqueEmail,sendEmailattachment };





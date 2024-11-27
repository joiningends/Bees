const fs = require("fs");
const path = require("path");
const Customer = require("../models/customer");
const { sendEmailattachment } = require("../Controllers/emailcontroller");

exports.sendMessages = async (req, res) => {
  const { sendToAll, customerIds, message, sub } = req.body;
  const attachment = req.file ? `public/uploads/${req.file.filename}` : null;
  const attachmentPath = attachment ? path.resolve(attachment) : null;

  // Extract original file name without the path
  const originalFileName = req.file ? req.file.originalname : null;
  console.log(`Attachment Path: ${attachmentPath}`);
  console.log(`Original File Name: ${originalFileName}`);

  try {
    let customers;
    if (sendToAll === "true") {
      customers = await Customer.find({});
    } else if (customerIds && customerIds.length > 0) {
      customers = await Customer.find({ _id: { $in: customerIds } });
    } else {
      return res.status(400).json({ message: "No customers specified" });
    }

    for (const customer of customers) {
      const emailContentCustomer = `Dear ${customer.name},\n\n${message}\n\nBest regards,\nTeam BEES`;

      if (attachment && fs.existsSync(attachmentPath)) {
        // Send the email with the original file name
        await sendEmailattachment(
          customer.email,
          sub,
          emailContentCustomer,
          attachmentPath,
          originalFileName
        );
      } else {
        await sendEmailattachment(customer.email, sub, emailContentCustomer);
      }
      // await sendtextmessage(customer.phone, emailContentCustomer);
    }

    res.status(200).json({ message: "Messages sent successfully" });

    // Schedule file deletion 48 hours later
    if (attachment && fs.existsSync(attachmentPath)) {
      setTimeout(() => {
        if (fs.existsSync(attachmentPath)) {
          fs.unlink(attachmentPath, err => {
            if (err) {
              console.error(`Error deleting file: ${err.message}`);
            } else {
              console.log(`File deleted successfully: ${attachmentPath}`);
            }
          });
        }
      }, 48 * 60 * 60 * 1000); // 48 hours in milliseconds
    }
  } catch (error) {
    console.error(`Error sending messages: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

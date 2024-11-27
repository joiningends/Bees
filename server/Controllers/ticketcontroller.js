const Ticket = require('../models/ticket'); // Adjust path as needed
                                     
const { sendEmail } = require('../Controllers/emailcontroller');
const { sendtextmessage } = require('../Controllers/whatsappcontroller');
const Customer = require('../models/customer'); // Ensure you have a Customer model to fetch customer details
const User = require('../models/user'); // Ensure you have a User model to fetch admin details
const Employee = require('../models/employee');

exports.createTicket = async (req, res) => {
    const {
        customerId,
        ticketTypeId,
        comment,
        startdate,
        assignToEmployeeId,
        by,
        status,
        Priority,
    } = req.body;

    try {
        // Validate required fields
        if (!customerId || !ticketTypeId || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate a unique ticket number
        // Generate a unique ticket number
        let ticketNumber = await generateTicketNumber();
        ticketNumber = ticketNumber.replace(/\/0+(\d)/, '/$1'); // Remove leading zeros in the ticket number part

        // Log the ticket number for debugging
        console.log(ticketNumber);

        const newTicket = new Ticket({
            ticketNumber,
            customerId,
            ticketTypeId,
            comment,
            startdate,
            assignToEmployeeId,
            by,
            status,
            Priority,
            statusHistory: [{ status, comment }],
        });

        // Save the ticket to the database
        const savedTicket = await newTicket.save();
        if (!savedTicket) {
            return res.status(500).json({ message: 'Failed to save the ticket' });
        }

        // Fetch customer details
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Fetch admin details
        const user = await User.find();
        const adminEmail = user[0].email;

        let emailContentCustomer, emailContentEmployee, emailContentAdmin;

        if (by === 'admin') { 
            if (!assignToEmployeeId) {
                // Email content if the ticket is created by admin and no employee is assigned
                emailContentCustomer = `Dear ${customer.name},

We are so happy to serve. Thank you for reaching out to us. We have received your query as follows:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}

An agent will be assigned to you soon and you will be notified of the same.

We are committed to provide you swift, timely and effective support at all times. We are actively working on resolving your query.

You can expect updates from us via email / WhatsApp or through a phone call. If you have any additional information or need further assistance, please let us know.

If you like our service, pls rate us by clicking here [google review link]

We respect your choice and appreciate your faith in us. Your patience and consideration is very important to us and we aspire to help you “achieve MORE … from less”.

Best Regards,
Team BEES

You can download our Mobile App from Play Store / App Store`;

                emailContentAdmin = `Dear Chief Dreamer, 

A query has been created as follow:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}

Best Regards,
Team BEES`;
await sendEmail(customer.email, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentCustomer);
          await sendtextmessage(customer.phone,  emailContentCustomer);
          await sendEmail(adminEmail, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentAdmin);
            } else {
                // Fetch employee details if assigned
                const employee = await Employee.findById(assignToEmployeeId);
                if (!employee) {
                    return res.status(404).json({ message: 'Assigned employee not found' });
                }

                // Email content if the ticket is created by admin and an employee is assigned
                emailContentCustomer = `Dear ${customer.name},

We are so happy to serve. Thank you for reaching out to us. The ticket has been Created and assigned to our agent:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

We are committed to provide you swift, timely and effective support at all times. We are actively working on resolving your query.

You can expect updates from us via email / WhatsApp or through a phone call. If you have any additional information or need further assistance, please let us know.

If you like our service, pls rate us by clicking here [google review link]

We respect your choice and appreciate your faith in us. Your patience and consideration is very important to us and we aspire to help you “achieve MORE … from less”.

Best Regards,
Team BEES

You can download our Mobile App from Play Store / App Store`;

                emailContentEmployee = `Dear ${employee.name},

We are so happy to serve. A query has been assigned to you as follow:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

Best Regards,
Team BEES`;

                emailContentAdmin = `Dear Chief Dreamer,

A query has been created as follow:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

Best Regards,
Team BEES`;

await sendEmail(customer.email, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentCustomer);
          await sendtextmessage(customer.phone,  emailContentCustomer);
          await sendEmail(employee.email, `New ServiceTicket Assigned with “Pending”  Status- ${ticketNumber}`, emailContentEmployee);
          await sendEmail(adminEmail,`Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentAdmin);
            }
        } else {
            const employee = await Employee.findById(assignToEmployeeId);
                if (!employee) {
                    return res.status(404).json({ message: 'Assigned employee not found' });
                }

            // If the ticket is created by an employee
            emailContentCustomer = `Dear ${customer.name},

We are so happy to serve. Thank you for reaching out to us. We have received your query as follows:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

We are committed to provide you swift, timely and effective support at all times. We are actively working on resolving your query.

You can expect updates from us via email / WhatsApp or through a phone call. If you have any additional information or need further assistance, please let us know.

If you like our service, pls rate us by clicking here [google review link]

We respect your choice and appreciate your faith in us. Your patience and consideration is very important to us and we aspire to help you “achieve MORE … from less”.

Best Regards,
Team BEES

You can download our Mobile App from Play Store / App Store`;

            emailContentEmployee = `Dear ${employee.name},

We are so happy to serve. A query has been created by you as follow:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}


Best Regards,
Team BEES`;

            emailContentAdmin = `Dear Chief Dreamer,

A query has been created as follow:
•	Ticket Number : ${ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}


Best Regards,
Team BEES`;
            await sendEmail(customer.email, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentCustomer);
          await sendtextmessage(customer.phone,  emailContentCustomer);
          await sendEmail(employee.email, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentEmployee);
          await sendEmail(adminEmail, `Service Ticket Created  with “Pending”  Status- ${ticketNumber}`, emailContentAdmin);
        }

       
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const generateTicketNumber = async () => {
    const year = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year
    const prefix = 'BEES';

    // Find the latest ticket number for the current year
    const latestTicket = await Ticket.findOne({ ticketNumber: new RegExp(`^${prefix}/${year}/`) })
                                    .sort({ ticketNumber: -1 });

    let nextNumber = 1;
    if (latestTicket) {
        // Extract the current max number and increment
        const lastNumber = parseInt(latestTicket.ticketNumber.split('/')[2], 10);
        nextNumber = lastNumber + 1;
    }

    // Format the ticket number with dynamic padding
    const ticketNumber = `${prefix}/${year}/${nextNumber.toString().padStart(9, '0')}`;
    return ticketNumber;
};





exports.updateTicket = async (req, res) => {
    const { id } = req.params;
    const { assignToEmployeeId, status, comment, startTime } = req.body;

    try {
        // Find the ticket by ID
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Update the ticket details
        ticket.assignToEmployeeId = assignToEmployeeId || ticket.assignToEmployeeId;
        ticket.status = status || ticket.status;
        ticket.startTime = startTime || ticket.startTime;

        // Push the new status and comment to the statusHistory array
        if (status && comment) {
            ticket.statusHistory.push({ status, comment });
        }

        // Save the updated ticket
        const updatedTicket = await ticket.save();
        if (!updatedTicket) {
            return res.status(500).json({ message: 'Failed to update the ticket' });
        }
        // Fetch customer details
        const customer = await Customer.findById(updatedTicket.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Fetch admin details
        const adminUser = await User.findOne(); // Assuming there is one admin
        const adminEmail = adminUser.email;

        // Fetch employee details if assigned
        let employee;
        if (assignToEmployeeId) {
            employee = await Employee.findById(assignToEmployeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Assigned employee not found' });
            }
        }

        // Prepare notification content
        
                // Email content if the ticket is created by admin and an employee is assigned
                emailContentCustomer = `Dear ${customer.name},

We are so happy to serve. Thank you for reaching out to us. The ticket has been Created and assigned to our agent:
•	Ticket Number : ${updatedTicket.ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${updatedTicket.Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

We are committed to provide you swift, timely and effective support at all times. We are actively working on resolving your query.

You can expect updates from us via email / WhatsApp or through a phone call. If you have any additional information or need further assistance, please let us know.

If you like our service, pls rate us by clicking here [google review link]

We respect your choice and appreciate your faith in us. Your patience and consideration is very important to us and we aspire to help you “achieve MORE … from less”.

Best Regards,
Team BEES

You can download our Mobile App from Play Store / App Store`;

                emailContentEmployee = `Dear ${employee.name},

We are so happy to serve. A query has been assigned to you as follow:
•	Ticket Number : ${updatedTicket.ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${updatedTicket.comment}
•	Priority : ${updatedTicket.Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

Best Regards,
Team BEES`;

                emailContentAdmin = `Dear Chief Dreamer,

A query has been created as follow:
•	Ticket Number : ${updatedTicket.ticketNumber}
•	Ticket Date : ${new Date().toLocaleDateString()}
•	Issue Description : ${comment}
•	Priority : ${updatedTicket.Priority}
•	Assigned Agent : ${employee.name}
•	Assigned Agent : Mobile: ${employee.phone}
•	Assigned Agent : Email: ${employee.email}

Best Regards,
Team BEES`;

await sendEmail(customer.email, `Service Ticket Updated with “Open” Status ${updatedTicket.ticketNumber}`, emailContentCustomer);
          await sendtextmessage(customer.phone,  emailContentCustomer);
          await sendEmail(employee.email, `New Service Ticket Assigned with “Open” Status ${updatedTicket.ticketNumber}`, emailContentEmployee);
          await sendEmail(employee.phone,  emailContentEmployee);
          await sendEmail(adminEmail, `Service Ticket Updated with “Open” Status ${updatedTicket.ticketNumber}`, emailContentAdmin);

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingTickets = async (req, res) => {
    const status = req.params.status;

    try {
        // Find tickets with the specified status and populate the customerId and assignToEmployeeId fields to include the names
        const pendingTickets = await Ticket.find({ status: status })
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name')
            .populate('ticketTypeId', 'name');

        if (pendingTickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        // Add statusComment to each ticket
        const updatedTickets = pendingTickets.map(ticket => {
            const statusHistoryItem = ticket.statusHistory.find(history => history.status.toString() === status.toString());
            return {
                ...ticket._doc,
                statusComment: statusHistoryItem ? statusHistoryItem.comment : null
            };
        });

        res.status(200).json(updatedTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getPendingTicketsbyid = async (req, res) => {
    const status = req.params.status;
    const assignToEmployeeId = req.params.id;

    try {
        // Query for tickets with the specified status and assigned to the specified employee
        const pendingTickets = await Ticket.find({ status: status, assignToEmployeeId })
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name')
            .populate('ticketTypeId', 'name');
        if (pendingTickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        // Add statusComment to each ticket
        const updatedTickets = pendingTickets.map(ticket => {
            const statusHistoryItem = ticket.statusHistory.find(history => history.status.toString() === status.toString());
            return {
                ...ticket._doc,
                statusComment: statusHistoryItem ? statusHistoryItem.comment : null
            };
        });

        res.status(200).json(updatedTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingTicketsbyidcustomer = async (req, res) => {
    const status = req.params.status;
    const customerId = req.params.id;

    try {
        // Query for tickets with the specified status and customer ID
        const pendingTickets = await Ticket.find({ status: status, customerId })
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name')
            .populate('ticketTypeId', 'name');
        if (pendingTickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        // Add statusComment to each ticket
        const updatedTickets = pendingTickets.map(ticket => {
            const statusHistoryItem = ticket.statusHistory.find(history => history.status.toString() === status.toString());
            return {
                ...ticket._doc,
                statusComment: statusHistoryItem ? statusHistoryItem.comment : null
            };
        });

        res.status(200).json(updatedTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Status = require('../models/status');
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

exports.editTicket = async (req, res) => {
    const { id } = req.params;
    const { status, endDate, comment } = req.body;

    try {
        // Find the ticket by ID
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Fetch the status by ID if provided
        
        
            const statusObj = await Status.findById(status);
            if (!statusObj) {
                return res.status(404).json({ message: 'Status not found' });
            }
            

        // Update the ticket details
        ticket.status = status;
        ticket.endDate = endDate || ticket.endDate;

        // Push the new status and comment to the statusHistory array if both are provided
        if (status && comment) {
            ticket.statusHistory.push({ status, comment });
        }

        // Save the updated ticket
        const updatedTicket = await ticket.save();
        if (!updatedTicket) {
            return res.status(500).json({ message: 'Failed to update the ticket' });
        }

        // Fetch customer details
        const customer = await Customer.findById(ticket.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Fetch admin details
        const adminUser = await User.findOne(); // Assuming there is one admin
        const adminEmail = adminUser.email;

        // Fetch employee details if assigned
        let employee;
        if (ticket.assignToEmployeeId) {
            employee = await Employee.findById(ticket.assignToEmployeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Assigned employee not found' });
            }
        }

        // Format dates
        const formattedStartDate = formatDate(updatedTicket.startdate);
        const formattedEndDate = endDate ? formatDate(endDate) : null;

        // Prepare notification content for customer
        const emailContentCustomer = formattedEndDate
            ? `
Dear ${customer.name},

We are pleased to inform you that your service ticket (${updatedTicket.ticketNumber}) has been successfully resolved. We want to continue to serve you to the best of our ability. Your patience throughout the process was highly helpful.

Here are the details of the resolution:
• Issue Resolved: ${updatedTicket.comment}
• Resolution Summary: ${comment}
• Ticket Closure Date: ${formattedEndDate}

If you have any further questions or need additional assistance, please don’t hesitate to reach out. We value your feedback and strive to continuously improve our services.

On a scale of 1-10, how would you rate us? [Clickable Link for rating]

Thank you for choosing us, and we look forward to serving you again in the future!

Best regards,
Team BEES

                You can download our Mobile App from Play Store / App Store
            `
            : `
Dear ${customer.name},

We wanted to inform you that your service ticket (${updatedTicket.ticketNumber}) has been updated with a status of “${status}”. We want to continue to serve you to the best of our ability. Your patience throughout the process is appreciated.

Here are the details of the update:
• Issue Resolved: ${updatedTicket.comment}
• Ticket Closure Date: ${formattedEndDate}
• Current Status Remarks: ${comment}

If you have any further questions or need additional assistance, please don’t hesitate to reach out. We value your feedback and strive to continuously improve our services.

On a scale of 1-10, how would you rate us? [Clickable Link for rating]

Thank you for choosing us, and we look forward to serving you again in the future!

Best regards,
Team BEES

You can download our Mobile App from Play Store / App Store
            `;

        const whatsappContentCustomer = formattedEndDate
            ? `
Dear ${customer.name},

Your service ticket (${updatedTicket.ticketNumber}) has been successfully resolved. 
• Issue Resolved: ${updatedTicket.comment}
• Resolution Summary: ${comment}
• Ticket Closure Date: ${formattedEndDate}

Thank you for your patience. If you have any further questions or need additional assistance, please let us know!

Best regards,
 Team BEES
            `
            : `
Dear ${customer.name},

Your service ticket (${updatedTicket.ticketNumber}) has been updated.

• Ticket Number: ${updatedTicket.ticketNumber}
• Ticket Date: ${formattedStartDate}
• Issue Description: ${updatedTicket.comment}
• Priority: ${updatedTicket.Priority}
• Current Status: ${statusObj.status}
• Current Status Remarks: ${comment}

If you have any questions or need further assistance, please reach out to us.

Best regards,
Team BEES
            `;

        // Prepare notification content for employee
        const emailContentEmployee = formattedEndDate
            ? `
Dear ${employee.name},

We wanted to inform you that the service ticket assigned to you has been closed.
• Issue Resolved: ${updatedTicket.comment}
• Resolution Summary: ${comment}
• Ticket Closure Date: ${formattedEndDate}
          
Best Regards,
Team BEES
            `
            : `
Dear ${employee.name},

We wanted to inform you that the service ticket assigned to you has been updated.
• Ticket Number: ${updatedTicket.ticketNumber}
• Ticket Date: ${formattedStartDate}
• Issue Description: ${updatedTicket.comment}
• Priority: ${updatedTicket.Priority}
• Current Status: ${statusObj.status}
• Current Status Remarks: ${comment}

Best Regards,
Team BEES
            `;

        // Prepare notification content for admin
        const emailContentAdmin = formattedEndDate
            ? `
Dear Chief Dreamer,

A service ticket has been closed with the following details:
• Ticket Number: ${updatedTicket.ticketNumber}
• Ticket Date: ${formattedStartDate}
• Issue Description: ${updatedTicket.comment}
• Resolution Summary: ${comment}
• Ticket Closure Date: ${formattedEndDate}

Best Regards,
Team BEES
            `
            : `
Dear Chief Dreamer,                
                
A service ticket has been updated with the following details:
• Ticket Number: ${updatedTicket.ticketNumber}
• Ticket Date: ${formattedStartDate}
• Issue Description: ${updatedTicket.comment}
• Priority: ${updatedTicket.Priority}
• Current Status: ${statusObj.status}
• Current Status Remarks: ${comment}

Best Regards,
Team BEES
            `;

        // Send notifications
        await sendEmail(customer.email, `Service Ticket Status Update “${statusObj.status}” - ${updatedTicket.ticketNumber}`, emailContentCustomer);
        await sendtextmessage(customer.phone, whatsappContentCustomer);

        if (employee) {
            await sendEmail(employee.email, `Service Ticket Status Update “${statusObj.status}” - ${updatedTicket.ticketNumber}`, emailContentEmployee);
        }

        await sendEmail(adminEmail, `Service Ticket Status Update “${statusObj.status}” - ${updatedTicket.ticketNumber}`, emailContentAdmin);

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.deleteAllTickets = async (req, res) => {
    try {
        //const result = await Ticket.deleteMany({});
        const result = await Customer.deleteMany({});
        res.status(200).json({ message: 'All tickets deleted successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

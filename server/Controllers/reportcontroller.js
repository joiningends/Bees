const Ticket = require('../models/ticket'); // Adjust path as needed
const Status = require('../models/status');


const { Parser } = require('json2csv');
const fs = require('fs');
const XLSX = require('xlsx');

function formatTime(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    return `${hours} hours ${minutes} mins`;
}

exports.getClosedTicketsByType = async (req, res) => {
    try {
        // Retrieve status ID from request parameters, if provided
        const statusId = req.query.statusId; // Use query parameters for flexibility
        // Retrieve ticket type ID from request parameters
        const ticketTypeId = req.params.ticketTypeId;

        // Define the query object
        const query = { ticketTypeId };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', just use the status ID in the query
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





exports.getClosedTicketsByCustomerId = async (req, res) => {
    try {
        // Retrieve status ID from query parameters, if provided
        const statusId = req.query.statusId;
        const customerId = req.params.customerId;

        // Define the query object
        const query = { customerId };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', use the provided status ID anyway
                query.status = statusId;
            }
        } 
        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClosedTicketsByEmployeeId = async (req, res) => {
    try {
        // Retrieve status ID from query parameters, if provided
        const statusId = req.query.statusId;
        const employeeId = req.params.employeeId;

        // Define the query object
        const query = { assignToEmployeeId: employeeId };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', use the provided status ID anyway
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.getClosedTicketsByTypedaterange = async (req, res) => {
 
    try {
        // Retrieve query parameters
         // Date range from query parameters
        const ticketTypeId = req.params.ticketTypeId; // Ticket Type ID from request parameters
        const statusId = req.query.statusId; // Status ID from query parameters
        const { fromDate, toDate } = req.query;
        // Prepare date range condition
        
       const dateRangeCondition = {};
        if (fromDate) {
            dateRangeCondition.$gte = new Date(fromDate).toISOString();
        }

        if (toDate) {
            // Set to end of the day for inclusivity
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateRangeCondition.$lte = endDate.toISOString();
        }

        // Define the query object
        const query = {
            ticketTypeId,
            startdate: dateRangeCondition // Always apply date range filter
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', just use the status ID in the query
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        // Respond with error message
        res.status(500).json({ error: error.message });
    }
};


exports.getClosedTicketsByCustomerIddaterange = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const statusId = req.query.statusId; // Status ID from query parameters

        const dateRangeCondition = {};
        if (fromDate) {
            dateRangeCondition.$gte = new Date(fromDate).toISOString();
        }

        if (toDate) {
            // Set to end of the day for inclusivity
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateRangeCondition.$lte = endDate.toISOString();
        }
        // Define the query object
        const query = {
            customerId: req.params.customerId,
            startdate: dateRangeCondition // Always apply date range filter
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', just use the status ID in the query
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        // Respond with error message
        res.status(500).json({ error: error.message });
    }
};



exports.getClosedTicketsByEmployeeIddaterange = async (req, res) => {
   
        try {
            const { fromDate, toDate, statusId } = req.query; // Retrieve statusId, fromDate, and toDate from query parameters
            const employeeId = req.params.employeeId; // Retrieve employeeId from request parameters
    
            // Prepare date range condition
           
            const dateRangeCondition = {};
            if (fromDate) {
                dateRangeCondition.$gte = new Date(fromDate).toISOString();
            }
    
            if (toDate) {
                // Set to end of the day for inclusivity
                const endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999);
                dateRangeCondition.$lte = endDate.toISOString();
            }
            // Define the query object
            const query = {
                assignToEmployeeId: employeeId,
                startdate: dateRangeCondition // Always apply date range filter
            };
    
            // If status ID is provided, add it to the query
            if (statusId) {
                query.status = statusId;
            }
    
            const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Respond with tickets and average turnaround time for closed tickets
        res.status(200).json({ tickets, averageTurnaroundTime });
    } catch (error) {
        // Respond with error message
        res.status(500).json({ error: error.message });
    }
};





const ExcelJS = require('exceljs');
//const { Parser } = require('json2csv');
const moment = require('moment-timezone');  // Import moment-timezone for date formatting

const generateReport = async (tickets, averageTurnaroundTime, filePath) => {
    // Prepare data for CSV
    const fields = ['TicketNumber', 'CustomerName', 'EmployeeName', 'Status', 'StartDate', 'EndDate', 'TurnaroundTime'];
    const json2csvParser = new Parser({ fields });

    // Convert dates to IST format and prepare ticket data
    const ticketData = tickets.map(ticket => ({
        TicketNumber: ticket.ticketNumber,
        CustomerName: ticket.customerId.name,
        EmployeeName: ticket.assignToEmployeeId.name,
        Status: ticket.status.status,
        StartDate: moment(ticket.startdate).tz('Asia/Kolkata').format('DD.MM.YYYY HH:mm'),
        EndDate: moment(ticket.endDate).tz('Asia/Kolkata').format('DD.MM.YYYY HH:mm'),
        TurnaroundTime: ticket.turnaroundTime
    }));

    // Add average turnaround time row to the end of the CSV data
    const averageTurnaroundRow = {
        TicketNumber: '',
        CustomerName: '',
        EmployeeName: '',
        Status: '',
        StartDate: '',
        EndDate: 'Average Turnaround Time:',
        TurnaroundTime: averageTurnaroundTime
    };
    ticketData.push(averageTurnaroundRow);

    const csv = json2csvParser.parse(ticketData);

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');

    // Define header style
    const headerStyle = {
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2f4050' }  // Background color #2f4050
        },
        font: {
            color: { argb: 'FFFFFFFF' }  // Font color white
        }
    };

    // Add columns and rows to the worksheet
    worksheet.columns = fields.map(field => ({ header: field, key: field }));
    worksheet.addRows(ticketData);

    // Apply header styles
    worksheet.getRow(1).eachCell(cell => {
        cell.style = headerStyle;
    });

    // Add average turnaround time in deep pink and bold
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Average Turnaround Time', averageTurnaroundTime]);

    // Define deep pink style
    const deepPinkStyle = {
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1493' }  // Deep pink background
        },
        font: {
            color: { argb: 'FF1493' },  // Deep pink text
            bold: true  // Make text bold
        }
    };

    summarySheet.getCell('A1').style = deepPinkStyle;
    summarySheet.getCell('B1').style = deepPinkStyle;

    // Write workbook to file
    await workbook.xlsx.writeFile(filePath);

    return csv;
};

exports.getClosedTicketsByTypecsv= async (req, res) => {
    try {
        const { fromDate, toDate, statusId } = req.query;
        const ticketTypeId = req.params.ticketTypeId;

        

        // Define the query object
        const query = {
            ticketTypeId,
           
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', just use the status ID in the query
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Generate report and send as response
        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        // Respond with error message
        res.status(500).json({ error: error.message });
    }
};

// Utility function to format turnaround time
function formatTime(turnaroundTime) {
    const hours = Math.floor(turnaroundTime);
    const minutes = Math.round((turnaroundTime % 1) * 60);
    return `${hours} hours ${minutes} mins`;
}



exports.getClosedTicketsByCustomerIdcsv = async (req, res) => {
    try {
        const statusId = req.query.statusId;
        const customerId = req.params.customerId;

        // Define the query object
        const query = { customerId };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', use the provided status ID anyway
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClosedTicketsByEmployeeIdcsv = async (req, res) => {
    try {
        const statusId = req.query.statusId;
        const employeeId = req.params.employeeId;

        // Define the query object
        const query = { assignToEmployeeId: employeeId };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', use the provided status ID anyway
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getClosedTicketsByTypedaterangecsv = async (req, res) => {
    try {
        const ticketTypeId = req.params.ticketTypeId; // Ticket Type ID from request parameters
        const statusId = req.query.statusId; // Status ID from query parameters
        const { fromDate, toDate } = req.query; // Date range from query parameters

        // Prepare date range condition
        const dateRangeCondition = {};
        if (fromDate) {
            dateRangeCondition.$gte = new Date(fromDate).toISOString();
        }

        if (toDate) {
            // Set to end of the day for inclusivity
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateRangeCondition.$lte = endDate.toISOString();
        }
        // Define the query object
        const query = {
            ticketTypeId,
            startdate: dateRangeCondition // Always apply date range filter
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                query.status = statusId; // Use the provided status ID in the query
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        // Generate report and send as response
        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

        

exports.getClosedTicketsByCustomerIddaterangecsv = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const statusId = req.query.statusId; // Status ID from query parameters

        const dateRangeCondition = {};
        if (fromDate) {
            dateRangeCondition.$gte = new Date(fromDate).toISOString();
        }

        if (toDate) {
            // Set to end of the day for inclusivity
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateRangeCondition.$lte = endDate.toISOString();
        }
        // Define the query object
        const query = {
            customerId: req.params.customerId,
            startdate: dateRangeCondition // Always apply date range filter
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            // Fetch status based on status ID
            const status = await Status.findById(statusId);

            // Check if status is found and equals 'Closed'
            if (status && status.status === 'Closed') {
                query.status = statusId;
            } else {
                // If status is not 'Closed', just use the status ID in the query
                query.status = statusId;
            }
        }

        // Find tickets with the given conditions
        const tickets = await Ticket.find(query)
            .populate('status')
            .populate('customerId', 'name')
            .populate('assignToEmployeeId', 'name');

        // Check if tickets are found
        if (tickets.length === 0) {
            return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
        }

        // Calculate individual turnaround times and total closure time for closed tickets
        let totalClosureTime = 0;
        let closedTicketCount = 0;

        tickets.forEach(ticket => {
            const startTime = new Date(ticket.startdate).getTime();
            const endTime = new Date(ticket.endDate).getTime();
            const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

            if (ticket.status && ticket.status.status === 'Closed') {
                ticket.turnaroundTime = formatTime(turnaroundTime);
                totalClosureTime += turnaroundTime;
                closedTicketCount++;
            } else {
                ticket.turnaroundTime = "N/A";
            }
        });

        // Calculate average turnaround time for closed tickets
        const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClosedTicketsByEmployeeIddaterangecsv = async (req, res) => {
    try {
        const { fromDate, toDate, statusId } = req.query; // Retrieve statusId, fromDate, and toDate from query parameters
        const employeeId = req.params.employeeId; // Retrieve employeeId from request parameters

        // Prepare date range condition
       
        const dateRangeCondition = {};
        if (fromDate) {
            dateRangeCondition.$gte = new Date(fromDate).toISOString();
        }

        if (toDate) {
            // Set to end of the day for inclusivity
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateRangeCondition.$lte = endDate.toISOString();
        }
        const query = {
            assignToEmployeeId: employeeId,
            startdate: dateRangeCondition // Always apply date range filter
        };

        // If status ID is provided, add it to the query
        if (statusId) {
            query.status = statusId;
        }

        const tickets = await Ticket.find(query)
        .populate('status')
        .populate('customerId', 'name')
        .populate('assignToEmployeeId', 'name');

    // Check if tickets are found
    if (tickets.length === 0) {
        return res.status(200).json({ tickets: [], averageTurnaroundTime: "NaN hours NaN mins" });
    }

    // Calculate individual turnaround times and total closure time for closed tickets
    let totalClosureTime = 0;
    let closedTicketCount = 0;

    tickets.forEach(ticket => {
        const startTime = new Date(ticket.startdate).getTime();
        const endTime = new Date(ticket.endDate).getTime();
        const turnaroundTime = (endTime - startTime) / 3600000; // Convert to hours

        if (ticket.status && ticket.status.status === 'Closed') {
            ticket.turnaroundTime = formatTime(turnaroundTime);
            totalClosureTime += turnaroundTime;
            closedTicketCount++;
        } else {
            ticket.turnaroundTime = "N/A";
        }
    });

    // Calculate average turnaround time for closed tickets
    const averageTurnaroundTime = closedTicketCount > 0 ? formatTime(totalClosureTime / closedTicketCount) : 'N/A';

        const filePath = 'tickets_report.xlsx';
        await generateReport(tickets, averageTurnaroundTime, filePath);

        res.download(filePath, 'tickets_report.xlsx', (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
            fs.unlinkSync(filePath); // Clean up the file after sending
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

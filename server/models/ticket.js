const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  ticketNumber: {
    type: String,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  ticketTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'TicketType',
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  Priority: {
    type: String,
  },
  startdate: {
    type: String,
  },
  assignToEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  },
  by: {
    type: String,
  },
  endDate: {
    type: String,
  },
  turnaroundTime: {
    type: String,
  },
  statusHistory: [
    {
      status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
      },
      comment: {
        type: String,
      },
     
    },
  ],
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

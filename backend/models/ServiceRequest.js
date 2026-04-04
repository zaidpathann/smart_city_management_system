/**
 * ServiceRequest Model
 * Utility service requests (water, electricity, etc.)
 */

const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String },
  serviceType: {
    type: String,
    enum: ['Water', 'Electricity', 'Gas', 'Internet', 'Sewage', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

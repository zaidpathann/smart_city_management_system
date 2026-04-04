/**
 * Complaint Model
 * Stores citizen complaints with image support
 */

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String },  // Denormalized for quick display
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Noise', 'Other'],
    default: 'Other'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageFileId: {
    type: String,  // ImageKit file ID for deletion
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  adminNote: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

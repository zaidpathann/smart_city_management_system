/**
 * Report Model
 * Cleanliness / Waste / Garbage reporting by citizens
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String },
  category: {
    type: String,
    enum: ['Garbage', 'Open Drain', 'Stagnant Water', 'Illegal Dumping', 'Other'],
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageFileId: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

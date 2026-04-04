/**
 * Parking Model
 * Admin manages parking locations; users view availability
 */

const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parking location name is required'],
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  availableSlots: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Full', 'Closed'],
    default: 'Available'
  },
  fee: {
    type: String,
    default: 'Free'
  }
}, { timestamps: true });

module.exports = mongoose.model('Parking', parkingSchema);

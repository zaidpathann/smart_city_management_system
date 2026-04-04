/**
 * Parking Routes - /api/parking
 */

const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const { protect, adminOnly } = require('../middleware/auth');

// GET / - all users view parking
router.get('/', protect, async (req, res) => {
  try {
    const parkings = await Parking.find().sort({ name: 1 });
    res.json({ success: true, parkings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / - admin adds parking location
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, address, totalSlots, availableSlots, fee, status } = req.body;
    const parking = await Parking.create({ name, address, totalSlots, availableSlots, fee, status });
    res.status(201).json({ success: true, message: 'Parking added', parking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id - admin updates parking
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Parking updated', parking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id - admin deletes
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Parking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Parking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

/**
 * Service Request Routes - /api/services
 */

const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const { protect, adminOnly } = require('../middleware/auth');

// POST / - citizen submits service request
router.post('/', protect, async (req, res) => {
  try {
    const { serviceType, description, address } = req.body;
    const request = await ServiceRequest.create({
      user: req.user.id,
      userName: req.user.name,
      serviceType, description, address
    });
    res.status(201).json({ success: true, message: 'Service request submitted', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /my - citizen's own requests
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET / - admin views all
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id - admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Updated', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id - admin deletes
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await ServiceRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

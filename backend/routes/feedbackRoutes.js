/**
 * Feedback Routes - /api/feedback
 */

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

// POST - citizen submits feedback
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message, rating } = req.body;
    const feedback = await Feedback.create({
      user: req.user.id,
      userName: req.user.name,
      subject, message, rating
    });
    res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /my - citizen views own feedback
router.get('/my', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET / - admin views all feedback
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id/read - admin marks as read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    await Feedback.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id - admin deletes
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

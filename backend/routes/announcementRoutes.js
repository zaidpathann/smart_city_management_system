/**
 * Announcement Routes - /api/announcements
 * Admin creates; all authenticated users view
 */

const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/announcements - All authenticated users
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/announcements - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const announcement = await Announcement.create({
      title, content, priority: priority || 'Medium',
      postedBy: req.user.id
    });
    res.status(201).json({ success: true, message: 'Announcement posted', announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/announcements/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

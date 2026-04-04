/**
 * Cleanliness / Waste Report Routes - /api/reports
 */

const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../config/multer');
const imagekit = require('../config/imagekit');

// POST / - citizen submits report
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { category, location, description } = req.body;
    let imageUrl = '', imageFileId = '';

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: `report_${Date.now()}_${req.file.originalname}`,
        folder: '/smartcity/reports'
      });
      imageUrl = result.url;
      imageFileId = result.fileId;
    }

    const report = await Report.create({
      user: req.user.id,
      userName: req.user.name,
      category, location, description, imageUrl, imageFileId
    });
    res.status(201).json({ success: true, message: 'Report submitted', report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /my - citizen's own reports
router.get('/my', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET / - admin views all
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id - admin updates status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Updated', report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id - admin deletes
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report && report.imageFileId) {
      try { await imagekit.deleteFile(report.imageFileId); } catch (e) {}
    }
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

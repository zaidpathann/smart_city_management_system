/**
 * Complaint Routes - /api/complaints
 * Citizens submit; admin manages
 */

const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../config/multer');
const imagekit = require('../config/imagekit');

// ─── POST /api/complaints (citizen: submit complaint) ─────────────────────────
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let imageUrl = '';
    let imageFileId = '';

    // Upload image to ImageKit if provided
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: `complaint_${Date.now()}_${req.file.originalname}`,
        folder: '/smartcity/complaints'
      });
      imageUrl = result.url;
      imageFileId = result.fileId;
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      userName: req.user.name,
      title,
      description,
      category: category || 'Other',
      imageUrl,
      imageFileId
    });

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/complaints/my (citizen: own complaints) ─────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/complaints (admin: all complaints) ──────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/complaints/stats (admin: analytics) ─────────────────────────────
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    res.json({ success: true, stats: { total, pending, inProgress, resolved } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/complaints/:id (admin: update status) ───────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint updated', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/complaints/:id (admin: delete) ───────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });

    // Delete image from ImageKit if exists
    if (complaint.imageFileId) {
      try { await imagekit.deleteFile(complaint.imageFileId); } catch (e) { /* ignore */ }
    }

    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

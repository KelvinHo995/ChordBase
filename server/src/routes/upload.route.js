// server/src/routes/upload.route.js
const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { protect, restrictTo, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// ===== PUBLIC ROUTES =====

// Search songs for autocomplete
router.get('/search-songs', uploadController.searchSongs);

// Get all genres for dropdown
router.get('/genres', uploadController.getGenres);

// ===== UPLOAD ROUTES =====

// Upload chord sheet (optional auth)
router.post('/chord-sheet', optionalAuth, uploadController.uploadChordSheet);

// ===== USER ROUTES (protected) =====

// Get my uploads
router.get('/my-uploads', protect, uploadController.getMyUploads);

// Update my chord sheet
router.put('/chord-sheet/:chord_sheet_id', protect, uploadController.updateChordSheet);

// Delete my chord sheet
router.delete('/chord-sheet/:chord_sheet_id', protect, uploadController.deleteChordSheet);

// ===== ADMIN ROUTES =====

// Get pending uploads
router.get('/pending', protect, restrictTo('admin'), uploadController.getPendingUploads);

// Approve/reject
router.post('/moderate/:chord_sheet_id', protect, restrictTo('admin'), uploadController.moderateChordSheet);

module.exports = router;
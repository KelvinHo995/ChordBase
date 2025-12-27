const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');

// POST /api/ratings - Create or update rating (requires auth)
router.post('/', protect, ratingController.upsertRating);

// GET /api/ratings/chord-sheet/:chordSheetId - Get rating info (optional auth)
router.get('/chord-sheet/:chordSheetId', optionalAuth, ratingController.getChordSheetRating);

// DELETE /api/ratings/chord-sheet/:chordSheetId - Delete rating (requires auth)
router.delete('/chord-sheet/:chordSheetId', protect, ratingController.deleteRating);

module.exports = router;

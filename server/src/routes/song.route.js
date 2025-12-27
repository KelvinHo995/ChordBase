// server/src/routes/search.route.js
const express = require('express');
const songController = require('../controllers/song.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes (optional auth for personalization)

// Main search endpoint
router.get('/', optionalAuth, songController.search);

// Get popular songs
router.get('/popular', songController.getPopular);

// Get recently added/edited songs
router.get('/recent', songController.getRecent);

// Get pending songs
router.get('/pending', songController.getPending);

// Approve pending songs
router.post('/pending/approve/:chord_sheet_id', songController.approveSong);

// Reject pending songs
router.post('/pending/reject/:chord_sheet_id', songController.rejectSong);

// Search by chord progression
router.get('/chords', optionalAuth, songController.searchByChords);

// Get specific song with all versions
router.get('/:song_id', optionalAuth, songController.getSong);

module.exports = router;
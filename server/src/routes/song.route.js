// server/src/routes/search.route.js
const express = require('express');
const songController = require('../controllers/song.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes (optional auth for personalization)

// Main search endpoint
router.get('/', optionalAuth, songController.search);

// Get specific song with all versions
router.get('/:song_id', optionalAuth, songController.getSong);

// Search by chord progression
router.get('/chords', optionalAuth, songController.searchByChords);

// Get popular songs
router.get('/popular', songController.getPopular);

module.exports = router;
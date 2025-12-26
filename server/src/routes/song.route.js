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

// Search by chord progression
router.get('/chords', optionalAuth, songController.searchByChords);

// Get specific song with all versions
router.get('/:song_id', optionalAuth, songController.getSong);


module.exports = router;
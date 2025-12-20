// server/src/routes/search.route.js
const express = require('express');
const searchController = require('../controllers/search.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes (optional auth for personalization)

// Main search endpoint
router.get('/', optionalAuth, searchController.search);

// Get specific song with all versions
router.get('/songs/:song_id', optionalAuth, searchController.getSong);

// Search by chord progression
router.get('/chords', optionalAuth, searchController.searchByChords);

// Get popular songs
router.get('/popular', searchController.getPopular);

module.exports = router;
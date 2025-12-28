const express = require('express');
const PlaylistController = require('../controllers/playlist.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes (optional auth for personalization)

// Main search endpoint

// Get all playlists
router.get('/', protect, PlaylistController.getAllPlaylists);

// Create a new playlist
router.post('/', protect, PlaylistController.createPlaylist);

// Get favorite songs of the authenticated user
router.get('/favorites', protect, PlaylistController.getFavoriteSongs);
// Add to favorites
router.post('/favorites/:songId', protect, PlaylistController.addFavorite);

// Remove from favorites
router.delete('/favorites/:songId', protect, PlaylistController.removeFavorite);

// Get a specific playlist by ID
router.get('/:id', protect, PlaylistController.getPlaylistById);

// Delete a playlist
router.delete('/:id', protect, PlaylistController.deletePlaylist);

// Add a song to a playlist
router.post('/:id/songs', protect, PlaylistController.addSongToPlaylist);

// Remove a song from a playlist
router.delete('/:id/songs/:songId', protect, PlaylistController.removeSongFromPlaylist);

module.exports = router;
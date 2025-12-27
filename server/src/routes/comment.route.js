// server/src/routes/comment.route.js
const express = require('express');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All comment routes require authentication
// POST /api/comments - Create a new comment
router.post('/', protect, commentController.createComment);

// GET /api/comments/chord-sheet/:chord_sheet_id - Get all comments for a chord sheet
router.get('/chord-sheet/:chord_sheet_id', commentController.getCommentsByChordSheet);

// PUT /api/comments/:comment_id - Update a comment
router.put('/:comment_id', protect, commentController.updateComment);

// DELETE /api/comments/:comment_id - Delete a comment
router.delete('/:comment_id', protect, commentController.deleteComment);

module.exports = router;

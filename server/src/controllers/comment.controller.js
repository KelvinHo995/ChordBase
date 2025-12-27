// server/src/controllers/comment.controller.js
const commentService = require('../services/comment.service');

class CommentController {
    // POST /api/comments
    async createComment(req, res) {
        try {
            const { chord_sheet_id, content, parent_comment_id } = req.body;
            const user_id = req.user.user_id;

            // Validation
            if (!chord_sheet_id || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'chord_sheet_id and content are required'
                });
            }

            if (content.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Comment content cannot be empty'
                });
            }

            const comment = await commentService.createComment({
                chord_sheet_id,
                user_id,
                content: content.trim(),
                parent_comment_id
            });

            res.status(201).json({
                success: true,
                data: { comment }
            });
        } catch (error) {
            console.error('Create comment error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/comments/chord-sheet/:chord_sheet_id
    async getCommentsByChordSheet(req, res) {
        try {
            const { chord_sheet_id } = req.params;
            const { page, limit } = req.query;

            const result = await commentService.getCommentsByChordSheet(chord_sheet_id, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 50
            });

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Get comments error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/comments/:comment_id
    async updateComment(req, res) {
        try {
            const { comment_id } = req.params;
            const { content } = req.body;
            const user_id = req.user.user_id;

            if (!content || content.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required'
                });
            }

            const comment = await commentService.updateComment(
                comment_id,
                user_id,
                content.trim()
            );

            res.status(200).json({
                success: true,
                data: { comment }
            });
        } catch (error) {
            console.error('Update comment error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/comments/:comment_id
    async deleteComment(req, res) {
        try {
            const { comment_id } = req.params;
            const user_id = req.user.user_id;
            const is_admin = req.user.role === 'admin';

            const result = await commentService.deleteComment(comment_id, user_id, is_admin);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CommentController();

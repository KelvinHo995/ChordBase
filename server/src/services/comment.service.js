// server/src/services/comment.service.js
const { Comment, User, ChordSheet } = require('../models');
const { Op } = require('sequelize');

class CommentService {
    // Create a new comment
    async createComment({ chord_sheet_id, user_id, content, parent_comment_id = null }) {
        // Verify chord sheet exists
        const chordSheet = await ChordSheet.findOne({
            where: { 
                chord_sheet_id,
                is_deleted: false,
                status: 'approved'
            }
        });

        if (!chordSheet) {
            throw new Error('Chord sheet not found or not available');
        }

        let depth = 0;
        let thread_root_id = null;

        // If this is a reply, validate parent comment and calculate depth
        if (parent_comment_id) {
            const parentComment = await Comment.findOne({
                where: { 
                    comment_id: parent_comment_id,
                    is_deleted: false
                }
            });

            if (!parentComment) {
                throw new Error('Parent comment not found');
            }

            // Verify parent comment belongs to the same chord sheet
            if (parentComment.chord_sheet_id !== chord_sheet_id) {
                throw new Error('Parent comment belongs to a different chord sheet');
            }

            depth = parentComment.depth + 1;
            // Set thread root to parent's root, or parent itself if it's a top-level comment
            thread_root_id = parentComment.thread_root_id || parent_comment_id;
        }

        // Create the comment
        const comment = await Comment.create({
            chord_sheet_id,
            user_id,
            content,
            parent_comment_id,
            depth,
            thread_root_id
        });

        // Return comment with user information
        return await Comment.findOne({
            where: { comment_id: comment.comment_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'display_name']
                }
            ]
        });
    }

    // Get comments for a chord sheet
    async getCommentsByChordSheet(chord_sheet_id, options = {}) {
        const { page = 1, limit = 50 } = options;
        const offset = (page - 1) * limit;

        const { count, rows } = await Comment.findAndCountAll({
            where: {
                chord_sheet_id,
                is_deleted: false
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'display_name']
                }
            ],
            order: [
                ['thread_root_id', 'ASC NULLS FIRST'],
                ['created_at', 'ASC']
            ],
            offset,
            limit
        });

        return {
            comments: rows,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    // Update a comment
    async updateComment(comment_id, user_id, content) {
        const comment = await Comment.findOne({
            where: {
                comment_id,
                user_id, // Only owner can update
                is_deleted: false
            }
        });

        if (!comment) {
            throw new Error('Comment not found or you do not have permission to update it');
        }

        comment.content = content;
        await comment.save();

        return await Comment.findOne({
            where: { comment_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'display_name']
                }
            ]
        });
    }

    // Delete a comment (soft delete)
    async deleteComment(comment_id, user_id, is_admin = false) {
        const whereClause = {
            comment_id,
            is_deleted: false
        };

        // Only owner can delete unless admin
        if (!is_admin) {
            whereClause.user_id = user_id;
        }

        const comment = await Comment.findOne({ where: whereClause });

        if (!comment) {
            throw new Error('Comment not found or you do not have permission to delete it');
        }

        comment.is_deleted = true;
        comment.deleted_at = new Date();
        await comment.save();

        return { message: 'Comment deleted successfully' };
    }
}

module.exports = new CommentService();

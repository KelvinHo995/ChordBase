// server/src/controllers/upload.controller.js
const uploadService = require('../services/upload.service');

class UploadController {
    // GET /api/upload/search-songs?q=shape
    async searchSongs(req, res) {
        try {
            const { q: query, limit = 10 } = req.query;

            if (!query || query.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Query must be at least 2 characters'
                });
            }

            const songs = await uploadService.searchSongsForUpload(
                query,
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: { songs }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/upload/genres
    async getGenres(req, res) {
        try {
            const genres = await uploadService.getAllGenres();

            res.status(200).json({
                success: true,
                data: { genres }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/upload/chord-sheet
    async uploadChordSheet(req, res) {
        try {
            const {
                // Existing song
                song_id,
                // New song
                songname,
                author,
                genre_id,
                // Chord sheet
                key,
                difficulty,
                content,
                uploader_id
            } = req.body;

            // Validation
            if (!song_id && (!songname || !author)) {
                return res.status(400).json({
                    success: false,
                    message: 'Either song_id or (songname + author) is required'
                });
            }

            if (!content || content.trim().length < 50) {
                return res.status(400).json({
                    success: false,
                    message: 'Content must be at least 50 characters'
                });
            }

            const result = await uploadService.uploadChordSheet({
                song_id: song_id || null,
                songname,
                author,
                genre_id,
                key,
                difficulty: difficulty || 'Beginner',
                content,
                uploader_id: uploader_id || req.user?.user_id || null
            });

            res.status(201).json({
                success: true,
                message: 'Chord sheet uploaded successfully. Pending approval.',
                data: {
                    chord_sheet: result
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/upload/my-uploads
    async getMyUploads(req, res) {
        try {
            const uploader_id = req.user.user_id;
            const { page = 1, limit = 20, status } = req.query;

            const result = await uploadService.getChordSheetsByUploader(
                uploader_id,
                {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    status
                }
            );

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/upload/chord-sheet/:chord_sheet_id
    async updateChordSheet(req, res) {
        try {
            const { chord_sheet_id } = req.params;
            const uploader_id = req.user.user_id;
            const updates = req.body;

            const result = await uploadService.updateChordSheet(
                chord_sheet_id,
                uploader_id,
                updates
            );

            res.status(200).json({
                success: true,
                message: 'Chord sheet updated successfully',
                data: {
                    chord_sheet: result
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/upload/chord-sheet/:chord_sheet_id
    async deleteChordSheet(req, res) {
        try {
            const { chord_sheet_id } = req.params;
            const uploader_id = req.user.user_id;

            const result = await uploadService.deleteChordSheet(
                chord_sheet_id,
                uploader_id
            );

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ===== ADMIN ENDPOINTS =====

    async getPendingUploads(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;

            const result = await uploadService.getPendingChordSheets({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async moderateChordSheet(req, res) {
        try {
            const { chord_sheet_id } = req.params;
            const { action } = req.body;
            const admin_id = req.user.user_id;

            if (!action) {
                return res.status(400).json({
                    success: false,
                    message: 'Action is required (approve or reject)'
                });
            }

            const result = await uploadService.moderateChordSheet(
                chord_sheet_id,
                admin_id,
                action
            );

            res.status(200).json({
                success: true,
                message: `Chord sheet ${action}d successfully`,
                data: {
                    chord_sheet: result
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UploadController();
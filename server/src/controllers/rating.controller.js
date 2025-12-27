const ratingService = require('../services/rating.service');

class RatingController {
    // POST /api/ratings - Create or update a rating
    async upsertRating(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { chord_sheet_id, score } = req.body;

            if (!chord_sheet_id || !score) {
                return res.status(400).json({
                    success: false,
                    message: 'chord_sheet_id and score are required'
                });
            }

            const rating = await ratingService.upsertRating(userId, chord_sheet_id, score);

            res.status(200).json({
                success: true,
                message: 'Rating saved successfully',
                data: { rating }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/ratings/chord-sheet/:chordSheetId - Get rating info for a chord sheet
    async getChordSheetRating(req, res, next) {
        try {
            const { chordSheetId } = req.params;
            const rating = await ratingService.getChordSheetRating(chordSheetId);

            // If user is logged in, also get their rating
            let userRating = null;
            if (req.user) {
                userRating = await ratingService.getUserRating(req.user.user_id, chordSheetId);
            }

            res.status(200).json({
                success: true,
                data: {
                    rating,
                    userRating: userRating ? userRating.score : null
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/ratings/chord-sheet/:chordSheetId - Delete user's rating
    async deleteRating(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { chordSheetId } = req.params;

            await ratingService.deleteRating(userId, chordSheetId);

            res.status(200).json({
                success: true,
                message: 'Rating deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RatingController();

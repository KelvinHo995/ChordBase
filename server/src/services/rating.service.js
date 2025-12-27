const { Rating, User, ChordSheet } = require('../models');

class RatingService {
    // Create or update a rating
    async upsertRating(userId, chordSheetId, score) {
        if (score < 1 || score > 5) {
            throw new Error('Score must be between 1 and 5');
        }

        // Check if chord sheet exists
        const chordSheet = await ChordSheet.findByPk(chordSheetId);
        if (!chordSheet) {
            throw new Error('Chord sheet not found');
        }

        // Try to find existing rating
        const existingRating = await Rating.findOne({
            where: {
                user_id: userId,
                chord_sheet_id: chordSheetId
            }
        });

        if (existingRating) {
            // Update existing rating
            existingRating.score = score;
            await existingRating.save();
            return existingRating;
        } else {
            // Create new rating
            const newRating = await Rating.create({
                user_id: userId,
                chord_sheet_id: chordSheetId,
                score
            });
            return newRating;
        }
    }

    // Get user's rating for a specific chord sheet
    async getUserRating(userId, chordSheetId) {
        const rating = await Rating.findOne({
            where: {
                user_id: userId,
                chord_sheet_id: chordSheetId
            }
        });
        return rating;
    }

    // Get average rating for a chord sheet
    async getChordSheetRating(chordSheetId) {
        const ratings = await Rating.findAll({
            where: { chord_sheet_id: chordSheetId },
            attributes: ['score']
        });

        if (ratings.length === 0) {
            return {
                average: 0,
                count: 0
            };
        }

        const sum = ratings.reduce((acc, r) => acc + r.score, 0);
        const average = sum / ratings.length;

        return {
            average: parseFloat(average.toFixed(2)),
            count: ratings.length
        };
    }

    // Delete a rating
    async deleteRating(userId, chordSheetId) {
        const rating = await Rating.findOne({
            where: {
                user_id: userId,
                chord_sheet_id: chordSheetId
            }
        });

        if (!rating) {
            throw new Error('Rating not found');
        }

        await rating.destroy();
        return { message: 'Rating deleted successfully' };
    }
}

module.exports = new RatingService();

// server/src/controllers/search.controller.js
const songService = require('../services/song.service');

class SongController {
    // GET /api/search?q=shape&type=song&page=1&limit=20
    async search(req, res) {
        try {
            const {
                q: query,
                type = 'all',
                genre_id,
                page = 1,
                limit = 20,
                sort_by = 'relevance'
            } = req.query;

            if (!query && type !== 'genre') {
                return res.status(400).json({
                    success: false,
                    message: 'Query parameter "q" is required'
                });
            }

            const result = await songService.search(query, {
                page: parseInt(page),
                limit: parseInt(limit),
                search_type: type,
                genre_id: genre_id ? parseInt(genre_id) : null,
                sort_by
            });

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/search/songs/:song_id
    async getSong(req, res) {
        try {
            const { song_id } = req.params;
            const song = await songService.getSongById(song_id);

            res.status(200).json({
                success: true,
                data: { song }
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/search/chords?chords=C,Am,F,G
    async searchByChords(req, res) {
        try {
            const { chords } = req.query;

            if (!chords) {
                return res.status(400).json({
                    success: false,
                    message: 'Query parameter "chords" is required'
                });
            }

            const chordArray = chords.split(',').map(c => c.trim());
            const result = await songService.searchByChords(chordArray, {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20
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

    // GET /api/search/popular
    async getPopular(req, res) {
        console.log('Fetching popular songs');
        try {
            const limit = parseInt(req.query.limit) || 10;
            const songs = await songService.getPopularSongs(limit);

            res.status(200).json({
                success: true,
                data: songs 
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/search/pending
    async getPending(req, res) {
        console.log('Fetching pending songs');
        try {
            const songs = await songService.getPendingSongs();
            
            res.status(200).json({
                success: true,
                data: songs 
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/search/pending/approve/:song_id
    async approveSong(req, res) {
        console.log('Approving song:', req.params.chord_sheet_id);
        try {
            const { chord_sheet_id } = req.params;
            await songService.approveSong(chord_sheet_id);
            res.status(200).json({
                success: true,
                message: 'Song approved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async rejectSong(req, res) {
        console.log('Rejecting song:', req.params.chord_sheet_id);
        try {
            const { chord_sheet_id } = req.params;
            await songService.rejectSong(chord_sheet_id);
            res.status(200).json({
                success: true,
                message: 'Song rejected successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SongController();
const playlistService = require('../services/playlist.service');

class PlaylistController {
    // GET /api/playlists
    async getAllPlaylists(req, res) {
        try {
            const user_id = req.user.user_id;
            const playlists = await playlistService.getAllPlaylists(user_id);
            res.status(200).json({
                success: true,
                data: playlists
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/playlists
    async createPlaylist(req, res) {
        try {
            const user_id = req.user.user_id;
            const { name } = req.body;
            const playlist = await playlistService.createPlaylist(user_id, name);
            res.status(201).json({
                success: true,
                data: playlist
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/playlists/:id
    async getPlaylistById(req, res) {
        try {
            const playlist_id = req.params.id;
            const playlist = await playlistService.getPlaylistById(playlist_id);
            if (!playlist) {
                return res.status(404).json({
                    success: false,
                    message: 'Playlist not found'
                });
            }
            res.status(200).json({
                success: true,
                data: playlist
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/playlists/:id
    async deletePlaylist(req, res) {
        try {
            const playlist_id = req.params.id;
            await playlistService.deletePlaylist(playlist_id);
            res.status(200).json({
                success: true,
                message: 'Playlist deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/playlists/:id/songs
    async addSongToPlaylist(req, res) {
        try {
            const playlist_id = req.params.id;
            const { song_id } = req.body;
            await playlistService.addSongToPlaylist(playlist_id, song_id);
            res.status(200).json({
                success: true,
                message: 'Song added to playlist'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/playlists/:id/songs/:songId
    async removeSongFromPlaylist(req, res) {
        try {
            const playlist_id = req.params.id;
            const song_id = req.params.songId;
            await playlistService.removeSongFromPlaylist(playlist_id, song_id);
            res.status(200).json({
                success: true,
                message: 'Song removed from playlist'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/playlists/favorites
    async getFavoriteSongs(req, res) {
        console.log("Fetching favorite songs for user:", req.user);
        try {
            const user_id = req.user.user_id;
            const songs = await playlistService.getFavoriteSongsByUserId(user_id);
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
}

module.exports = new PlaylistController();
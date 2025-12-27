const { Song, Artist, Genre, ChordSheet, User, SongArtist, Favorite, Playlist, PlaylistSong, SongView } = require('../models');
const { Op, fn, col, literal, where } = require('sequelize');
const { sequelize } = require('../config/db');

class PlaylistService {
    // Get all playlists
    async getAllPlaylists(user_id) {
        const playlists = await Playlist.findAll({
            where: { owner_id: user_id, is_deleted: false },
            include: [
                {
                    model: PlaylistSong,
                    as: 'playlist_songs',
                    include: [
                        {
                            model: Song,
                            as: 'song',
                            attributes: ['song_id', 'title'],
                            include: [
                                { model: Artist, as: 'artists', attributes: ['name'] }
                            ]
                        }
                    ]
                }
            ]
        });

        return playlists.map(p => {
            const plain = p.get({ plain: true });
            plain.id = plain.playlist_id; // Map playlist_id to id
            plain.songs = plain.playlist_songs.map(ps => ({
                id: ps.song.song_id,
                title: ps.song.title,
                artist: ps.song.artists.map(a => a.name).join(', ')
            }));
            delete plain.playlist_songs;
            return plain;
        });
    }

    async createPlaylist(user_id, name) {
        const playlist = await Playlist.create({
            owner_id: user_id,
            name: name
        });
        // Return structure matching getAllPlaylists
        const plain = playlist.get({ plain: true });
        plain.id = plain.playlist_id;
        plain.songs = [];
        return plain;
    }

    async getPlaylistById(playlist_id) {
        const playlist = await Playlist.findOne({
            where: { playlist_id, is_deleted: false },
            include: [
                {
                    model: PlaylistSong,
                    as: 'playlist_songs',
                    include: [
                        {
                            model: Song,
                            as: 'song',
                            include: [
                                { model: Artist, as: 'artists', attributes: ['name'] }
                            ]
                        }
                    ]
                }
            ]
        });
        
        if (!playlist) return null;

        const plain = playlist.get({ plain: true });
        plain.id = plain.playlist_id;
        plain.songs = plain.playlist_songs.map(ps => ({
            id: ps.song.song_id,
            title: ps.song.title,
            artist: ps.song.artists.map(a => a.name).join(', ')
        }));
        delete plain.playlist_songs;
        return plain;
    }

    async deletePlaylist(playlist_id) {
        await Playlist.update({ is_deleted: true }, {
            where: { playlist_id }
        });
    }

    async addSongToPlaylist(playlist_id, song_id) {
        // Check if already exists
        const existing = await PlaylistSong.findOne({
            where: { playlist_id, song_id }
        });
        if (existing) return;

        await PlaylistSong.create({
            playlist_id,
            song_id
        });
    }

    async removeSongFromPlaylist(playlist_id, song_id) {
        await PlaylistSong.destroy({
            where: {
                playlist_id,
                song_id
            }
        });
    }

    async addFavoriteSong(user_id, song_id) {
        const existing = await Favorite.findOne({ where: { user_id, song_id } });
        if (existing) return existing;
        return Favorite.create({ user_id, song_id });
    }

    async removeFavoriteSong(user_id, song_id) {
        await Favorite.destroy({ where: { user_id, song_id } });
    }

    // Define playlist-related service methods here
    async getFavoriteSongsByUserId(user_id) {
        const favorite_songs = await Favorite.findAll({
            where: { user_id },
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        { model: Artist, as: 'artists' },
                        { model: Genre, as: 'genre' }
                    ]
                }
            ]
        });
        return favorite_songs;
    }
}

module.exports = new PlaylistService();
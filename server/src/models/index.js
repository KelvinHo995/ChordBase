// server/src/models/index.js
const Song = require('./songs.model');
const Artist = require('./artist.model');
const Genre = require('./genre.model');
const ChordSheet = require('./chordSheet.model');
const User = require('./user.model');
const SongView = require('./songView.model');
const SongArtist = require('./song_artist.model');
const Favorite = require('./favorite.model');
const PlaylistSong = require('./playlist_song.model');
const Playlist = require('./playlist.model');
const { sequelize } = require('../config/db');

// ===== RELATIONSHIPS =====

// Song - Genre (Many to One)
Song.belongsTo(Genre, { foreignKey: 'genre_id', as: 'genre' });
Genre.hasMany(Song, { foreignKey: 'genre_id', as: 'songs' });

// Song - Artist (Many to Many)
Song.belongsToMany(Artist, { 
    through: SongArtist, 
    foreignKey: 'song_id',
    otherKey: 'artist_id',
    as: 'artists'
});
Artist.belongsToMany(Song, { 
    through: SongArtist, 
    foreignKey: 'artist_id',
    otherKey: 'song_id',
    as: 'songs'
});

// Song - SongArtist (One to Many)
Song.hasMany(SongArtist, { foreignKey: 'song_id', as: 'song_artists' });
SongArtist.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });

// Artist - SongArtist (One to Many)
Artist.hasMany(SongArtist, { foreignKey: 'artist_id', as: 'song_artists' });
SongArtist.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

// Song - ChordSheet (One to Many)
Song.hasMany(ChordSheet, { foreignKey: 'song_id', as: 'chord_sheets' });
ChordSheet.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });

// ChordSheet - User (Uploader)
ChordSheet.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' });
User.hasMany(ChordSheet, { foreignKey: 'uploader_id', as: 'uploaded_sheets' });

// Song - SongView (One to Many)
Song.hasMany(SongView, { foreignKey: 'song_id', as: 'views' });
SongView.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });

// Favorite - User (Many to One)
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });

// Favorite - Song (Many to One)
Favorite.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });
Song.hasMany(Favorite, { foreignKey: 'song_id', as: 'favorited_by' });

// PlaylistSong - Playlist (Many to One)
PlaylistSong.belongsTo(Playlist, { foreignKey: 'playlist_id', as: 'playlist' });
Playlist.hasMany(PlaylistSong, { foreignKey: 'playlist_id', as: 'playlist_songs' });

// PlaylistSong - Song (Many to One)
PlaylistSong.belongsTo(Song, { foreignKey: 'song_id', as: 'song' });
Song.hasMany(PlaylistSong, { foreignKey: 'song_id', as: 'in_playlists' });

module.exports = {
    Song,
    Artist,
    Genre,
    ChordSheet,
    User,
    SongView,
    SongArtist,
    Favorite,
    PlaylistSong,
    Playlist,
    sequelize
};
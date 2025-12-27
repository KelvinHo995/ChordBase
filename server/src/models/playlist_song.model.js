const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PlaylistSong = sequelize.define('PlaylistSong', {
    playlist_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'playlists',
            key: 'playlist_id'
        }
    },
    song_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
            model: 'songs',
            key: 'song_id'
        }
    },
    added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'playlist_songs',
    timestamps: false
});

module.exports = PlaylistSong;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SongArtist = sequelize.define('SongArtist', {
    song_id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    artist_id: {
        type: DataTypes.BIGINT, 
        primaryKey: true
    }
}, {
    tableName: 'song_artists',
    timestamps: false
});

module.exports = SongArtist;
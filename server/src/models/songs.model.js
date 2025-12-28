// server/src/models/song.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Song = sequelize.define('Song', {
    song_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    genre_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'genres',
            key: 'genre_id'
        }
    },
    duration_sec: {
        type: DataTypes.INTEGER
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted_at: {
        type: DataTypes.DATE
    },
    difficulty: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
        defaultValue: 'Beginner'
    }
}, {
    tableName: 'songs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Song;
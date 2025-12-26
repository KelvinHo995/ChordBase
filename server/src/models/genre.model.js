// server/src/models/genre.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Genre = sequelize.define('Genre', {
    genre_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'genres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Genre;
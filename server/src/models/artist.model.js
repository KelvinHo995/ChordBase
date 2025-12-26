// server/src/models/artist.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Artist = sequelize.define('Artist', {
    artist_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'artists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Artist;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Playlist = sequelize.define('Playlist', {
    playlist_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
    tableName: 'playlists',
    timestamps: false
});

module.exports = Playlist;
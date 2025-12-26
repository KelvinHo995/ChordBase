// server/src/models/songView.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SongView = sequelize.define('SongView', {
    song_view_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    song_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'songs',
            key: 'song_id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    viewed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    source: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'song_views',
    timestamps: false
});

module.exports = SongView;
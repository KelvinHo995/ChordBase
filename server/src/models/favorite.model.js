const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Favorite = sequelize.define('Favorite', {
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    song_id: {
        type: DataTypes.BIGINT, 
        primaryKey: true
    },
}, {
    tableName: 'favorite_songs',
    timestamps: false
});

module.exports = Favorite;
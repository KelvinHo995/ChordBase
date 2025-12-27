const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Rating = sequelize.define('Rating', {
    rating_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    chord_sheet_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'chord_sheets',
            key: 'chord_sheet_id'
        }
    },
    score: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ratings',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'chord_sheet_id']
        }
    ]
});

module.exports = Rating;

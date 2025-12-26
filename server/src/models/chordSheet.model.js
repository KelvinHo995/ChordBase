// server/src/models/chordSheet.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChordSheet = sequelize.define('ChordSheet', {
    chord_sheet_id: {
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
    uploader_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    original_key: {
        type: DataTypes.STRING(20)
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'approved', 'rejected']]
        }
    },
    is_canonical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ai_generated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    approved_at: {
        type: DataTypes.DATE
    },
    approved_by: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'user_id'
        }
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
    tableName: 'chord_sheets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ChordSheet;
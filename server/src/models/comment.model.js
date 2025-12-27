// server/src/models/comment.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    chord_sheet_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'chord_sheets',
            key: 'chord_sheet_id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parent_comment_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'comments',
            key: 'comment_id'
        }
    },
    depth: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },
    thread_root_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'comments',
            key: 'comment_id'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Comment;

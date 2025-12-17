// server/src/models/passwordReset.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const crypto = require('crypto');

const PasswordReset = sequelize.define('PasswordReset', {
    reset_id: {
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
    reset_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'password_resets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Generate secure random token
PasswordReset.generateToken = function() {
    return crypto.randomBytes(32).toString('hex');
};

// Check if token is valid
PasswordReset.prototype.isValid = function() {
    return !this.used && new Date() < this.expires_at;
};

module.exports = PasswordReset;


// export const UserModel = {
    
// }
// server/src/models/user.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: true  // Nullable for Google OAuth users
    },
    google_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    display_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']]
        }
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'inactive', 'suspended', 'locked']]
        }
    },
    preferences: {
        type: DataTypes.JSONB,
        defaultValue: {
            default_instrument: 'guitar',
            default_capo: 0,
            scroll_speed: 50
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password_hash) {
                user.password_hash = await bcrypt.hash(user.password_hash, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password_hash')) {
                user.password_hash = await bcrypt.hash(user.password_hash, 10);
            }
        }
    }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
    if (!this.password_hash) return false;
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
};

// Class methods
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email, is_deleted: false } });
};

User.findByGoogleId = async function(googleId) {
    return await this.findOne({ where: { google_id: googleId, is_deleted: false } });
};

User.findOrCreateFromGoogle = async function(profile) {
    const email = profile.emails[0].value;
    let user = await this.findByGoogleId(profile.id);
    
    if (!user) {
        user = await this.findByEmail(email);
        if (user) {
            // Link existing account to Google
            user.google_id = profile.id;
            await user.save();
        } else {
            // Create new user
            user = await this.create({
                email: email,
                google_id: profile.id,
                display_name: profile.displayName || email.split('@')[0],
                role: 'user',
                status: 'active'
            });
        }
    }
    
    return user;
};

module.exports = User;
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email, is_deleted: false } });
};

module.exports = User;
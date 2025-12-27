// Service -> model
// const UserModel = require('../models/user.model')

// export const UserService = {
    
// }

// server/src/services/user.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserService {
    // Get user by ID
    async getUserById(userId) {
        const user = await User.findByPk(userId);
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }
        return user.toJSON();
    }

    // Get user profile (public info)
    async getUserProfile(userId) {
        const user = await User.findByPk(userId, {
            attributes: ['user_id', 'email', 'display_name', 'role', 'created_at']
        });
        
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }
        
        return user;
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        const user = await User.findByPk(userId);
        
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }

        // Only allow updating certain fields
        const allowedFields = ['display_name', 'preferences'];
        const updates = {};
        
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updates[field] = updateData[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            throw new Error('No valid fields to update');
        }

        await user.update(updates);
        return user.toJSON();
    }

    // Change password (when user is logged in)
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findByPk(userId);
        
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        user.password_hash = newPassword;
        await user.save();

        return { message: 'Password changed successfully' };
    }

    // Update user preferences
    async updatePreferences(userId, preferences) {
        const user = await User.findByPk(userId);
        
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }

        // Merge with existing preferences
        const updatedPreferences = {
            ...user.preferences,
            ...preferences
        };

        user.preferences = updatedPreferences;
        await user.save();

        return user.toJSON();
    }

    // Soft delete user account
    async deleteAccount(userId, password) {
        const user = await User.findByPk(userId);
        
        if (!user || user.is_deleted) {
            throw new Error('User not found');
        }

        // Verify password before deletion
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Password is incorrect');
        }

        // Soft delete
        user.is_deleted = true;
        user.deleted_at = new Date();
        user.status = 'inactive';
        await user.save();

        return { message: 'Account deleted successfully' };
    }

    // ====== ADMIN ONLY METHODS ======

    // Get all users (admin)
    async getAllUsers(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        
        const where = { is_deleted: false };
        
        // Apply filters
        if (filters.role) where.role = filters.role;
        if (filters.status) where.status = filters.status;
        if (filters.search) {
            where[Op.or] = [
                { email: { [Op.iLike]: `%${filters.search}%` } },
                { display_name: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password_hash'] }
        });

        return {
            users: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    // Update user status (admin)
    async updateUserStatus(userId, status) {
        const user = await User.findByPk(userId);
        console.log("Found user:", user);        
        if (!user) {
            throw new Error('User not found');
        }

        const validStatuses = ['active', 'locked'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }
        user.status = status;
        try {
            await user.save();
        } catch (err) {
            console.error("Error saving user status:", err);
            throw new Error('Failed to update user status');
        }

        return user.toJSON();
    }

    // Update user role (admin)
    async updateUserRole(userId, role) {
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role');
        }

        user.role = role;
        await user.save();

        return user.toJSON();
    }

    // Hard delete user (admin only - permanent)
    async hardDeleteUser(userId) {
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();
        return { message: 'User permanently deleted' };
    }
}

module.exports = new UserService();
//Controller -> Service
// import { UserService } from "../services/user.service"

// export const UserController = {

// }

// server/src/controllers/user.controller.js
const userService = require('../services/user.service');

class UserController {
    // GET /api/users/profile/:userId
    async getUserProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await userService.getUserProfile(userId);

            res.status(200).json({
                success: true,
                data: { user }
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/users/me (get current logged-in user)
    async getMyProfile(req, res) {
        try {
            const user = await userService.getUserById(req.user.user_id);

            res.status(200).json({
                success: true,
                data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/users/profile
    async updateProfile(req, res) {
        try {
            const userId = req.user.user_id;
            const { display_name, bio, preferences } = req.body;

            const user = await userService.updateProfile(userId, {
                display_name,
                bio,
                preferences
            });

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/users/change-password
    async changePassword(req, res) {
        try {
            const userId = req.user.user_id;
            const { current_password, new_password } = req.body;

            if (!current_password || !new_password) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            if (new_password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters'
                });
            }

            const result = await userService.changePassword(
                userId,
                current_password,
                new_password
            );

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/users/preferences
    async updatePreferences(req, res) {
        try {
            const userId = req.user.user_id;
            const preferences = req.body;

            const user = await userService.updatePreferences(userId, preferences);

            res.status(200).json({
                success: true,
                message: 'Preferences updated successfully',
                data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/users/account
    async deleteAccount(req, res) {
        try {
            const userId = req.user.user_id;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password is required to delete account'
                });
            }

            const result = await userService.deleteAccount(userId, password);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ====== ADMIN ROUTES ======

    // GET /api/users (admin)
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                role: req.query.role,
                status: req.query.status,
                search: req.query.search
            };

            const result = await userService.getAllUsers(page, limit, filters);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/users/:userId/status (admin)
    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const user = await userService.updateUserStatus(userId, status);

            res.status(200).json({
                success: true,
                message: 'User status updated successfully',
                data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /api/users/:userId/role (admin)
    async updateUserRole(req, res) {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'Role is required'
                });
            }

            const user = await userService.updateUserRole(userId, role);

            res.status(200).json({
                success: true,
                message: 'User role updated successfully',
                data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /api/users/:userId (admin - hard delete)
    async hardDeleteUser(req, res) {
        try {
            const { userId } = req.params;
            const result = await userService.hardDeleteUser(userId);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
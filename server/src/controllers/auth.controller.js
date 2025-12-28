// server/src/controllers/auth.controller.js
const authService = require('../services/auth.service');

class AuthController {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const { email, password, display_name } = req.body;

            // Validation
            if (!email || !password || !display_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password, and display name are required'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
            }

            const result = await authService.register({
                email,
                password,
                display_name
            });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            const result = await authService.login(email, password);
            console.log('Login successful for user:', result.user.email);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            console.log('Login error:', error.message);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/auth/forgot-password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const result = await authService.requestPasswordReset(email);

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

    // POST /api/auth/reset-password
    async resetPassword(req, res) {
        try {
            const { reset_token, new_password } = req.body;

            if (!reset_token || !new_password) {
                return res.status(400).json({
                    success: false,
                    message: 'Reset token and new password are required'
                });
            }

            if (new_password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
            }

            const result = await authService.resetPassword(reset_token, new_password);

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

    // GET /api/auth/me
    async getCurrentUser(req, res) {
        try {
            res.status(200).json({
                success: true,
                data: {
                    user: req.user.toJSON()
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // POST /api/auth/logout
    async logout(req, res) {
        // With JWT, logout is handled on client side by removing token
        // Optionally implement token blacklist here
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }

    // POST /api/auth/google/token
    async googleTokenLogin(req, res) {
        try {
            const { access_token } = req.body;

            if (!access_token) {
                return res.status(400).json({
                    success: false,
                    message: 'Access token is required'
                });
            }

            const result = await authService.loginWithGoogle(access_token);
            
            res.status(200).json({
                success: true,
                message: 'Google login successful',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            console.error('Google token login error:', error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
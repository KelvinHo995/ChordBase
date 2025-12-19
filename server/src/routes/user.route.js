// Routes -> Middleware (optional, for example auth to make sure certain actions are for qualified accounts) -> Controller
// import { Router } from "express";
// import { UserController } from "../controllers/user.controller";
// const userRouter = Router();

// export default userRouter;

// server/src/routes/user.route.js
const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// ====== USER ROUTES (Protected - require login) ======

// Get current user's full profile
router.get('/me', userController.getMyProfile);
// Get public profile of any user
router.get('/profile/:userId', userController.getUserProfile);
// Update current user's profile
router.put('/profile', protect, userController.updateProfile);
// Change password (when logged in)
router.post('/change-password', protect, userController.changePassword);
// Update preferences
router.put('/preferences', protect, userController.updatePreferences);
// Delete own account (soft delete)
router.delete('/account', protect, userController.deleteAccount);

// ====== ADMIN ROUTES (require admin role) ======
// Get all users with pagination and filters
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);
// Update user status (active/inactive/suspended)
router.put('/:userId/status', protect, restrictTo('admin'), userController.updateUserStatus);
// Update user role (user/admin)
router.put('/:userId/role', protect, restrictTo('admin'), userController.updateUserRole);
// Hard delete user (permanent deletion)
router.delete('/:userId', protect, restrictTo('admin'), userController.hardDeleteUser);

module.exports = router;

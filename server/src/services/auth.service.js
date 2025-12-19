// server/src/services/auth.service.js
const User = require('../models/user.model');
const PasswordReset = require('../models/passwordReset.model');
const jwt = require('jsonwebtoken');
const { vars } = require('../config');
const { sendEmail } = require('../utils/email');

class AuthService {
    // Register new user
    async register(userData) {
        const { email, password, display_name } = userData;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const user = await User.create({
            email,
            password_hash: password,
            display_name,
            role: 'user',
            status: 'active'
        });

        // Generate token
        const token = this.generateToken(user);

        return {
            user: user.toJSON(),
            token
        };
    }

    // Login user
    async login(email, password) {
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if account is active
        if (user.status !== 'active') {
            throw new Error('Account is not active');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            user: user.toJSON(),
            token
        };
    }

    // Request password reset
    async requestPasswordReset(email) {
        // 1. Tìm user theo email
        const user = await User.findByEmail(email);
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return { message: 'If email exists, reset link will be sent' };
        }

        // 2. Generate reset token 
        const resetToken = PasswordReset.generateToken();
        // 3. Tính thời gian hết hạn (1 giờ)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // 4. Save reset token into Database
        await PasswordReset.create({
            user_id: user.user_id,
            reset_token: resetToken,
            expires_at: expiresAt
        });

        // TODO: Send email with reset link
        // 5. Gửi email (TODO - chưa implement)
        // 5. Gửi email reset password
        const resetLink = `${vars.frontendUrl}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'ChordBase - Reset Password',
            html: `
                <p>Xin chào ${user.display_name || ''},</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
                <p>Click vào link bên dưới để đặt lại mật khẩu:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Link này sẽ hết hạn sau 1 giờ.</p>
                <br />
                <p>— ChordBase Team</p>
            `
        });


        // For now, return token (in production, only send via email)
        // 6. Trả về (trong dev mode, trả về token để test)
        return {
            message: 'Password reset link sent to email',
            // Remove this in production
            // reset_token: resetToken
        };
    }

    // Reset password with token
    async resetPassword(resetToken, newPassword) {
        //1.Find valid reset token in database
        const passwordReset = await PasswordReset.findOne({
            where: { reset_token: resetToken }
        });

        if (!passwordReset) {
            throw new Error('Invalid or expired reset token');
        }

        // 2. Kiểm tra token còn hợp lệ không?
        if (!passwordReset.isValid()) {
            throw new Error('Reset token has expired or already been used');
            // Logic:
            // - Chưa được sử dụng (used === false)
            // - Chưa hết hạn (expires_at > NOW())
        }

        // Update user password
        const user = await User.findByPk(passwordReset.user_id);
        if (!user) {
            throw new Error('User not found');
        }

        // 4. Update password mới
        user.password_hash = newPassword;
        await user.save();

        // Mark token as used
        passwordReset.used = true;
        await passwordReset.save();

        return { message: 'Password reset successfully' };
    }

    // Verify token
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, vars.jwtSecret);
            const user = await User.findByPk(decoded.userId);
            
            if (!user || user.is_deleted) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Generate JWT token
    generateToken(user) {
        return jwt.sign(
            {
                userId: user.user_id,
                email: user.email,
                role: user.role
            },
            vars.jwtSecret,
            {
                expiresIn: `${vars.jwtExpirationMinutes}m`
            }
        );
    }
}

module.exports = new AuthService();
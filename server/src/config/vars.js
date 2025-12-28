// config/vars.js
require('dotenv').config(); 

module.exports = {
    // Basic info
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,

    // ===== DATABASE CONFIGURATION =====
    dbUser: process.env.DB_USER || 'postgres',
    dbPass: process.env.DB_PASS || 'thanhdat8328',
    dbName: process.env.DB_NAME || 'chordbase',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT, 10) || 5432,

    // Database sync (CHỈ dùng trong development nếu cần)
    autoSync: process.env.DB_AUTO_SYNC === 'true' || false,
    
    // ===== JWT CONFIGURATION =====
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10) || 60,
    jwtRefreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10) || 30,
    
    // ===== CORS CONFIGURATION =====
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // ===== EMAIL CONFIGURATION (cho password reset) =====
    mailHost: process.env.MAIL_HOST || 'smtp.gmail.com',
    mailPort: parseInt(process.env.MAIL_PORT, 10) || 587,
    mailUser: process.env.MAIL_USER || '',
    mailPass: process.env.MAIL_PASS || '',
    mailFrom: process.env.MAIL_FROM || 'noreply@chordbase.com',
    
    // ===== FILE UPLOAD CONFIGURATION =====
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    
    // ===== RATE LIMITING =====
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    
    // ===== PAGINATION =====
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 20,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100,
    
    // ===== PASSWORD RESET =====
    passwordResetExpireHours: parseInt(process.env.PASSWORD_RESET_EXPIRE_HOURS, 10) || 1,
    
    // ===== FRONTEND URL (cho email links) =====
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // ===== GOOGLE OAUTH CONFIGURATION =====
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    
    // ===== SESSION CONFIGURATION =====
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    
    // ===== LOGGING =====
    logLevel: process.env.LOG_LEVEL || 'info', // error, warn, info, debug
    
    // ===== FEATURE FLAGS =====
    enableSwagger: process.env.ENABLE_SWAGGER === 'true' || false,
    enableMetrics: process.env.ENABLE_METRICS === 'true' || false,
};
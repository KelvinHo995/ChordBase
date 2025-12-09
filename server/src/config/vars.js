// config/vars.js
require('dotenv').config(); 

module.exports = {
    // Basic info
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    // PostgreSQL
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 5432,
    
    // Security
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
};
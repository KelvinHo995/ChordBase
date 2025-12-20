// server/src/server.js
// PHIÊN BẢN HOÀN CHỈNH - Bao gồm tất cả routes

const express = require('express');
const cors = require('cors');
const { vars, dbConnect } = require('./config');

// ===================================
// IMPORT ROUTES
// ===================================

// Authentication routes
const authRoutes = require('./routes/auth.route');

// User management routes
const userRoutes = require('./routes/user.route');

// Search routes (Songs, Artists, Chords)
const searchRoutes = require('./routes/search.route');

// ===================================
// INITIALIZE EXPRESS APP
// ===================================

const app = express();

// ===================================
// MIDDLEWARES
// ===================================

// CORS - Allow cross-origin requests
app.use(cors({
    origin: vars.corsOrigin || 'http://localhost:5173',
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (vars.env === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ===================================
// API ROUTES
// ===================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        environment: vars.env,
        timestamp: new Date().toISOString()
    });
});

// Database health check
app.get('/health/db', async (req, res) => {
    try {
        const { testQuery } = require('./config/db');
        const isDbOk = await testQuery();
        
        res.status(200).json({
            status: 'OK',
            database: isDbOk ? 'Connected' : 'Error',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// API version info
app.get('/api', (req, res) => {
    res.status(200).json({
        name: 'ChordBase API',
        version: '1.0.0',
        description: 'Backend API for ChordBase - Chord sheets and song database',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            search: '/api/search'
        },
        documentation: '/api/docs' // TODO: Add Swagger
    });
});

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

// ===================================
// ERROR HANDLERS
// ===================================

// 404 Handler - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    // Log error
    console.error('=== ERROR ===');
    console.error('Time:', new Date().toISOString());
    console.error('Path:', req.path);
    console.error('Method:', req.method);
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    console.error('=============');

    // Send error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(vars.env === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
});

// ===================================
// GRACEFUL SHUTDOWN HANDLERS
// ===================================

const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    try {
        // Close database connections
        const { disconnect } = require('./config/db');
        await disconnect();
        
        console.log('✅ Database connections closed');
        console.log('✅ Server shutdown complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

// ===================================
// START SERVER
// ===================================

const startServer = async () => {
    try {
        console.log('🚀 Starting ChordBase Server...');
        console.log('================================');
        
        // Connect to database
        console.log('📊 Connecting to database...');
        await dbConnect();
        
        // Start listening
        app.listen(vars.port, () => {
            console.log('================================');
            console.log('✅ Server Status:');
            console.log(`   - Environment: ${vars.env}`);
            console.log(`   - Port: ${vars.port}`);
            console.log(`   - URL: http://localhost:${vars.port}`);
            console.log(`   - Health: http://localhost:${vars.port}/health`);
            console.log(`   - DB Health: http://localhost:${vars.port}/health/db`);
            console.log('================================');
            console.log('📚 Available Routes:');
            console.log(`   - Auth: http://localhost:${vars.port}/api/auth`);
            console.log(`   - Users: http://localhost:${vars.port}/api/users`);
            console.log(`   - Search: http://localhost:${vars.port}/api/search`);
            console.log('================================');
            console.log('✅ Server is ready to accept connections!');
            console.log('Press CTRL+C to stop\n');
        });
        
    } catch (error) {
        console.error('================================');
        console.error('❌ Failed to start server');
        console.error('================================');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('================================');
        process.exit(1);
    }
};

// Start the server
startServer();

// Export app for testing
module.exports = app;
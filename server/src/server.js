// server/src/server.js
const express = require('express');
const cors = require('cors');
const { vars, dbConnect } = require('./config');

// Import routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');  
const songRoutes = require('./routes/song.route'); // ← THÊM MỚI
const commentRoutes = require('./routes/comment.route');
const ratingRoutes = require('./routes/rating.route');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/songs', songRoutes); 
app.use('/api/comments', commentRoutes); 
app.use('/api/ratings', ratingRoutes); 

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        environment: vars.env,
        timestamp: new Date().toISOString()
    });
});



// Start server
const startServer = async () => {
    try {
        console.log('Starting ChordBase Server...');
        console.log('================================');
        
        // Connect to database
        console.log('Connecting to database...');
        await dbConnect();
        
        // Start listening
        app.listen(vars.port, () => {
            console.log(`🚀 Server running on port ${vars.port}`);
            console.log(`📍 Environment: ${vars.env}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path, 
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

module.exports = app;
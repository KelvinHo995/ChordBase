// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { userRouter } from './routes/user.route';

// dotenv.config()

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/users', userRouter);
// app.use('/api/auth', Router); // Assuming auth routes are also in userRouter for this example
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

// server/src/server.js
const express = require('express');
const cors = require('cors');
const { vars, dbConnect } = require('./config');

// Import routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');  // ← THÊM MỚI

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // ← THÊM MỚI

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        environment: vars.env
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
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

// Start server
const startServer = async () => {
    try {
        // Connect to database
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

module.exports = app;
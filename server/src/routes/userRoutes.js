// Routes -> Middleware (optional, for example auth to make sure certain actions are for qualified accounts) -> Controller
const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

module.exports = router
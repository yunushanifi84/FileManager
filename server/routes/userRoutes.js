const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Kullanıcı kaydı
router.post('/register', userController.register);

// Kullanıcı girişi
router.post('/login', userController.login);

// Kullanıcı profili (korumalı route)
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router; 
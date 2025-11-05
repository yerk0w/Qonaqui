/* eslint-env node */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // 1. Импортируем middleware

// @route   POST /api/auth/register
router.post('/register', authController.register);

// @route   POST /api/auth/login
router.post('/login', authController.login);

// @route   GET /api/auth/profile
// @desc    Получить данные пользователя (Защищенный маршрут)
// 2. Добавляем middleware вторым аргументом
// Теперь доступ к authController.getProfile будет только если authMiddleware скажет "OK"
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
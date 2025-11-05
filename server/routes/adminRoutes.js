/* eslint-env node */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Мы защищаем *все* админ-маршруты двумя middleware:
// 1. authMiddleware - проверяет, что пользователь вошел
// 2. adminMiddleware - проверяет, что он админ
const adminOnly = [authMiddleware, adminMiddleware];

// @route   GET /api/admin/users
// @desc    Получить всех пользователей
router.get('/users', adminOnly, adminController.getAllUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Удалить пользователя
router.delete('/users/:id', adminOnly, adminController.deleteUser);

module.exports = router;
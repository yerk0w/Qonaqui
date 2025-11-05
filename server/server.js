/* eslint-env node */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Эта строка загружает ваш .env файл

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes'); // Подключаем маршруты

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Успешное подключение к MongoDB Atlas'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('api/admin', adminRoutes) // Все запросы на /api/auth будут идти в authRoutes

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});
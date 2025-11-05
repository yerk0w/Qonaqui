/* eslint-env node */

const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    // Мы предполагаем, что этот middleware запускается ПОСЛЕ authMiddleware,
    // поэтому у нас уже есть req.userId
    const user = await User.findById(req.userId);

    if (user && user.role === 'admin') {
      next(); // Все в порядке, пользователь - админ
    } else {
      res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при проверке прав' });
  }
};
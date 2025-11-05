/* eslint-env node */

const User = require('../models/User');

// Получить всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Найти всех, убрав пароли
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
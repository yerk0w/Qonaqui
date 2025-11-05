/* eslint-env node */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Контроллер для РЕГИСТРАЦИИ
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: 'Пользователь успешно зарегистрирован' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
};

// Контроллер для ВХОДА (ЛОГИНА)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверные данные для входа' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные данные для входа' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Успешный вход в систему' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
};

// Контроллер для ПОЛУЧЕНИЯ ПРОФИЛЯ
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
};
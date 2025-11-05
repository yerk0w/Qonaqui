/* eslint-env node */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Получаем токен из заголовка
  const authHeader = req.header('Authorization');

  // 2. Проверяем, есть ли токен
  if (!authHeader) {
    return res.status(401).json({ message: 'Нет токена, доступ запрещен' });
  }

  // Ожидаем токен в формате "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Неверный формат токена' });
  }

  try {
    // 3. Верифицируем (проверяем) токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Если токен верный, прикрепляем ID пользователя к объекту запроса
    req.userId = decoded.userId;
    next(); // Передаем управление следующему обработчику (нашему контроллеру)
  } catch (error) {
    res.status(401).json({ message: 'Токен недействителен' });
  }
};
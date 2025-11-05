import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Используем бэкенд для загрузки файлов перевода
  .use(initReactI18next) // Передаем i18n экземпляр в react-i18next
  .init({
    supportedLngs: ['ru', 'en', 'kz'], // Список поддерживаемых языков
    fallbackLng: 'ru', // Язык по умолчанию
    debug: true, // Включить логи в консоли для отладки

    // Определяем, где находятся файлы перевода
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // не нужно для React, так как он уже защищает от XSS
    },
  });

export default i18n;
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: 'ᴇɴ' },
  { code: 'kz', name: 'Қазақша', flag: '🇰🇿' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`p-1 rounded-md transition-transform duration-200 ${i18n.language === lang.code ? 'scale-125 ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
          title={lang.name}
        >
          <span className="text-xl">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
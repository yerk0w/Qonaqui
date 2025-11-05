import { Link, useNavigate } from 'react-router-dom';
import { Hotel, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Мы используем navigate('/login') вместо Link
    // чтобы принудительно обновить компонент и шапку
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Hotel className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">QonaqUi</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/rooms" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">{t('header.rooms')}</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">{t('header.about')}</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">{t('header.contact')}</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {/* Динамическое отображение кнопок */}
          {token ? (
            // Если пользователь залогинен
            <>
              <Link to="/profile" className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors font-medium">
                {t('header.profile')}
              </Link>
              <button
                onClick={handleLogout}
                title={t('header.logout')}
                className="border-2 border-red-500 text-red-500 px-3 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            // Если пользователь гость
            <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
              {t('header.login')}
            </Link>
          )}
          
        </div>
      </nav>
    </header>
  );
};

export default Header;
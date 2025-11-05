import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedPage from '../components/AnimatedPage';
import Footer from '../components/Footer';
import { User, Mail, Calendar, LogOut, Loader2, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/auth/profile';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Получаем токен из localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        // Если токена нет, не тратим время и отправляем на логин
        navigate('/login');
        return;
      }

      try {
        // 2. Отправляем запрос с токеном в заголовке
        const res = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- САМОЕ ВАЖНОЕ
          }
        });

        if (!res.ok) {
          // Если токен плохой (просрочен и т.д.)
          throw new Error('Не удалось получить данные. Попробуйте войти снова.');
        }

        const data = await res.json();
        setUserData(data);

      } catch (err) {
        setError(err.message);
        // Если ошибка (например, токен невалидный), удаляем плохой токен
        localStorage.removeItem('token');
        navigate('/login'); // и отправляем на логин
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]); // navigate добавлен как зависимость

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 1. Состояние загрузки
  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-600" size={64} />
        </div>
      </AnimatedPage>
    );
  }
  
  // 2. Состояние ошибки (хотя мы сразу редиректим, но на всякий случай)
  if (error) {
     return (
      <AnimatedPage>
        <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)] text-red-500">
          <AlertTriangle size={64} />
          <p className="mt-4 text-xl">{error}</p>
        </div>
      </AnimatedPage>
    );
  }

  // 3. Успешное состояние
  return (
    <AnimatedPage>
      <div className="bg-white py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">{t('header.profile')}</h1>
            
            {userData && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Имя</span>
                    <p className="text-lg font-semibold text-gray-900">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Дата регистрации</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full mt-10 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-bold text-lg flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              <span>{t('header.logout')}</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </AnimatedPage>
  );
};

export default ProfilePage;
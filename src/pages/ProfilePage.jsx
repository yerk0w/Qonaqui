import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedPage from '../components/AnimatedPage';
import Footer from '../components/Footer';
import { User, Mail, Calendar, LogOut, Loader2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-600" size={64} />
        </div>
      </AnimatedPage>
    );
  }

  if (!user) {
    return null;
  }

  // 3. Успешное состояние
  return (
    <AnimatedPage>
      <div className="bg-white py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">{t('header.profile')}</h1>
            
            {user && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Имя</span>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
                
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                 <Calendar className="text-blue-600" size={24} />
                 <div>
                   <span className="text-sm font-medium text-gray-500">Дата регистрации</span>
                   <p className="text-lg font-semibold text-gray-900">
                     {new Date(user.createdAt).toLocaleDateString()}
                   </p>
                 </div>
               </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Star className="text-blue-600" size={24} />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Бонусные баллы</span>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.loyaltyPoints ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/profile/bookings')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
              >
                Мои бронирования
              </button>
              <button
                onClick={() => navigate('/profile/services')}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg"
              >
                Мои услуги
              </button>
              <button
                onClick={() => navigate('/profile/payments')}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-bold text-lg"
              >
                Платежи
              </button>
              <button
                onClick={() => navigate('/profile/loyalty')}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-bold text-lg"
              >
                Лояльность
              </button>
              <button
                onClick={() => navigate('/profile/reviews')}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-bold text-lg"
              >
                Отзывы
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-bold text-lg flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                <span>{t('header.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AnimatedPage>
  );
};

export default ProfilePage;

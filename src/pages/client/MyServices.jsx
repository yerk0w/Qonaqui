import { useEffect, useState } from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import { servicesService } from '../../services/servicesService';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../context/ServicesContext.jsx';

const statusLabels = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждено',
  COMPLETED: 'Выполнено',
  CANCELLED: 'Отменено',
};

const MyServices = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { services } = useServices();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await servicesService.listMyBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        loadBookings();
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Мои услуги</h1>
            <p className="text-gray-600">Список всех забронированных дополнительных сервисов.</p>
          </header>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          {loading || authLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Вы ещё не бронировали дополнительные услуги.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {services.find((service) => service.id === booking.serviceId)?.name ?? `Услуга ${booking.serviceId}`}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold uppercase rounded-full bg-blue-50 text-blue-600">
                      {statusLabels[booking.status] ?? booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Дата: {booking.date} • Время: {booking.time}
                  </p>
                  {booking.bookingId && (
                    <p className="text-sm text-gray-500">
                      Связано с бронированием номера: {booking.bookingId}
                    </p>
                  )}
                  <p className="text-lg font-bold text-blue-600">
                    {Number(booking.price ?? 0).toLocaleString()} ₸
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MyServices;

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import { useBookings } from '../../context/BookingsContext.jsx';
import { useRooms } from '../../context/RoomsContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { reviewsService } from '../../services/reviewsService';
import ReviewModal from '../../components/ReviewModal.jsx';

const statusLabels = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждено',
  CHECKED_IN: 'Заселено',
  CHECKED_OUT: 'Выселено',
  CANCELLED: 'Отменено',
};

const BookingCard = ({ booking, roomName, hasReview, onReview }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Бронь #{booking.id}</h3>
      <span className="px-2 py-1 text-xs font-semibold uppercase rounded-full bg-blue-50 text-blue-500">
        {statusLabels[booking.status] ?? booking.status}
      </span>
    </div>
    <p className="text-sm text-gray-600">Номер: {roomName}</p>
    <p className="text-sm text-gray-600">
      Даты: {booking.checkInDate} — {booking.checkOutDate}
    </p>
    <p className="text-sm text-gray-600">Гостей: {booking.numberOfGuests}</p>
    <p className="text-sm text-gray-600">Оплата: {booking.paymentStatus}</p>
    <p className="text-lg font-bold text-blue-600">
      {Number(booking.totalPrice ?? 0).toLocaleString()} ₸
    </p>
    {booking.status === 'CHECKED_OUT' && (
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {hasReview ? 'Спасибо за отзыв!' : 'Поделитесь впечатлениями о проживании.'}
        </p>
        <button
          onClick={onReview}
          disabled={hasReview}
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition disabled:opacity-40"
        >
          {hasReview ? 'Отзыв оставлен' : 'Оставить отзыв'}
        </button>
      </div>
    )}
  </div>
);

const MyBookings = () => {
  const { bookings, isLoading, error, loadMyBookings } = useBookings();
  const { rooms } = useRooms();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviewsMap, setReviewsMap] = useState({});
  const [activeBooking, setActiveBooking] = useState(null);

  const roomById = useMemo(() => {
    const map = {};
    rooms.forEach((room) => {
      map[room.id] = room;
    });
    return map;
  }, [rooms]);

  const loadReviews = async () => {
    try {
      const list = await reviewsService.listMine();
      const map = {};
      list.forEach((review) => {
        map[review.bookingId] = review;
      });
      setReviewsMap(map);
    } catch {
      // ignore silently
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        loadMyBookings();
        loadReviews();
      }
    }
  }, [authLoading, isAuthenticated, loadMyBookings, navigate]);

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Мои бронирования</h1>
            <p className="text-gray-600">Отслеживайте активные и прошедшие поездки.</p>
          </header>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          {isLoading || authLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              У вас пока нет активных бронирований.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  roomName={roomById[booking.roomId]?.name ?? booking.roomId}
                  hasReview={Boolean(reviewsMap[booking.id])}
                  onReview={() => setActiveBooking(booking)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        booking={activeBooking}
        roomName={activeBooking ? (roomById[activeBooking.roomId]?.name ?? activeBooking.roomId) : ''}
        onClose={() => setActiveBooking(null)}
        onSubmitted={loadReviews}
      />
    </AnimatedPage>
  );
};

export default MyBookings;

import { useEffect, useState } from 'react';
import { reviewsService } from '../../services/reviewsService';

const statusOptions = [
  { value: 'PENDING', label: 'На модерации' },
  { value: 'APPROVED', label: 'Одобрено' },
  { value: 'REJECTED', label: 'Отклонено' },
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState({});

  const load = async (nextStatus = status) => {
    setLoading(true);
    try {
      const data = await reviewsService.listAll(nextStatus);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moderate = async (id, newStatus) => {
    await reviewsService.moderate(id, {
      status: newStatus,
      responseText: responseText[id],
    });
    setResponseText((prev) => ({ ...prev, [id]: '' }));
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Отзывы гостей</h1>
          <p className="text-gray-600">
            Модерируйте отзывы и оставляйте официальный ответ от имени отеля.
          </p>
        </div>
        <select
          value={status}
          onChange={(event) => {
            const value = event.target.value;
            setStatus(value);
            load(value);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </header>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {review.rating} ★ — {review.userId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Номер: {review.roomId} • Бронь: {review.bookingId}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold uppercase bg-blue-50 text-blue-500 rounded">
                  {review.status}
                </span>
              </div>
              <p className="text-gray-700 italic">"{review.comment}"</p>

              <textarea
                value={responseText[review.id] ?? review.response?.text ?? ''}
                onChange={(event) =>
                  setResponseText((prev) => ({ ...prev, [review.id]: event.target.value }))
                }
                placeholder="Комментарий для ответа гостю (необязательно)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => moderate(review.id, 'APPROVED')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => moderate(review.id, 'REJECTED')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Отзывы не найдены.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

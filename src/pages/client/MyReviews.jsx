import { useEffect, useState } from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import { reviewsService } from '../../services/reviewsService';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const statusLabels = {
  PENDING: 'На модерации',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
};

const MyReviews = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewsService.listMine();
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
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        loadReviews();
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Мои отзывы</h1>
            <p className="text-gray-600">Следите за статусом отзывов и ответами администрации.</p>
          </header>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          {loading || authLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Вы ещё не оставляли отзывы.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Номер: {review.roomId}</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Оценка: {review.rating} ★
                      </h3>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold uppercase rounded-full bg-blue-50 text-blue-500">
                      {statusLabels[review.status] ?? review.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                  {review.response && (
                    <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
                      <p className="font-semibold">Ответ администрации:</p>
                      <p>{review.response.text}</p>
                      <p className="text-xs text-blue-500 mt-1">
                        {review.response.respondedBy} • {new Date(review.response.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MyReviews;

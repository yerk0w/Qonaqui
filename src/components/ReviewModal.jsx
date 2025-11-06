import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { reviewsService } from '../services/reviewsService';

const ReviewModal = ({ booking, roomName, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!booking) return null;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await reviewsService.create({
        bookingId: booking.id,
        roomId: booking.roomId,
        rating,
        comment,
        photos: [],
      });
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.form
          onSubmit={submit}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <p className="text-sm text-gray-500">Отзыв о номере</p>
              <h2 className="text-xl font-semibold text-gray-900">{roomName}</h2>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Оценка: <span className="text-blue-600 font-semibold">{rating}</span>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="accent-blue-600"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Комментарий
              <textarea
                required
                minLength={10}
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Опишите ваши впечатления..."
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
              />
            </label>

            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
          </div>

          <div className="p-6 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || comment.trim().length < 10}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-40"
            >
              {loading ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;

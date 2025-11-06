import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { servicesService } from '../services/servicesService';

const ServiceBookingModal = ({ service, onClose, onBooked }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState(service?.price ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValid = useMemo(() => {
    return Boolean(date && time);
  }, [date, time]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        serviceId: service.id,
        date,
        time,
        price,
      };
      const booking = await servicesService.createBooking(payload);
      onBooked?.(booking);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
              <p className="text-sm text-gray-500 uppercase">{service.category}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Дата
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Время
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Стоимость услуги (можно скорректировать вручную)
              <input
                type="number"
                min={0}
                value={price}
                onChange={(event) => setPrice(Number(event.target.value) || 0)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-40"
            >
              {loading ? 'Отправка...' : 'Забронировать услугу'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceBookingModal;

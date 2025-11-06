import { useEffect, useState } from 'react';
import { receptionService } from '../../services/receptionService';

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatDateReadable = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ListCard = ({ title, items, emptyText, actionLabel, onAction }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex-1">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {items.length === 0 ? (
      <p className="text-gray-500 text-sm">{emptyText}</p>
    ) : (
      <ul className="space-y-4">
        {items.map((booking) => (
          <li key={booking.id} className="flex justify-between items-center border-b pb-3 last:border-none last:pb-0">
            <div>
              <p className="font-semibold text-gray-800">{booking.guestName ?? 'Гость'}</p>
              <p className="text-sm text-gray-500">
                Номер {booking.roomId} • {formatDateReadable(booking.checkInDate ?? booking.checkOutDate)}
              </p>
            </div>
            {onAction && (
              <button
                onClick={() => onAction(booking.id)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                {actionLabel}
              </button>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ReceptionDashboard = () => {
  const [date, setDate] = useState(todayISO());
  const [arrivals, setArrivals] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (selectedDate = date) => {
    setLoading(true);
    try {
      const [arrivalsData, departuresData] = await Promise.all([
        receptionService.arrivals(selectedDate),
        receptionService.departures(selectedDate),
      ]);
      setArrivals(arrivalsData);
      setDepartures(departuresData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setArrivals([]);
      setDepartures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await receptionService.checkIn(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await receptionService.checkOut(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Сегодня на ресепшене</h1>
          <p className="text-gray-600">
            Управление заездами и выездами на {formatDateReadable(date)}
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            loadData(e.target.value);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
      </header>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListCard
            title="Заезды"
            items={arrivals}
            emptyText="Нет ожидаемых заездов."
            actionLabel="Заселить"
            onAction={handleCheckIn}
          />
          <ListCard
            title="Выезды"
            items={departures}
            emptyText="Нет ожидаемых выездов."
            actionLabel="Выселить"
            onAction={handleCheckOut}
          />
        </div>
      )}
    </div>
  );
};

export default ReceptionDashboard;

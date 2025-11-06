import { useEffect, useMemo, useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { useRooms } from '../context/RoomsContext.jsx';

const statusConfig = {
  AVAILABLE: { label: 'Свободен', color: 'bg-emerald-500' },
  RESERVED: { label: 'Забронирован', color: 'bg-yellow-400' },
  OCCUPIED: { label: 'Занят', color: 'bg-red-500' },
  MAINTENANCE: { label: 'Ремонт', color: 'bg-purple-500' },
  CLEANING: { label: 'Уборка', color: 'bg-gray-400' },
};

const BuildingMapPage = () => {
  const { rooms, isLoading, error } = useRooms();

  const floors = useMemo(() => {
    const unique = new Set(rooms.map((room) => room.floor));
    return Array.from(unique).sort((a, b) => a - b);
  }, [rooms]);

  const [selectedFloor, setSelectedFloor] = useState(floors[0] ?? 1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (floors.length === 0) return;
    if (!floors.includes(selectedFloor)) {
      setSelectedFloor(floors[0]);
    }
  }, [floors, selectedFloor]);
  const floorRooms = useMemo(() => {
    return rooms
      .filter((room) => room.floor === selectedFloor)
      .filter((room) => (statusFilter ? room.status === statusFilter : true))
      .sort((a, b) => a.number.localeCompare(b.number));
  }, [rooms, selectedFloor, statusFilter]);

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <header className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              План здания QonaqUi
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Выберите этаж и статус, чтобы посмотреть расположение номеров. Цветовая схема
              показывает текущую доступность. Нажмите на номер, чтобы увидеть подробности.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Выбор этажа</h2>
              <div className="grid grid-cols-4 gap-2">
                {floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`py-2 rounded-lg border text-sm font-semibold transition ${
                      selectedFloor === floor
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фильтр по статусу
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Все</option>
                  {Object.entries(statusConfig).map(([status, { label }]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Этаж {selectedFloor} — {floorRooms.length} номеров
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              ) : floorRooms.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  На этом этаже нет номеров с выбранным статусом.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {floorRooms.map((room) => {
                    const status = statusConfig[room.status] ?? {
                      label: room.status,
                      color: 'bg-gray-300',
                    };
                    return (
                      <div
                        key={room.id}
                        className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">№ {room.number}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${status.color}`}
                            title={status.label}
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                        <p className="text-sm text-gray-500">
                          {room.type} • {room.capacity} гостей
                        </p>
                        <p className="text-sm text-gray-500">Цена: {Number(room.price ?? 0).toLocaleString()} ₸</p>
                        <span className="text-xs font-semibold uppercase text-gray-600 bg-gray-100 rounded-full px-2 py-1 self-start">
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Легенда статусов</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(statusConfig).map(([status, { label, color }]) => (
                <div key={status} className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full ${color}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">Статус: {status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BuildingMapPage;

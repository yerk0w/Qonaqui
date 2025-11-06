import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const metricCardClass = 'bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2';

const MetricCard = ({ label, value, accent = 'text-blue-600' }) => (
  <div className={metricCardClass}>
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className={`text-3xl font-bold ${accent}`}>{value}</span>
  </div>
);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminService.dashboardSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Ключевые показатели эффективности отеля QonaqUi.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard label="Всего пользователей" value={summary.totalUsers} />
        <MetricCard label="Клиентов" value={summary.totalClients} />
        <MetricCard label="Сотрудников ресепшена" value={summary.totalReceptionists} />
        <MetricCard label="Администраторов" value={summary.totalAdmins} />
        <MetricCard label="Лояльность (баллы)" value={summary.totalLoyaltyPoints} accent="text-indigo-600" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard label="Номеров в отеле" value={summary.totalRooms} accent="text-emerald-600" />
        <MetricCard label="Свободно" value={summary.availableRooms} accent="text-emerald-600" />
        <MetricCard label="Занято" value={summary.occupiedRooms} accent="text-red-500" />
        <MetricCard label="Забронировано" value={summary.reservedRooms} accent="text-yellow-500" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricCard label="Всего бронирований" value={summary.totalBookings} />
        <MetricCard label="В ожидании" value={summary.pendingBookings} />
        <MetricCard label="Подтверждено" value={summary.confirmedBookings} />
        <MetricCard label="Заселено" value={summary.checkedInBookings} />
        <MetricCard label="Выселено" value={summary.checkedOutBookings} />
        <MetricCard label="Отменено" value={summary.cancelledBookings} accent="text-red-500" />
      </section>

      <section className={metricCardClass}>
        <span className="text-sm font-medium text-gray-500">Совокупный доход</span>
        <span className="text-4xl font-bold text-blue-600">
          {Number(summary.totalRevenue ?? 0).toLocaleString()} ₸
        </span>
      </section>
    </div>
  );
};

export default AdminDashboard;

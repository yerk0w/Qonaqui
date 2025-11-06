import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, ClipboardList, Home } from 'lucide-react';

const ReceptionSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-emerald-600 text-white'
        : 'text-gray-300 hover:bg-emerald-700 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4">
      <div className="text-2xl font-bold mb-8 p-2">Reception</div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link to="/receptionist" className={linkClass('/receptionist')}>
          <CalendarCheck size={20} />
          <span>Заезды/выезды</span>
        </Link>
        <Link to="/receptionist/bookings" className={linkClass('/receptionist/bookings')}>
          <ClipboardList size={20} />
          <span>Бронирования</span>
        </Link>
      </nav>
      <div className="border-t border-gray-700 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-emerald-700 hover:text-white rounded-lg"
        >
          <Home size={20} />
          <span>На сайт</span>
        </Link>
      </div>
    </div>
  );
};

export default ReceptionSidebar;

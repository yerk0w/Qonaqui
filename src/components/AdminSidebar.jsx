import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Hotel, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4">
      <div className="text-2xl font-bold mb-8 p-2">QonaqUi Admin</div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link to="/admin" className={linkClass('/admin')}>
          <LayoutDashboard size={20} />
          <span>Дашборд</span>
        </Link>
        <Link to="/admin/users" className={linkClass('/admin/users')}>
          <Users size={20} />
          <span>Пользователи</span>
        </Link>
        <Link to="/admin/hotels" className={linkClass('/admin/hotels')}>
          <Hotel size={20} />
          <span>Отели</span>
        </Link>
      </nav>
      <div className="border-t border-gray-700 pt-4">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
          <LogOut size={20} />
          <span>Вернуться на сайт</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
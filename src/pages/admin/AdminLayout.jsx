import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-100 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
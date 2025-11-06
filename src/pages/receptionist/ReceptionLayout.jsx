import { Outlet } from 'react-router-dom';
import ReceptionSidebar from '../../components/ReceptionSidebar.jsx';

const ReceptionLayout = () => (
  <div className="flex">
    <ReceptionSidebar />
    <main className="flex-1 p-8 bg-gray-100 min-h-screen overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default ReceptionLayout;

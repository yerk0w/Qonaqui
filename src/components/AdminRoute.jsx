import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ allowedRoles = ['ADMIN'] }) => {
  const { user, isLoading } = useAuth();
  const isAllowed = user && allowedRoles.includes(user.role);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;

import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const API_PROFILE_URL = 'http://localhost:4000/api/auth/profile';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(API_PROFILE_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const user = await res.json();
          if (user.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Ошибка проверки админа:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={48} /></div>;
  }

  // Если не админ, перенаправляем на главную.
  // Outlet - это место, куда React Router вставит вложенные компоненты (наши админ-страницы)
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
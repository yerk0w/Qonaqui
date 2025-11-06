import { useEffect, useMemo, useState } from 'react';
import { Trash, Loader2, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminUsers = () => {
  const { refreshProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleLabels = useMemo(() => ({
    ADMIN: 'Администратор',
    RECEPTIONIST: 'Ресепшен',
    CLIENT: 'Клиент',
    GUEST: 'Гость',
  }), []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.listUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      await refreshProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Управление пользователями</h1>
      
      {loading && <Loader2 className="animate-spin" size={32} />}
      {error && <p className="text-red-500 flex items-center gap-2"><AlertTriangle size={20} />{error}</p>}
      
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Имя</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Роль</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Баллы</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.loyaltyPoints ?? 0}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Удалить"
                      disabled={user.role === 'ADMIN'} // Защита от удаления админа
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

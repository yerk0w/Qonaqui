import { useState, useEffect } from 'react';
import { Trash, UserCheck, Loader2, AlertTriangle } from 'lucide-react';

const API_USERS_URL = 'http://localhost:4000/api/admin/users';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_USERS_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Не удалось загрузить пользователей');
      const data = await res.json();
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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_USERS_URL}/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      // Обновляем список пользователей
      setUsers(users.filter(user => user._id !== userId));
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
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(user._id)} 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Удалить"
                      disabled={user.role === 'admin'} // Защита от удаления админа
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
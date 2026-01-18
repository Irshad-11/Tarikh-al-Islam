import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { FiUserX, FiUserCheck } from 'react-icons/fi';

export default function UsersManagement() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await api.get('/admin/contributors/');
        setContributors(res.data);
      } catch (err) {
        console.error('Failed to load contributors');
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const handleToggleActive = async (userId, currentActive) => {
    const action = currentActive ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this contributor?`)) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));

    try {
      const endpoint = currentActive
        ? `/admin/contributors/${userId}/suspend/`
        : `/admin/contributors/${userId}/activate/`;

      await api.post(endpoint, {});
      
      setContributors(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, is_active: !currentActive } : u
        )
      );
      alert(`User ${action}ed successfully.`);
    } catch (err) {
      alert(`Failed to ${action} user.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return <div className="text-center py-20 text-gold">Loading contributors...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif text-gold text-center mb-10">
        Manage Contributors
      </h1>

      {contributors.length === 0 ? (
        <div className="text-center py-16 text-stone text-xl">
          No contributors registered yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-deep-green/80 border-b border-gold/30">
                <th className="px-6 py-4 text-left text-gold font-serif">Username</th>
                <th className="px-6 py-4 text-left text-gold font-serif">Email</th>
                <th className="px-6 py-4 text-left text-gold font-serif">Joined</th>
                <th className="px-6 py-4 text-left text-gold font-serif">Status</th>
                <th className="px-6 py-4 text-center text-gold font-serif">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map(user => (
                <tr key={user.id} className="border-b border-gold/10 hover:bg-deep-green/90 transition-colors">
                  <td className="px-6 py-4 text-stone">{user.username}</td>
                  <td className="px-6 py-4 text-stone">{user.email}</td>
                  <td className="px-6 py-4 text-stone">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.is_active
                        ? 'bg-green-800/50 text-green-200'
                        : 'bg-red-800/50 text-red-200'
                    }`}>
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      disabled={actionLoading[user.id]}
                      className={`
                        inline-flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-medium
                        ${user.is_active
                          ? 'bg-red-900/60 hover:bg-red-800/80 text-red-200'
                          : 'bg-green-900/60 hover:bg-green-800/80 text-green-200'
                        }
                        disabled:opacity-50
                      `}
                    >
                      {user.is_active ? <FiUserX /> : <FiUserCheck />}
                      {user.is_active ? 'Suspend' : 'Activate'}
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
}
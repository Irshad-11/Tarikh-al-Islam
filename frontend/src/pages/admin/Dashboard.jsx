import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { FiClock, FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    deletionRequested: 0,
    contributors: 0,
    approvedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // You can create a dedicated stats endpoint later, or fetch separately
        const [pendingRes, deletionRes, contribRes] = await Promise.all([
          api.get('/admin/events/pending/'),
          api.get('/admin/events/deletions/'),
          api.get('/admin/contributors/'),
        ]);

        setStats({
          pending: pendingRes.data.length,
          deletionRequested: deletionRes.data.length,
          contributors: contribRes.data.length,
          approvedToday: 0, // placeholder - can add real logic later
        });
      } catch (err) {
        console.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Pending Approvals',
      value: stats.pending,
      icon: FiClock,
      color: 'yellow',
      link: '/admin/pending',
    },
    {
      title: 'Deletion Requests',
      value: stats.deletionRequested,
      icon: FiXCircle,
      color: 'purple',
      link: '/admin/moderation/deletions',
    },
    {
      title: 'Active Contributors',
      value: stats.contributors,
      icon: FiUsers,
      color: 'green',
      link: '/admin/users',
    },
  ];

  if (loading) {
    return <div className="text-center py-20 text-gold">Loading admin overview...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-serif text-gold text-center mb-12 tracking-wide">
        Administrator Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`
              bg-deep-green/70 border border-gold/20 rounded-xl p-8 text-center
              hover:border-gold/60 hover:shadow-gold-glow transition-all group
            `}
          >
            <card.icon className={`mx-auto text-5xl mb-4 text-${card.color}-400 group-hover:text-${card.color}-300 transition-colors`} />
            <h3 className="text-2xl font-serif text-gold mb-2">{card.value}</h3>
            <p className="text-stone text-lg">{card.title}</p>
          </Link>
        ))}
      </div>

      <div className="bg-deep-green/60 border border-gold/20 rounded-xl p-8">
        <h2 className="text-3xl font-serif text-gold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/admin/pending"
            className="flex items-center justify-center gap-4 p-6 bg-gold/10 hover:bg-gold/20 rounded-lg text-gold hover:text-gold-dark transition-all text-xl font-medium"
          >
            <FiCheckCircle size={28} />
            Review Pending Events
          </Link>
          <Link
            to="/admin/moderation/deletions"
            className="flex items-center justify-center gap-4 p-6 bg-purple-900/30 hover:bg-purple-800/50 rounded-lg text-purple-200 hover:text-purple-100 transition-all text-xl font-medium"
          >
            <FiXCircle size={28} />
            Handle Deletion Requests
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center justify-center gap-4 p-6 bg-green-900/30 hover:bg-green-800/50 rounded-lg text-green-200 hover:text-green-100 transition-all text-xl font-medium md:col-span-2"
          >
            <FiUsers size={28} />
            Manage Contributors
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center text-stone">
        <p className="text-lg">Logged in as administrator</p>
      </div>
    </div>
  );
}
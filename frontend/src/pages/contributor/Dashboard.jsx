import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { 
  FiUpload, 
  FiList, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle 
} from 'react-icons/fi';

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deletionRequested: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributorData = async () => {
      try {
        // Fetch all events created by this user (backend already filters for contributors)
        const res = await api.get('/events/');

        const events = res.data;
        const counts = {
          total: events.length,
          pending: events.filter(e => e.status === 'PENDING').length,
          approved: events.filter(e => e.status === 'APPROVED').length,
          rejected: events.filter(e => e.status === 'REJECTED').length,
          deletionRequested: events.filter(e => e.status === 'DELETION_REQUESTED').length,
        };

        // Sort by created_at descending → show 5 most recent
        const sorted = [...events].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);

        setStats(counts);
        setRecentEvents(sorted);
      } catch (err) {
        setError('Failed to load your contribution statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'contributor') {
      fetchContributorData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gold text-xl">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-wide mb-4">
          Welcome, {user?.username}
        </h1>
        <p className="text-xl text-stone">
          Thank you for contributing to the preservation of Islamic history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-12">
        <div className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 text-center hover:border-gold/60 transition-all">
          <FiList className="mx-auto text-4xl text-gold mb-3" />
          <h3 className="text-3xl font-serif text-gold">{stats.total}</h3>
          <p className="text-stone mt-1">Total Submissions</p>
        </div>

        <div className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 text-center hover:border-gold/60 transition-all">
          <FiClock className="mx-auto text-4xl text-yellow-400 mb-3" />
          <h3 className="text-3xl font-serif text-gold">{stats.pending}</h3>
          <p className="text-stone mt-1">Pending Review</p>
        </div>

        <div className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 text-center hover:border-gold/60 transition-all">
          <FiCheckCircle className="mx-auto text-4xl text-green-400 mb-3" />
          <h3 className="text-3xl font-serif text-gold">{stats.approved}</h3>
          <p className="text-stone mt-1">Approved</p>
        </div>

        <div className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 text-center hover:border-gold/60 transition-all">
          <FiXCircle className="mx-auto text-4xl text-red-400 mb-3" />
          <h3 className="text-3xl font-serif text-gold">{stats.rejected}</h3>
          <p className="text-stone mt-1">Rejected</p>
        </div>

        <div className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 text-center hover:border-gold/60 transition-all">
          <FiAlertTriangle className="mx-auto text-4xl text-purple-400 mb-3" />
          <h3 className="text-3xl font-serif text-gold">{stats.deletionRequested}</h3>
          <p className="text-stone mt-1">Deletion Requested</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Link
          to="/contributor/events/new"
          className="flex flex-col items-center justify-center gap-4 p-10 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-xl text-gold hover:text-gold-dark transition-all group"
        >
          <FiUpload className="text-6xl group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-medium">Submit New Event</span>
          <p className="text-stone text-center text-sm">
            Add a new historical event for review
          </p>
        </Link>

        <Link
          to="/contributor/events"
          className="flex flex-col items-center justify-center gap-4 p-10 bg-deep-green/80 border border-gold/30 rounded-xl text-gold hover:border-gold hover:shadow-gold-glow transition-all group"
        >
          <FiList className="text-6xl group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-medium">View My Events</span>
          <p className="text-stone text-center text-sm">
            Manage your submitted contributions
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-deep-green/60 border border-gold/20 rounded-xl p-8">
        <h2 className="text-3xl font-serif text-gold mb-6 text-center md:text-left">
          Recent Activity
        </h2>

        {recentEvents.length === 0 ? (
          <p className="text-center text-stone py-8">
            No recent submissions. Start contributing today!
          </p>
        ) : (
          <div className="space-y-4">
            {recentEvents.map(event => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-islamic-green/40 rounded-lg border border-gold/10 hover:border-gold/30 transition-all"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-serif text-gold">{event.title}</h4>
                  <p className="text-stone text-sm mt-1">
                    {event.start_year_ad} • Submitted {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  event.status === 'APPROVED' ? 'bg-green-800/50 text-green-200' :
                  event.status === 'PENDING' ? 'bg-yellow-800/50 text-yellow-200' :
                  event.status === 'REJECTED' ? 'bg-red-800/50 text-red-200' :
                  event.status === 'DELETION_REQUESTED' ? 'bg-purple-800/50 text-purple-200' :
                  'bg-gray-700/50 text-gray-300'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-stone">
        <p className="text-lg">
          All submissions are reviewed by administrators before publication.
        </p>
        <p className="mt-2">
          Thank you for helping preserve authentic Islamic historical knowledge.
        </p>
      </div>
    </div>
  );
}
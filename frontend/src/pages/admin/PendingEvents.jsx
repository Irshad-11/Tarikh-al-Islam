import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { FiCheck, FiX } from 'react-icons/fi';

export default function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/admin/events/pending/');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load pending events.');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (eventId, action, note = '') => {
    setActionLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const endpoint = action === 'approve'
        ? `/admin/events/${eventId}/approve/`
        : `/admin/events/${eventId}/reject/`;

      await api.post(endpoint, note ? { note } : {});

      setEvents(prev => prev.filter(e => e.id !== eventId));
      alert(`Event ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } catch (err) {
      alert(`Failed to ${action} event.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  if (loading) return <div className="text-center py-20 text-gold">Loading moderation queue...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif text-gold text-center mb-10">
        Pending Events Moderation
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-16 text-stone text-xl">
          No pending events at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-deep-green/70 border border-gold/20 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-gold">{event.title}</h3>
                  <p className="text-stone mt-1">
                    Submitted by {event.created_by?.username} on {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-4 self-start md:self-center flex-wrap">
                  <button
                    onClick={() => handleAction(event.id, 'approve')}
                    disabled={actionLoading[event.id]}
                    className="flex items-center gap-2 px-6 py-3 bg-green-800/50 hover:bg-green-700/70 text-green-200 rounded-lg transition-all disabled:opacity-50"
                  >
                    <FiCheck /> Approve
                  </button>

                  <button
                    onClick={() => {
                      const note = prompt('Optional rejection reason:');
                      if (note !== null) handleAction(event.id, 'reject', note);
                    }}
                    disabled={actionLoading[event.id]}
                    className="flex items-center gap-2 px-6 py-3 bg-red-900/50 hover:bg-red-800/70 text-red-200 rounded-lg transition-all disabled:opacity-50"
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </div>

              {event.summary && (
                <p className="mt-4 text-stone line-clamp-3">{event.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
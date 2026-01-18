import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { FiCheck, FiX } from 'react-icons/fi';

export default function ModerationQueue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchDeletionRequests = async () => {
      try {
        const res = await api.get('/admin/events/deletions/');
        setRequests(res.data);
      } catch (err) {
        console.error('Failed to load deletion requests');
      } finally {
        setLoading(false);
      }
    };
    fetchDeletionRequests();
  }, []);

  const handleResolve = async (eventId, confirmDelete) => {
    setActionLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const endpoint = confirmDelete
        ? `/admin/events/${eventId}/delete/`
        : `/admin/events/${eventId}/deny-deletion/`;

      await api.post(endpoint, {});

      setRequests(prev => prev.filter(e => e.id !== eventId));
      alert(confirmDelete ? 'Event permanently deleted.' : 'Deletion request denied – event restored.');
    } catch (err) {
      alert('Action failed.');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  if (loading) return <div className="text-center py-20 text-gold">Loading deletion queue...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif text-gold text-center mb-10">
        Deletion Requests Queue
      </h1>

      {requests.length === 0 ? (
        <div className="text-center py-16 text-stone text-xl">
          No pending deletion requests at this time.
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map(event => (
            <div
              key={event.id}
              className="bg-deep-green/70 border border-gold/20 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-gold mb-2">{event.title}</h3>
                  <p className="text-stone mb-1">
                    Requested by: {event.updated_by?.username || 'Unknown'}
                  </p>
                  <p className="text-stone text-sm">
                    Original event from {event.start_year_ad}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 self-start md:self-center">
                  <button
                    onClick={() => handleResolve(event.id, true)}
                    disabled={actionLoading[event.id]}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-900/60 hover:bg-red-800/80 text-red-100 rounded-lg transition-all disabled:opacity-50 min-w-[140px]"
                  >
                    <FiX /> Confirm Delete
                  </button>

                  <button
                    onClick={() => handleResolve(event.id, false)}
                    disabled={actionLoading[event.id]}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-900/60 hover:bg-green-800/80 text-green-100 rounded-lg transition-all disabled:opacity-50 min-w-[140px]"
                  >
                    <FiCheck /> Deny Request
                  </button>
                </div>
              </div>

              {event.summary && (
                <p className="mt-4 text-stone line-clamp-3 border-t border-gold/10 pt-4">
                  {event.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
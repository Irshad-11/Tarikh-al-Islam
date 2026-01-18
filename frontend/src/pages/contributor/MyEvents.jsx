import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get('/events/'); // backend already filters by created_by for contributors
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load your submitted events.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'contributor') fetchMyEvents();
  }, [user]);

  const handleRequestDeletion = async (eventId) => {
    if (!window.confirm('Do you want to suggest deletion of this event?')) return;
    try {
      await api.post(`/events/${eventId}/request-deletion/`, {
        note: 'Contributor requested removal',
      });
      alert('Deletion suggestion sent to administrators.');
      // Optional: refresh list
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, status: 'DELETION_REQUESTED' } : e
      ));
    } catch (err) {
      alert('Failed to submit deletion request.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gold">Loading your contributions...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif text-gold text-center mb-10">
        My Submitted Events
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-16 text-stone">
          <p className="text-xl mb-6">You haven't submitted any events yet.</p>
          <Link
            to="/contributor/events/new"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold-dark text-islamic-green rounded-xl font-medium transition-all"
          >
            Submit Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-deep-green/70 border border-gold/20 rounded-xl p-6 shadow-gold-glow/20 hover:shadow-gold-glow/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-gold mb-1">{event.title}</h3>
                  <p className="text-stone mb-2">
                    {event.start_year_ad}
                    {event.end_year_ad && ` – ${event.end_year_ad}`}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    event.status === 'APPROVED' ? 'bg-green-800/50 text-green-200' :
                    event.status === 'PENDING' ? 'bg-yellow-800/50 text-yellow-200' :
                    event.status === 'REJECTED' ? 'bg-red-800/50 text-red-200' :
                    event.status === 'DELETION_REQUESTED' ? 'bg-purple-800/50 text-purple-200' :
                    'bg-gray-800/50 text-gray-300'
                  }`}>
                    {event.status}
                  </span>

                  {event.status === 'PENDING' && (
                    <Link
                      to={`/contributor/events/edit/${event.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gold/30 hover:bg-gold/50 text-gold rounded-lg transition-all"
                    >
                      <FiEdit /> Edit
                    </Link>
                  )}

                  {(event.status === 'APPROVED' || event.status === 'PENDING') && (
                    <button
                      onClick={() => handleRequestDeletion(event.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded-lg transition-all border border-red-600/30"
                    >
                      <FiTrash2 /> Suggest Delete
                    </button>
                  )}
                </div>
              </div>

              {event.summary && (
                <p className="mt-4 text-stone line-clamp-2">{event.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
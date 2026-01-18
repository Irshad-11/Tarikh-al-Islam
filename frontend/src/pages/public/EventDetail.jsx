import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          'Could not load event details. It may be pending, rejected, or deleted.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const canEdit = user && 
    (user.role === 'admin' || 
     (user.role === 'contributor' && event?.created_by?.id === user.id && event?.status === 'PENDING'));

  const handleDeleteRequest = async () => {
    if (!window.confirm('Are you sure you want to suggest deletion of this event?')) return;
    
    try {
      await api.post(`/events/${id}/request-deletion/`, { note: 'Contributor requested removal' });
      alert('Deletion request submitted. An administrator will review it.');
      navigate('/contributor/events'); // or refresh
    } catch (err) {
      alert('Failed to submit deletion request.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gold text-xl flex items-center gap-3">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading historical record...
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl text-gold mb-4">Event Not Available</h2>
        <p className="text-stone mb-8 max-w-xl">{error || 'This event is not accessible at this time.'}</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gold/80 hover:bg-gold text-islamic-green rounded-lg font-medium transition-all"
        >
          Return to Timeline
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-wide">
            {event.title}
          </h1>
          
          <div className="text-right">
            <div className="text-3xl font-serif text-gold">
              {event.start_year_ad}
              {event.end_year_ad && event.end_year_ad !== event.start_year_ad && ` – ${event.end_year_ad}`}
            </div>
            {event.start_year_hijri && (
              <div className="text-lg text-stone">
                {event.start_year_hijri}
                {event.end_year_hijri && event.end_year_hijri !== event.start_year_hijri && ` – ${event.end_year_hijri}`} AH
              </div>
            )}
          </div>
        </div>

        {event.location_name && (
          <p className="mt-3 text-xl text-stone italic">
            {event.location_name}
            {event.latitude && event.longitude && ` (${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)})`}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${
            event.status === 'APPROVED' ? 'bg-green-800/40 text-green-300' :
            event.status === 'PENDING' ? 'bg-yellow-800/40 text-yellow-300' :
            event.status === 'REJECTED' ? 'bg-red-800/40 text-red-300' :
            'bg-gray-800/40 text-gray-300'
          }`}>
            {event.status}
          </span>
          
          {event.importance_level && (
            <span className="px-4 py-1 bg-gold/20 text-gold rounded-full text-sm">
              Importance: {event.importance_level}/5
            </span>
          )}
        </div>
      </div>

      <div className="gold-divider mb-10" />

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Left / Main Column */}
        <div className="md:col-span-2 space-y-10">
          {event.summary && (
            <div>
              <h2 className="text-2xl font-serif text-gold mb-4">Summary</h2>
              <p className="text-lg text-stone leading-relaxed">{event.summary}</p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-serif text-gold mb-4">Description</h2>
            <div className="prose prose-invert prose-gold max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => <a {...props} className="text-gold hover:underline" target="_blank" rel="noopener noreferrer" />,
                  table: ({ node, ...props }) => <table {...props} className="border-collapse border border-gold/30" />,
                  th: ({ node, ...props }) => <th {...props} className="border border-gold/30 p-2 bg-gold/10" />,
                  td: ({ node, ...props }) => <td {...props} className="border border-gold/30 p-2" />,
                }}
              >
                {event.description_md || 'No detailed description available.'}
              </ReactMarkdown>
            </div>
          </div>

          {/* Sources */}
          {event.sources?.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif text-gold mb-4">References & Sources</h2>
              <ul className="space-y-4">
                {event.sources.map((source, index) => (
                  <li key={source.id} className="bg-deep-green/50 p-4 rounded-lg border border-gold/20">
                    <div className="flex items-start gap-3">
                      {source.is_primary_source && (
                        <span className="inline-block px-2 py-1 bg-gold/30 text-gold text-xs rounded">Primary</span>
                      )}
                      <div>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gold hover:text-gold-dark hover:underline font-medium"
                        >
                          {source.title}
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Images */}
          {event.images?.length > 0 && (
            <div>
              <h3 className="text-xl font-serif text-gold mb-4">Visual Records</h3>
              <div className="space-y-4">
                {event.images.map((img) => (
                  <div key={img.id} className="rounded-lg overflow-hidden border border-gold/20 shadow-gold-glow/30">
                    <img 
                      src={img.image_url} 
                      alt={img.caption || event.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p className="p-3 text-sm text-stone italic bg-deep-green/70">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div>
              <h3 className="text-xl font-serif text-gold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((t, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm border border-gold/20"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-stone space-y-2">
            <p><strong>Contributed by:</strong> {event.created_by?.username || 'Unknown'}</p>
            <p><strong>Created:</strong> {format(new Date(event.created_at), 'MMMM d, yyyy')}</p>
            {event.approved_at && (
              <p><strong>Approved:</strong> {format(new Date(event.approved_at), 'MMMM d, yyyy')}</p>
            )}
            <p><strong>Last updated:</strong> {format(new Date(event.updated_at), 'MMMM d, yyyy')}</p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gold/20">
            {canEdit && (
              <Link
                to={`/contributor/events/edit/${event.id}`} // you'll create this route later
                className="block w-full py-3 px-6 mb-4 text-center bg-gold/80 hover:bg-gold text-islamic-green rounded-lg transition-all"
              >
                Edit Event
              </Link>
            )}

            {user?.role === 'contributor' && event.status === 'APPROVED' && (
              <button
                onClick={handleDeleteRequest}
                className="block w-full py-3 px-6 text-center bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded-lg transition-all border border-red-600/30"
              >
                Suggest Deletion
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          to="/" 
          className="inline-block px-8 py-4 bg-deep-green border-2 border-gold/40 hover:border-gold text-gold hover:text-gold-dark rounded-xl transition-all text-lg font-medium"
        >
          ← Back to Timeline
        </Link>
      </div>
    </div>
  );
}
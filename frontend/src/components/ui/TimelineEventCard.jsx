import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function TimelineEventCard({ event }) {
  return (
    <Link 
      to={`/events/${event.id}`}
      className="block bg-deep-green/60 backdrop-blur-sm border border-gold/20 rounded-lg overflow-hidden hover:border-gold/60 transition-all hover:shadow-gold-glow group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-serif text-gold group-hover:text-gold-dark transition-colors">
            {event.title}
          </h3>
          <span className="text-sm text-stone font-medium">
            {event.start_year_ad}
            {event.end_year_ad && event.end_year_ad !== event.start_year_ad && `–${event.end_year_ad}`}
          </span>
        </div>
        
        <p className="text-stone line-clamp-3 mb-4">
          {event.summary || event.description_md.substring(0, 180) + '...'}
        </p>

        <div className="flex flex-wrap gap-2">
          {event.tags?.map((t, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full">
              {t.tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
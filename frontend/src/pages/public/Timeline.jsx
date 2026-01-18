import { useState, useEffect } from 'react';
import api from '../../lib/api';
import TimelineEventCard from '../../components/ui/TimelineEventCard';

export default function Timeline() {
    const [events, setEvents] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events/', { params: { year } });
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [year]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const params = { year };
                if (searchQuery) params.search = searchQuery;
                if (selectedTag) params.tag = selectedTag;

                const res = await api.get('/events/', { params });
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [year, searchQuery, selectedTag]);

    useEffect(() => {
        // Example: api.get('/tags/').then(res => setAvailableTags(res.data));
        setAvailableTags(['Early Islam', 'Battles', 'Caliphate', 'Scholars', 'Conquests']); // placeholder
    }, []);

    return (
        <div className="space-y-12">
            <header className="text-center">
                <h1 className="text-5xl md:text-6xl font-serif text-gold mb-4 tracking-wider">
                    Tārīkh al-Islām
                </h1>
                <p className="text-xl text-stone">A Chronological Journey Through Islamic History</p>
            </header>

            {/* Year selector - can be improved with slider or infinite scroll later */}
            <div className="flex justify-center gap-6 items-center">
                <button
                    onClick={() => setYear(y => y - 10)}
                    className="text-gold hover:text-gold-dark text-2xl"
                >
                    ←
                </button>
                <div className="text-4xl font-serif text-gold">{year}</div>
                <button
                    onClick={() => setYear(y => y + 10)}
                    className="text-gold hover:text-gold-dark text-2xl"
                >
                    →
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search events (title, description)..."
                    className="w-full max-w-md px-5 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite placeholder-stone/70 focus:border-gold focus:ring-gold/50"
                />

                <select
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                    className="w-full max-w-xs px-5 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
                >
                    <option value="">All Categories</option>
                    {availableTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>

                {(searchQuery || selectedTag) && (
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedTag(''); }}
                        className="text-gold hover:text-gold-dark text-sm underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>
            <div className="gold-divider" />

            {loading ? (
                <div className="text-center py-20 text-gold">Loading historical events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-stone">No events recorded for this period.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <TimelineEventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
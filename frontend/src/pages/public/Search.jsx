import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import TimelineEventCard from '../../components/ui/TimelineEventCard';
import { FiSearch, FiX } from 'react-icons/fi';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';
  const initialStartYear = searchParams.get('start_year') || '';
  const initialEndYear = searchParams.get('end_year') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialSort = searchParams.get('sort') || '-start_year_ad'; // default newest/oldest first

  const [query, setQuery] = useState(initialQuery);
  const [tag, setTag] = useState(initialTag);
  const [startYear, setStartYear] = useState(initialStartYear);
  const [endYear, setEndYear] = useState(initialEndYear);
  const [location, setLocation] = useState(initialLocation);
  const [sort, setSort] = useState(initialSort);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  // Optional: fetch popular tags once (you can make this dynamic later)
  useEffect(() => {
    // You could create a /api/tags/ endpoint in backend later
    setAvailableTags([
      'Early Islam', 'Battles', 'Caliphate', 'Scholars', 'Conquests',
      'Umayyad', 'Abbasid', 'Golden Age', 'Crusades', 'Ottoman'
    ]);
  }, []);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (query.trim()) params.search = query.trim();
      if (tag) params.tag = tag;
      if (startYear) params.start_year_ad__gte = startYear;
      if (endYear) params.start_year_ad__lte = endYear;
      if (location.trim()) params.location_name__icontains = location.trim();
      if (sort) params.ordering = sort;

      const res = await api.get('/events/', { params });
      setResults(res.data);

      // Update URL so search can be shared/bookmarked
      setSearchParams({
        ...(query.trim() && { q: query.trim() }),
        ...(tag && { tag }),
        ...(startYear && { start_year: startYear }),
        ...(endYear && { end_year: endYear }),
        ...(location.trim() && { location: location.trim() }),
        ...(sort && sort !== '-start_year_ad' && { sort }),
      }, { replace: true });
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when page loads with query params
  useEffect(() => {
    if (initialQuery || initialTag || initialStartYear || initialEndYear || initialLocation) {
      performSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const clearFilters = () => {
    setQuery('');
    setTag('');
    setStartYear('');
    setEndYear('');
    setLocation('');
    setSort('-start_year_ad');
    setResults([]);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-serif text-gold text-center mb-10 tracking-wide">
        Search Historical Events
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-deep-green/70 border border-gold/20 rounded-xl p-8 shadow-gold-glow/20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Keyword Search */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-stone mb-2 font-medium">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Battle of Badr, Hijrah, Ibn Sina..."
                className="w-full pl-10 pr-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite placeholder-stone/70 focus:border-gold focus:ring-gold/50"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/70" size={20} />
            </div>
          </div>

          {/* Category / Tag */}
          <div>
            <label className="block text-stone mb-2 font-medium">Category</label>
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
            >
              <option value="">All Categories</option>
              {availableTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-stone mb-2 font-medium">Sort By</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
            >
              <option value="-start_year_ad">Newest first (AD year)</option>
              <option value="start_year_ad">Oldest first (AD year)</option>
              <option value="-importance_level">Most important first</option>
              <option value="importance_level">Least important first</option>
              <option value="-visibility_rank">Highest visibility first</option>
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-stone mb-2 font-medium">From Year (AD)</label>
            <input
              type="number"
              value={startYear}
              onChange={e => setStartYear(e.target.value)}
              placeholder="e.g., 570"
              className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-stone mb-2 font-medium">To Year (AD)</label>
            <input
              type="number"
              value={endYear}
              onChange={e => setEndYear(e.target.value)}
              placeholder="e.g., 1258"
              className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-stone mb-2 font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Madinah, Baghdad, Cordoba..."
              className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-medium text-lg transition-all flex-1 max-w-xs
              ${loading 
                ? 'bg-gold/50 cursor-not-allowed' 
                : 'bg-gold hover:bg-gold-dark text-islamic-green shadow-gold-glow hover:shadow-lg'
              }
            `}
          >
            <FiSearch size={20} />
            {loading ? 'Searching...' : 'Search Events'}
          </button>

          {(query || tag || startYear || endYear || location || sort !== '-start_year_ad') && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-deep-green border border-gold/40 hover:border-gold text-gold rounded-xl transition-all flex-1 max-w-xs"
            >
              <FiX size={20} />
              Clear Filters
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-gold text-xl flex items-center justify-center gap-3">
          <div className="animate-spin h-6 w-6 border-4 border-gold border-t-transparent rounded-full" />
          Searching historical records...
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400 text-xl">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 text-stone text-xl">
          No events found matching your criteria.<br />
          Try adjusting the filters or search terms.
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-serif text-gold mb-8 text-center md:text-left">
            {results.length} Event{results.length !== 1 ? 's' : ''} Found
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(event => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
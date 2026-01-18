import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const eventSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(255),
  summary: yup.string().nullable().max(500),
  description_md: yup.string().required('Description is required'),
  location_name: yup.string().nullable().max(255),
  latitude: yup.number().nullable().typeError('Must be a number'),
  longitude: yup.number().nullable().typeError('Must be a number'),
  start_year_ad: yup.number().required('Start year (AD) is required').integer(),
  end_year_ad: yup.number().nullable().integer(),
  start_year_hijri: yup.number().nullable().integer(),
  end_year_hijri: yup.number().nullable().integer(),
  importance_level: yup.number().required().min(1).max(5).integer(),
  visibility_rank: yup.number().required().min(1).integer(),
  sources: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Source title required'),
      url: yup.string().url('Must be a valid URL').required('URL required'),
      is_primary_source: yup.boolean(),
    })
  ),
  tags: yup.array().of(yup.string().trim().required()),
});

export default function EventForm() {
  const { id } = useParams(); // if editing → id present
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: '',
      summary: '',
      description_md: '',
      location_name: '',
      latitude: '',
      longitude: '',
      start_year_ad: '',
      end_year_ad: '',
      start_year_hijri: '',
      end_year_hijri: '',
      importance_level: 3,
      visibility_rank: 1,
      sources: [{ title: '', url: '', is_primary_source: false }],
      tags: [''],
    },
  });

  const {
    fields: sourceFields,
    append: addSource,
    remove: removeSource,
  } = useFieldArray({ control, name: 'sources' });

  const {
    fields: tagFields,
    append: addTag,
    remove: removeTag,
  } = useFieldArray({ control, name: 'tags' });

  // Fetch existing event if editing
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}/`);
        const data = res.data;

        // Only allow edit if pending and owned by current user
        if (data.status !== 'PENDING' || data.created_by?.id !== user?.id) {
          throw new Error('You can only edit your own pending events.');
        }

        reset({
          title: data.title,
          summary: data.summary || '',
          description_md: data.description_md,
          location_name: data.location_name || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          start_year_ad: data.start_year_ad,
          end_year_ad: data.end_year_ad || '',
          start_year_hijri: data.start_year_hijri || '',
          end_year_hijri: data.end_year_hijri || '',
          importance_level: data.importance_level,
          visibility_rank: data.visibility_rank,
          sources: data.sources.length > 0 ? data.sources : [{ title: '', url: '', is_primary_source: false }],
          tags: data.tags.length > 0 ? data.tags.map(t => t.tag.name) : [''],
        });
      } catch (err) {
        setError(err.message || 'Failed to load event for editing.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvent();
  }, [id, reset, user]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      start_year_ad: Number(formData.start_year_ad),
      end_year_ad: formData.end_year_ad ? Number(formData.end_year_ad) : null,
      start_year_hijri: formData.start_year_hijri ? Number(formData.start_year_hijri) : null,
      end_year_hijri: formData.end_year_hijri ? Number(formData.end_year_hijri) : null,
      importance_level: Number(formData.importance_level),
      visibility_rank: Number(formData.visibility_rank),
      sources: formData.sources.filter(s => s.title && s.url), // remove empty
      tags: formData.tags.filter(t => t.trim()), // remove empty
    };

    try {
      if (id) {
        // Update existing
        await api.put(`/events/${id}/`, payload);
        alert('Event updated successfully!');
      } else {
        // Create new
        await api.post('/events/', payload);
        alert('Event submitted for review! It is now pending approval.');
      }
      navigate(id ? '/contributor/events' : '/');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to save event. Please check the form.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gold">
        Loading event data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl md:text-5xl font-serif text-gold text-center mb-10 tracking-wide">
        {id ? 'Edit Pending Event' : 'Submit New Historical Event'}
      </h1>

      {error && (
        <div className="mb-8 p-4 bg-red-900/40 border border-red-500/40 rounded-lg text-red-200 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Basic Info */}
        <section className="bg-deep-green/60 p-8 rounded-xl border border-gold/20">
          <h2 className="text-2xl font-serif text-gold mb-6">Event Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-stone mb-2">Title *</label>
              <input
                {...register('title')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite focus:border-gold focus:ring-gold/50"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-stone mb-2">Importance Level (1–5) *</label>
              <select
                {...register('importance_level')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.importance_level && <p className="text-red-400 text-sm mt-1">{errors.importance_level.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-stone mb-2">Short Summary (for timeline preview)</label>
            <textarea
              {...register('summary')}
              rows={3}
              className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite focus:border-gold"
              placeholder="Brief overview visible in timeline cards..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-stone mb-2">Full Description (Markdown supported) *</label>
            <textarea
              {...register('description_md')}
              rows={10}
              className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite focus:border-gold font-mono"
              placeholder="Use Markdown: **bold**, *italic*, [link](url), etc."
            />
            {errors.description_md && <p className="text-red-400 text-sm mt-1">{errors.description_md.message}</p>}
          </div>
        </section>

        {/* Timeline & Location */}
        <section className="bg-deep-green/60 p-8 rounded-xl border border-gold/20">
          <h2 className="text-2xl font-serif text-gold mb-6">Timeline & Location</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-stone mb-2">Start Year (AD) *</label>
              <input
                type="number"
                {...register('start_year_ad')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
              {errors.start_year_ad && <p className="text-red-400 text-sm mt-1">{errors.start_year_ad.message}</p>}
            </div>

            <div>
              <label className="block text-stone mb-2">End Year (AD)</label>
              <input
                type="number"
                {...register('end_year_ad')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
            </div>

            <div>
              <label className="block text-stone mb-2">Start Year (Hijri)</label>
              <input
                type="number"
                {...register('start_year_hijri')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
            </div>

            <div>
              <label className="block text-stone mb-2">End Year (Hijri)</label>
              <input
                type="number"
                {...register('end_year_hijri')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-stone mb-2">Location Name</label>
              <input
                {...register('location_name')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
                placeholder="e.g., Badr, Madinah"
              />
            </div>
            <div>
              <label className="block text-stone mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                {...register('latitude')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
            </div>
            <div>
              <label className="block text-stone mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                {...register('longitude')}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite"
              />
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="bg-deep-green/60 p-8 rounded-xl border border-gold/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-gold">Sources / References</h2>
            <button
              type="button"
              onClick={() => addSource({ title: '', url: '', is_primary_source: false })}
              className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/40 text-gold rounded-lg transition-all"
            >
              <FiPlus /> Add Source
            </button>
          </div>

          {sourceFields.map((field, index) => (
            <div key={field.id} className="mb-6 p-5 bg-islamic-green/40 rounded-lg border border-gold/20 relative">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone mb-2">Title *</label>
                  <input
                    {...register(`sources.${index}.title`)}
                    className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite"
                  />
                </div>
                <div>
                  <label className="block text-stone mb-2">URL *</label>
                  <input
                    {...register(`sources.${index}.url`)}
                    className="w-full px-4 py-3 bg-islamic-green/60 border border-gold/30 rounded-lg text-offwhite"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 text-stone">
                  <input
                    type="checkbox"
                    {...register(`sources.${index}.is_primary_source`)}
                    className="h-5 w-5 text-gold bg-islamic-green border-gold/40 rounded"
                  />
                  Primary / Most Authoritative Source
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeSource(index)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-300"
              >
                <FiTrash2 size={20} />
              </button>

              {errors.sources?.[index] && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.sources[index]?.title?.message || errors.sources[index]?.url?.message}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Tags */}
        <section className="bg-deep-green/60 p-8 rounded-xl border border-gold/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-gold">Tags / Categories</h2>
            <button
              type="button"
              onClick={() => addTag('')}
              className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/40 text-gold rounded-lg transition-all"
            >
              <FiPlus /> Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex items-center bg-gold/10 border border-gold/30 rounded-full px-4 py-2">
                <input
                  {...register(`tags.${index}`)}
                  className="bg-transparent outline-none text-gold placeholder-gold/50 min-w-[120px]"
                  placeholder="e.g., Battles"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-3 text-red-400 hover:text-red-300"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="text-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className={`
              inline-flex items-center gap-3 px-10 py-4 rounded-xl font-medium text-lg transition-all
              ${loading 
                ? 'bg-gold/50 cursor-not-allowed' 
                : 'bg-gold hover:bg-gold-dark text-islamic-green shadow-gold-glow hover:shadow-lg'
              }
            `}
          >
            <FiSave />
            {loading ? 'Saving...' : (id ? 'Update Event' : 'Submit for Review')}
          </button>

          <p className="mt-4 text-stone text-sm">
            {id 
              ? 'Changes will be saved as pending again.' 
              : 'All new events are reviewed by administrators before appearing publicly.'}
          </p>
        </div>
      </form>
    </div>
  );
}
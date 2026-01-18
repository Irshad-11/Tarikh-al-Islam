import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/'); // or redirect based on role later
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif text-gold tracking-wide mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-stone">
            Sign in to contribute to Islamic historical knowledge
          </p>
        </div>

        <div className="bg-deep-green/70 backdrop-blur-md border border-gold/20 rounded-xl p-8 shadow-gold-glow">
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-500/30 rounded-lg text-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-stone mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite placeholder-stone/70 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="your_username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-islamic-green/50 border border-gold/30 rounded-lg text-offwhite placeholder-stone/70 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-6 rounded-lg font-medium text-lg transition-all
                ${loading
                  ? 'bg-gold/50 cursor-not-allowed'
                  : 'bg-gold hover:bg-gold-dark text-islamic-green shadow-gold-glow hover:shadow-lg'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-islamic-green" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-stone">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-dark transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-stone/70">
          <p>Only contributors and administrators can log in.</p>
          <p>Public users can explore the timeline without an account.</p>
        </div>
      </div>
    </div>
  );
}
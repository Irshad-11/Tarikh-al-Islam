import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiLogOut, FiUserPlus, FiUpload, FiList, FiSettings } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <nav className="bg-islamic-green/90 backdrop-blur-md border-b border-gold/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-serif text-gold tracking-wider hover:text-gold-dark transition-colors">
                            Tārīkh al-Islām
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Always visible */}
                        <Link to="/" className="text-stone hover:text-gold transition-colors">
                            Timeline
                        </Link>
                        <Link to="/search" className="text-stone hover:text-gold transition-colors">
                            Search
                        </Link>

                        {/* Contributor links */}
                        {user?.role === 'contributor' && (
                            <>
                                <Link to="/contributor" className="flex items-center gap-2 text-stone hover:text-gold transition-colors">
                                    <FiList /> Dashboard
                                </Link>
                                <Link to="/contributor/events" className="flex items-center gap-2 text-stone hover:text-gold transition-colors">
                                    <FiList /> My Events
                                </Link>
                                <Link to="/contributor/events/new" className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors">
                                    <FiUpload /> Submit Event
                                </Link>
                            </>
                        )}

                        {/* Admin links */}
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin" className="flex items-center gap-2 text-stone hover:text-gold transition-colors">
                                    <FiSettings /> Admin Dashboard
                                </Link>
                                <Link to="/admin/pending" className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors">
                                    <FiList /> Pending Events
                                </Link>
                            </>
                        )}

                        {/* Auth section */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-stone hidden md:inline">
                                    {user.username} <span className="text-gold/70 text-sm">({user.role})</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-200 rounded-lg transition-all"
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                                >
                                    <FiLogIn /> Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-5 py-2 bg-gold/20 hover:bg-gold/40 text-gold rounded-lg transition-all"
                                >
                                    <FiUserPlus /> Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
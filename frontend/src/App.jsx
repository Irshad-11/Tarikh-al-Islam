// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Timeline from './pages/public/Timeline';
import EventDetail from './pages/public/EventDetail';
import Search from './pages/public/Search';           // ← if you added this

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Contributor
import ContributorDashboard from './pages/contributor/Dashboard';
import EventForm from './pages/contributor/EventForm';
import MyEvents from './pages/contributor/MyEvents';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import PendingEvents from './pages/admin/PendingEvents';
import ModerationQueue from './pages/admin/ModerationQueue';   // ← ADD THIS LINE
import UsersManagement from './pages/admin/UsersManagement';


function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gold">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Timeline />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Contributor */}
              <Route path="/contributor" element={
                <ProtectedRoute allowedRoles={['contributor']}>
                  <ContributorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/contributor/events/new" element={
                <ProtectedRoute allowedRoles={['contributor']}>
                  <EventForm />
                </ProtectedRoute>
              } />
              <Route path="/contributor/events" element={
                <ProtectedRoute allowedRoles={['contributor']}>
                  <MyEvents />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/pending" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PendingEvents />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/contributor/events/new" element={
                <ProtectedRoute allowedRoles={['contributor']}>
                  <EventForm />
                </ProtectedRoute>
              } />

              <Route path="/contributor/events/edit/:id" element={
                <ProtectedRoute allowedRoles={['contributor']}>
                  <EventForm />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/pending" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PendingEvents />
                </ProtectedRoute>
              } />

              <Route path="/admin/moderation/deletions" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ModerationQueue />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersManagement />
                </ProtectedRoute>
              } />

              <Route path="/contributor" element={
  <ProtectedRoute allowedRoles={['contributor']}>
    <ContributorDashboard />
  </ProtectedRoute>
} />
<Route path="/search" element={<Search />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
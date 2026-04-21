import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './stores/authStore';

function App() {
  const { user, logout } = useAuthStore();

  return (
    <BrowserRouter>
      <nav className="bg-white shadow-md p-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          {user && !user.is_gym_owner && (
            <Link to="/bookings" className="text-blue-600 hover:underline">My Bookings</Link>
          )}
          {user && user.is_gym_owner && (
            <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-600">Hello, {user.username}</span>
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requireGymOwner>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
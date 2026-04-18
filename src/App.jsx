import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white shadow-md p-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/bookings" className="text-blue-600 hover:underline">My Bookings</Link>
          <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
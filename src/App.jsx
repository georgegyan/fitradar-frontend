import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GymDetail from './pages/GymDetail';
import MyBookings from './pages/MyBookings';
import SubmitGym from './pages/SubmitGym';
import useAuthStore from './stores/authStore';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/gym/:id" element={<GymDetail />} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/submit-gym" element={<ProtectedRoute><SubmitGym /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
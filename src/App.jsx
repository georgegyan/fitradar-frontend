import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './stores/authStore';

// Protected route wrapper
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
        {/* Future protected routes */}
        <Route path="/gym/:id" element={<div>Gym Detail - Coming Soon</div>} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <div>My Bookings - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-gym"
          element={
            <ProtectedRoute>
              <div>Submit Gym - Coming Soon</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
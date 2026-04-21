import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, requireGymOwner = false }) => {
  const { user, isGymOwner } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireGymOwner && !isGymOwner()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
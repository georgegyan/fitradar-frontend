import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_gym_owner: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    try {
      await register(formData);
      // After successful register+login, redirect based on role
      const { isGymOwner } = useAuthStore.getState();
      if (isGymOwner()) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.username) setFieldErrors({ username: err.username });
      if (err.email) setFieldErrors({ email: err.email });
      if (err.password) setFieldErrors({ password: err.password });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_gym_owner"
            checked={formData.is_gym_owner}
            onChange={handleChange}
            id="gymOwner"
          />
          <label htmlFor="gymOwner" className="text-sm">Register as Gym Owner</label>
        </div>
        {error && <p className="text-red-500 text-sm">{error.error || 'Registration failed'}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
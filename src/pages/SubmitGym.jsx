import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGym } from '../services/gymService';
import useAuthStore from '../stores/authStore';

export default function SubmitGym() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  if (user && !user.is_gym_owner) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await createGym(formData);
      setSuccess('Gym submitted successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit gym. Make sure you are logged in as a gym owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="responsive-container" style={styles.container}>
      <div className="form-card" style={styles.card}>
        <h1>Submit a Gym</h1>
        <p>Help others discover fitness centers</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Gym Name*"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="Address*"
            value={formData.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Submitting...' : 'Submit Gym'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' },
  button: { backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, width: '100%', cursor: 'pointer' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  success: { backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' },
};
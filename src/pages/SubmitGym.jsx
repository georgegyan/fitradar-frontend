import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGym } from '../services/gymService';

export default function SubmitGym() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    price_per_session: '',
    price_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createGym(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit gym');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Submit a Gym</h1>
        <p>Help others discover fitness centers</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Gym Name*" onChange={handleChange} required style={styles.input} />
          <textarea name="description" placeholder="Description" onChange={handleChange} style={styles.textarea} rows="3" />
          <input type="text" name="address" placeholder="Address*" onChange={handleChange} required style={styles.input} />
          <div style={styles.row}>
            <input type="number" step="any" name="latitude" placeholder="Latitude" onChange={handleChange} style={styles.input} />
            <input type="number" step="any" name="longitude" placeholder="Longitude" onChange={handleChange} style={styles.input} />
          </div>
          <input type="number" step="0.01" name="price_per_session" placeholder="Price per session ($)" onChange={handleChange} style={styles.input} />
          <input type="text" name="price_description" placeholder="Price description (e.g., 'Drop-in rate')" onChange={handleChange} style={styles.input} />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Submitting...' : 'Submit Gym'}</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' },
  textarea: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit' },
  row: { display: 'flex', gap: '1rem' },
  error: { color: '#dc2626', marginBottom: '1rem' },
  button: { backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, width: '100%', cursor: 'pointer' },
};
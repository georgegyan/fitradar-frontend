import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../stores/authStore';

export default function OwnerDashboard() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchMyGyms = async () => {
      try {
        const response = await api.get('/gyms/'); // Get all gyms, then filter by owner? Better: backend endpoint.
        // For MVP, we filter client-side. Later we can add /my-gyms endpoint.
        const myGyms = response.data.filter(gym => gym.owner === user?.id);
        setGyms(myGyms);
      } catch {
        setError('Failed to load your gyms');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyGyms();
  }, [user]);

  // Redirect if not gym owner
  if (user && !user.is_gym_owner) {
    return <div style={styles.centered}>Access denied. Gym owners only.</div>;
  }

  if (loading) return <div style={styles.centered}>Loading...</div>;
  if (error) return <div style={styles.centered}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1>My Gyms</h1>
      <Link to="/submit-gym" style={styles.addButton}>+ Add New Gym</Link>
      {gyms.length === 0 ? (
        <p>You haven't submitted any gyms yet.</p>
      ) : (
        <div style={styles.grid}>
          {gyms.map(gym => (
            <div key={gym.id} style={styles.card}>
              <h3>{gym.name}</h3>
              <p>{gym.address}</p>
              <Link to={`/gym/${gym.id}`} style={styles.viewLink}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
  centered: { textAlign: 'center', padding: '3rem' },
  addButton: {
    display: 'inline-block',
    backgroundColor: '#e63946',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textDecoration: 'none',
  },
  grid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  viewLink: { color: '#e63946', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' },
};
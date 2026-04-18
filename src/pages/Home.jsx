import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import { getNearbyGyms } from '../services/gymService';
import { getCurrentPosition } from '../utils/location';

export default function Home() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    const fetchGyms = async (lat, lng) => {
      try {
        setLoading(true);
        const data = await getNearbyGyms(lat, lng, 10);
        setGyms(data.results || data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load gyms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLocationAndGyms = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationDenied(false);
        await fetchGyms(latitude, longitude);
      } catch (err) {
        console.error('Geolocation error:', err);
        setLocationDenied(true);
        await fetchGyms(location.lat, location.lng);
      }
    };

    fetchLocationAndGyms();
  }, [location.lat, location.lng]);

  return (
    <div className="responsive-container" style={styles.container}>
      <div style={styles.header}>
        <h1>Find Gyms Near You</h1>
        <p>Discover fitness centers and book sessions instantly</p>
        {locationDenied && (
          <div style={styles.warning}>
            Location access denied. Showing gyms near default area.
          </div>
        )}
      </div>

      <div style={styles.mapSection}>
        {loading ? (
          <div style={styles.loader}>Loading gyms...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <>
            <MapView gyms={gyms} center={[location.lat, location.lng]} zoom={13} />
            <div style={styles.gymList}>
              <h3>Nearby Gyms ({gyms.length})</h3>
              <div className="gym-grid" style={styles.grid}>
                {gyms.map((gym) => (
                  <Link to={`/gym/${gym.id}`} key={gym.id} style={styles.card}>
                    {gym.cover_image && (
                      <img src={gym.cover_image} alt={gym.name} style={styles.cardImage} />
                    )}
                    <div style={styles.cardContent}>
                      <h4>{gym.name}</h4>
                      <p>{gym.address}</p>
                      {gym.price_per_session && (
                        <span style={styles.price}>${gym.price_per_session}/session</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  warning: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    padding: '0.5rem',
    borderRadius: '8px',
    marginTop: '1rem',
  },
  mapSection: { marginTop: '1rem' },
  loader: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#64748b' },
  error: { textAlign: 'center', color: '#dc2626', padding: '2rem' },
  gymList: { marginTop: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    color: 'inherit',
  },
  cardImage: { width: '100%', height: '160px', objectFit: 'cover', backgroundColor: '#f1f5f9' },
  cardContent: { padding: '1rem' },
  price: {
    display: 'inline-block',
    backgroundColor: '#e63946',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
};
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import BookingForm from '../components/BookingForm';
import { getGymDetails } from '../services/gymService';

export default function GymDetail() {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const data = await getGymDetails(id);
        setGym(data);
      } catch (err) {
        console.error("Fetch error", err)
        setError('Gym not found');
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [id]);

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setBookingSuccess(true);
    setTimeout(() => navigate('/bookings'), 2000);
  };

  if (loading) return <div style={styles.centered}>Loading gym details...</div>;
  if (error) return <div style={styles.centered}>{error}</div>;
  if (!gym) return null;

  return (
    <div style={styles.container}>
      {/* Hero Image */}
      {gym.cover_image && (
        <div style={styles.hero}>
          <img src={gym.cover_image} alt={gym.name} style={styles.heroImage} />
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <h1>{gym.name}</h1>
          <button onClick={() => setShowBookingForm(true)} style={styles.bookButton}>
            Book a session
          </button>
        </div>

        <div style={styles.infoSection}>
          <p style={styles.address}>📍 {gym.address}</p>
          {gym.price_per_session && (
            <p style={styles.price}>💰 ${gym.price_per_session} per session</p>
          )}
          {gym.price_description && <p>{gym.price_description}</p>}
          <p style={styles.description}>{gym.description}</p>
        </div>

        <div style={styles.mapSection}>
          <h3>Location</h3>
          {gym.latitude && gym.longitude ? (
            <MapView
              gyms={[gym]}
              center={[gym.latitude, gym.longitude]}
              zoom={15}
            />
          ) : (
            <p>Address: {gym.address}</p>
          )}
        </div>

        {bookingSuccess && (
          <div style={styles.successBanner}>
            ✅ Booking confirmed! Check your bookings page.
          </div>
        )}
      </div>

      {showBookingForm && (
        <BookingForm
          gymId={gym.id}
          gymName={gym.name}
          onSuccess={handleBookingSuccess}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' },
  hero: { width: '100%', height: '300px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  content: { padding: '1.5rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  bookButton: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '40px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  infoSection: { marginBottom: '2rem' },
  address: { color: '#475569', marginBottom: '0.5rem' },
  price: { fontWeight: 600, color: '#e63946', marginBottom: '1rem' },
  description: { lineHeight: 1.6, color: '#334155' },
  mapSection: { marginTop: '2rem' },
  centered: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem' },
  successBanner: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    textAlign: 'center',
  },
};

// Mobile responsive adjustments via media query in index.css (we'll add)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import { format } from 'date-fns';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data.results || data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      await fetchBookings();
    } catch {
      alert('Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="responsive-container" style={styles.centered}>Loading bookings...</div>;
  if (error) return <div className="responsive-container" style={styles.centered}>{error}</div>;

  return (
    <div className="responsive-container" style={styles.container}>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <div style={styles.empty}>
          <p>You have no bookings yet.</p>
          <Link to="/" style={styles.link}>Browse gyms</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <div style={styles.cardContent}>
                <h3>{booking.gym.name}</h3>
                <p>
                  📅 {format(new Date(booking.booking_date), 'PPP')}<br />
                  🕒 {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}
                </p>
                <span style={styles.status(booking.status)}>{booking.status}</span>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancelling === booking.id}
                  style={styles.cancelBtn}
                >
                  {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  centered: { textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px' },
  link: { color: '#e63946', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardContent: { flex: 1 },
  status: (status) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backgroundColor: status === 'confirmed' ? '#d1fae5' : status === 'cancelled' ? '#fee2e2' : '#fef3c7',
    color: status === 'confirmed' ? '#065f46' : status === 'cancelled' ? '#991b1b' : '#854d0e',
  }),
  cancelBtn: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
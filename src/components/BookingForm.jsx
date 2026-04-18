import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { createBooking } from '../services/bookingService';
import useAuthStore from '../stores/authStore';

export default function BookingForm({ gymId, gymName, onSuccess, onClose }) {
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to book a session');
      return;
    }

    setLoading(true);
    setError('');

    const formattedDate = format(bookingDate, 'yyyy-MM-dd');
    const payload = {
      gym: gymId,
      booking_date: formattedDate,
      start_time: startTime + ':00',
      end_time: endTime + ':00',
      special_requests: specialRequests,
    };

    try {
      await createBooking(payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed. Time slot may be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div className="booking-modal" style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <h3 style={styles.title}>Book a session at {gymName}</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Date</label>
            <DatePicker
              selected={bookingDate}
              onChange={setBookingDate}
              minDate={new Date()}
              style={styles.input}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="time-row" style={styles.row}>
            <div style={styles.field}>
              <label>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.field}>
            <label>Special Requests (optional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              style={styles.textarea}
              rows="2"
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    padding: '1.5rem',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '0.75rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#64748b',
  },
  title: { fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a2e' },
  field: { marginBottom: '1rem' },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    width: '100%',
    cursor: 'pointer',
  },
};
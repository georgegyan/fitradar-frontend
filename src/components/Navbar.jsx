import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const isGymOwner = user?.is_gym_owner === true;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
           FitRadar
        </Link>
        <div style={styles.links}>
          <Link to="/">Gyms</Link>
          {isAuthenticated ? (
            <>
              <Link to="/bookings">My Bookings</Link>
              {isGymOwner && <Link to="/submit-gym">Submit Gym</Link>}
              <span style={styles.user}>👋 {user?.username}</span>
              <button onClick={logout} style={styles.logoutBtn}>Logout</button>
              {isGymOwner && <Link to="/dashboard">Dashboard</Link>}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: '0.75rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#e63946',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  user: {
    fontWeight: 500,
    color: '#2c3e50',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#e63946',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

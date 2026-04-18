import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const isGymOwner = user?.is_gym_owner === true;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar-wrapper" style={styles.nav}>
      <div className="responsive-container navbar-inner" style={styles.container}>
        <Link to="/" className="logo" style={styles.logo} onClick={closeMenu}>
          💪 FitRadar
        </Link>
        
        {/* Hamburger button - visible only on mobile via CSS */}
        <button className="hamburger" onClick={toggleMenu} style={styles.hamburger}>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
        </button>

        {/* Navigation links - conditionally visible on mobile based on menuOpen */}
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`} style={styles.links}>
          <Link to="/" onClick={closeMenu}>Gyms</Link>
          {isAuthenticated ? (
            <>
              <Link to="/bookings" onClick={closeMenu}>My Bookings</Link>
              {isGymOwner && <Link to="/submit-gym" onClick={closeMenu}>Submit Gym</Link>}
              {isGymOwner && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
              <span style={styles.user}>👋 {user?.username}</span>
              <button onClick={() => { logout(); closeMenu(); }} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
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
    position: 'relative',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#e63946',
    textDecoration: 'none',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    display: 'none', // hidden by default, shown on mobile via media query
    color: '#1a1a2e',
    padding: '0 0.5rem',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '24px',
    width: '24px',
  },
  hamburgerLine: {
    display: 'block',
    width: '100%',
    height: '2px',
    backgroundColor: '#1a1a2e',
    borderRadius: '1px',
    transition: 'all 0.3s ease',
  },
  links: {
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  user: {
    fontWeight: 500,
    color: '#2c3e50',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#e63946',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
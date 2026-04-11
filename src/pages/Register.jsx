import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      navigate('/login');
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join FitRadar to book gym sessions</p>
        {errors.general && <div style={styles.error}>{errors.general}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username*"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.username && <span style={styles.fieldError}>{errors.username}</span>}
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          <div style={styles.row}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              style={{...styles.input, flex: 1}}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              style={{...styles.input, flex: 1}}
            />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password*"
            value={formData.password2}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.password2 && <span style={styles.fieldError}>{errors.password2}</span>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1a1a2e' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem' },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  fieldError: {
    color: '#dc2626',
    fontSize: '0.8rem',
    marginTop: '-0.5rem',
    marginBottom: '0.5rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  row: { display: 'flex', gap: '1rem' },
  button: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  footer: { marginTop: '1.5rem', textAlign: 'center', color: '#64748b' },
  link: { color: '#e63946', textDecoration: 'none', fontWeight: 500 },
};
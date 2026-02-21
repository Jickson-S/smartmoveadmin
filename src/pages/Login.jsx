import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAdminError, loginAdmin } from '../store/slices/adminAuthSlice';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.adminAuth);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }

    return () => {
      dispatch(clearAdminError());
    };
  }, [token, navigate, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginAdmin(form));
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card panel">
        <h1>Admin Login</h1>
        <p>Sign in with an admin account to access SmartMove controls.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;

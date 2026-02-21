import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../store/slices/adminAuthSlice';
import './Sidebar.css';

const Sidebar = ({ mobileOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/login');
    onClose?.();
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <span>S</span>
        SmartMove
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" onClick={onClose}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/cars" onClick={onClose}>
          🚗 Cars
        </NavLink>
        <NavLink to="/bookings" onClick={onClose}>
          📋 Bookings
        </NavLink>
        <NavLink to="/users" onClick={onClose}>
          👥 Users
        </NavLink>
      </nav>

      <button className="btn btn-outline sidebar-logout" type="button" onClick={handleLogout}>
        🚪 Logout
      </button>
    </aside>
  );
};

export default Sidebar;

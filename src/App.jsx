import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageCars from './pages/ManageCars';
import ManageBookings from './pages/ManageBookings';
import ManageUsers from './pages/ManageUsers';

const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  const adminRaw = localStorage.getItem('adminUser');

  if (!token || !adminRaw) {
    return false;
  }

  try {
    const admin = JSON.parse(adminRaw);
    return admin?.role === 'admin';
  } catch {
    return false;
  }
};

const AdminRoute = ({ children }) => {
  return isAdminAuthenticated() ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  return isAdminAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const AppShell = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = useMemo(() => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    if (location.pathname.startsWith('/cars')) return 'Manage Cars';
    if (location.pathname.startsWith('/bookings')) return 'Manage Bookings';
    if (location.pathname.startsWith('/users')) return 'Manage Users';
    return 'SmartMove Admin';
  }, [location.pathname]);

  return (
    <div className="admin-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="admin-main-area">
        <TopBar title={title} onMenuClick={() => setMobileOpen((prev) => !prev)} />
        <div className="admin-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cars" element={<ManageCars />} />
            <Route path="/bookings" element={<ManageBookings />} />
            <Route path="/users" element={<ManageUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/*"
        element={
          <AdminRoute>
            <AppShell />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default App;

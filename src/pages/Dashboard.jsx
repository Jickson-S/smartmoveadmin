import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { fetchDashboard } from '../store/slices/dashboardSlice';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import './Dashboard.css';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const monthlyRevenue = stats?.monthlyRevenue || [];
  const fleetStats = stats?.fleetStats || { available: 0, booked: 0 };
  const bookingsByType = stats?.bookingsByType || {};

  const revenueChartData = {
    labels: monthlyRevenue.map((entry) => entry.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue.map((entry) => entry.revenue),
        borderColor: '#e8451e',
        backgroundColor: 'rgba(232,69,30,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#e8451e'
      }
    ]
  };

  const fleetChartData = {
    labels: ['Available', 'Booked'],
    datasets: [
      {
        data: [fleetStats.available || 0, fleetStats.booked || 0],
        backgroundColor: ['#27ae60', '#e8451e'],
        borderWidth: 0
      }
    ]
  };

  const bookingTypeLabels = Object.keys(bookingsByType);
  const bookingTypeValues = Object.values(bookingsByType);

  const bookingTypeChartData = {
    labels: bookingTypeLabels,
    datasets: [
      {
        label: 'Bookings',
        data: bookingTypeValues,
        backgroundColor: 'rgba(232,69,30,0.7)',
        borderRadius: 6
      }
    ]
  };

  const bookedPercentage = useMemo(() => {
    const total = (fleetStats.available || 0) + (fleetStats.booked || 0);
    if (!total) return 0;
    return Math.round(((fleetStats.booked || 0) / total) * 100);
  }, [fleetStats]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!stats) {
    return <p className="error-text">No dashboard data found.</p>;
  }

  return (
    <section className="dashboard-page">
      <div className="stats-row">
        <StatCard label="Total Revenue" value={currency.format(stats.totalRevenue || 0)} icon="💰" />
        <StatCard label="Total Bookings" value={stats.totalBookings || 0} icon="📋" />
        <StatCard label="Total Users" value={stats.totalUsers || 0} icon="👥" />
        <StatCard label="Fleet Size" value={stats.totalCars || 0} icon="🚗" />
      </div>

      <div className="charts-grid">
        <article className="panel chart-panel">
          <h3>Monthly Revenue</h3>
          <Line data={revenueChartData} options={{ maintainAspectRatio: false }} />
        </article>

        <article className="panel chart-panel doughnut-panel">
          <h3>Fleet Utilization</h3>
          <div className="doughnut-wrap">
            <Doughnut data={fleetChartData} options={{ maintainAspectRatio: false, cutout: '66%' }} />
            <div className="doughnut-center">{bookedPercentage}%</div>
          </div>
        </article>

        <article className="panel chart-panel">
          <h3>Bookings by Car Type</h3>
          <Bar
            data={bookingTypeChartData}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
          />
        </article>
      </div>

      <article className="panel recent-bookings">
        <h3>Recent Bookings</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>User</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recentBookings || []).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.car?.name || 'N/A'}</td>
                  <td>{booking.user?.name || 'N/A'}</td>
                  <td>
                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                  </td>
                  <td>{currency.format(booking.totalPrice || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default Dashboard;

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateStatus } from '../store/slices/bookingSlice';
import DataTable from '../components/DataTable';
import Spinner from '../components/Spinner';
import './ManageBookings.css';

const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const ManageBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') {
      return bookings;
    }

    return bookings.filter((booking) => booking.status === activeTab);
  }, [bookings, activeTab]);

  const columns = [
    {
      key: '_id',
      title: 'Booking ID',
      render: (booking) => <code>{booking._id}</code>
    },
    {
      key: 'user',
      title: 'User',
      render: (booking) => (
        <div>
          <strong>{booking.user?.name || 'N/A'}</strong>
          <div>{booking.user?.email || ''}</div>
        </div>
      )
    },
    {
      key: 'car',
      title: 'Car',
      render: (booking) => booking.car?.name || 'N/A'
    },
    {
      key: 'startDate',
      title: 'Start',
      render: (booking) => new Date(booking.startDate).toLocaleDateString()
    },
    {
      key: 'endDate',
      title: 'End',
      render: (booking) => new Date(booking.endDate).toLocaleDateString()
    },
    {
      key: 'totalPrice',
      title: 'Price',
      render: (booking) => `₹${booking.totalPrice}`
    },
    {
      key: 'status',
      title: 'Status',
      render: (booking) => (
        <div className="booking-status-cell">
          <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
          <select
            className="input"
            value={booking.status}
            onChange={(event) =>
              dispatch(updateStatus({ id: booking._id, status: event.target.value }))
            }
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
  ];

  return (
    <section className="manage-bookings-page">
      <h2>Bookings</h2>

      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn btn-outline ${activeTab === tab ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading && bookings.length === 0 ? (
        <Spinner />
      ) : (
        <DataTable columns={columns} rows={filteredBookings} emptyText="No bookings available" />
      )}
    </section>
  );
};

export default ManageBookings;

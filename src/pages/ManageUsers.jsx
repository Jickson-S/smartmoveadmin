import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Spinner from '../components/Spinner';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;

    const q = search.toLowerCase();
    return users.filter(
      (user) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const toggleStatus = async (id) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle`);
      const updated = response.data.user;
      setUsers((prev) => prev.map((user) => (user._id === id ? updated : user)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const columns = [
    {
      key: 'avatar',
      title: 'Avatar',
      render: (user) => <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
    },
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    {
      key: 'phone',
      title: 'Phone',
      render: (user) => user.phone || 'N/A'
    },
    {
      key: 'role',
      title: 'Role',
      render: (user) => <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
    },
    {
      key: 'status',
      title: 'Status',
      render: (user) => (user.isActive ? 'Active' : 'Inactive')
    },
    {
      key: 'joined',
      title: 'Joined',
      render: (user) => new Date(user.createdAt).toLocaleDateString()
    },
    {
      key: 'toggle',
      title: 'Action',
      render: (user) => (
        <button type="button" className="btn btn-outline" onClick={() => toggleStatus(user._id)}>
          {user.isActive ? 'Deactivate' : 'Activate'}
        </button>
      )
    }
  ];

  return (
    <section className="manage-users-page">
      <div className="manage-users-head">
        <h2>Users</h2>
        <input
          className="input"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <DataTable columns={columns} rows={filtered} emptyText="No users found" />
      )}
    </section>
  );
};

export default ManageUsers;

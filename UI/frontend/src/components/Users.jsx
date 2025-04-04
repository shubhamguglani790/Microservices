import React, { useState, useEffect } from 'react';
import api from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: ''
  });
  const [editingEmail, setEditingEmail] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      setUsers([]);
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmail) {
        const response = await api.put('/users/update', { email: editingEmail, ...form });
        alert(`${response.data.message}`);
      } else {
        const response = await api.post('/users/add', form);
        alert(`${response.data.message}`);
      }

      setForm({ name: '', age: '', email: '' });
      setEditingEmail(null);
      fetchUsers();
      setError(null);
    } catch (error) {
      const errMsg = error.response?.data?.error || "Something went wrong";
      alert(`${errMsg}`);
      setError(errMsg);
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      age: user.age,
      email: user.email
    });
    setEditingEmail(user.email);
  };

  const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete('/users/delete', { data: { email } });
      alert(`🗑️ ${response.data.message}`);
      fetchUsers();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Something went wrong";
      alert(`❌ ${errMsg}`);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Users</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
        <div className="row g-4 mx-auto">
          <div className="col-md-4 ">
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              name="age"
              className="form-control"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </div>
          <div className="col-md-4 ">
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={!!editingEmail}
            />
          </div>
          <div className="col-md-4 d-grid mx-auto">
            <button type="submit" className={`btn ${editingEmail ? 'btn-warning' : 'btn-success'}`}>
              {editingEmail ? 'Update' : 'Add'} User
            </button>
          </div>
        </div>

        {editingEmail && (
          <div className="row mt-2">
            <div className="col-md-2 offset-md-10 d-grid">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setForm({ name: '', age: '', email: '' });
                  setEditingEmail(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-5 pt-4" key={user._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  <strong>Age:</strong> {user.age}<br />
                  <strong>Email:</strong> {user.email}
                </p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.email)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-center">No users found.</p>}
      </div>
    </div>
  );
}

export default Users;

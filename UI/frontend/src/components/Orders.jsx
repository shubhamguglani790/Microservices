import React, { useEffect, useState } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    quantity: '',
    price: '',
    customerName: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setError("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await api.put('/orders/update', { _id: editingId, ...form });
        alert(`${response.data.message}`);
      } else {
        const response = await api.post('/orders/add', form);
        alert(`${response.data.message}`);
      }
      setForm({ productName: '', quantity: '', price: '', customerName: '' });
      setEditingId(null);
      fetchOrders();
      setError(null);
    } catch (error) {
      const errMsg = error.response?.data?.error || "Something went wrong";
      alert(`${errMsg}`);
      setError(errMsg);
    }
  };

  const handleEdit = (order) => {
    setForm({
      productName: order.productName || '',
      quantity: order.quantity || '',
      price: order.price || '',
      customerName: order.customerName || ''
    });
    setEditingId(order._id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete('/orders/delete', { data: { _id: id } });
      alert(`${response.data.message}`);
      fetchOrders();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Delete failed";
      alert(`${errMsg}`);
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm mx-auto">
        <div className="row g-4 mx-auto">
          <div className="col-md-3 mx-auto">
            <input name="productName" className="form-control" value={form.productName} onChange={handleChange} placeholder="Product Name" required />
          </div>
          <div className="col-md-3 mx-auto">
            <input name="quantity" type="number" className="form-control" value={form.quantity} onChange={handleChange} placeholder="Quantity" required />
          </div>
          <div className="col-md-3 mx-auto">
            <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} placeholder="Price" required />
          </div>
          <div className="col-md-3 mx-auto">
            <input name="customerName" className="form-control" value={form.customerName} onChange={handleChange} placeholder="Customer Name" required />
          </div>
          <div className="col-md-4 d-grid mx-auto">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Update' : 'Add'} Order
            </button>
          </div>
        </div>
      </form>

      <div className="row">
        {orders.map((order) => (
          <div className="col-md-4 mb-4 pt-4" key={order._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{order.productName}</h5>
                <p className="card-text">
                  <strong>Customer:</strong> {order.customerName}<br />
                  <strong>Quantity:</strong> {order.quantity}<br />
                  <strong>Price:</strong> ₹{order.price}<br />
                  <strong>Order Value:</strong> ₹{order.orderValue}
                </p>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(order._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

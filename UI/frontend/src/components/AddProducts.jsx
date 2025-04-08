import React, { useState, useEffect } from 'react';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    quantity: '',
    image: null
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }
      if (editingId) formData.append('_id', editingId);

      const response = editingId
        ? await api.put('/products/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        : await api.post('/products/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      alert(response.data.message || 'Success!');
      setForm({ name: '', price: '', description: '', category: '', quantity: '', image: null });
      setEditingId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.error || "Error occurred.");
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      image: null,
    });
    setEditingId(product._id);
    setFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await api.delete(`/products/${productId}`);
      alert(response.data.message || "Product deleted");
      fetchProducts();
    } catch (error) {
      alert("Error deleting product.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormVisible(false);
    setForm({ name: '', price: '', description: '', category: '', quantity: '', image: null });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Product Management</h2>
        {!formVisible && (
          <button className="btn btn-primary" onClick={() => setFormVisible(true)}>
            + New Product
          </button>
        )}
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
          <h4 className="mb-3">{editingId ? 'Edit Product' : 'Add Product'}</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                name="quantity"
                type="number"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                name="price"
                type="number"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                name="category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
            </div>
            <div className="col-md-3">
              <input
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'}`}>
                {editingId ? 'Update' : 'Add'} Product
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <h4 className="mb-3">All Products</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th style={{ width: '160px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.image && (
                    <img
                      src={`http://localhost:5002/uploads/${product.image}`}
                      alt={product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;

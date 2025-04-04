import React, { useState, useEffect } from 'react';
import api from '../api'; // axios instance
import 'bootstrap/dist/css/bootstrap.min.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
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
      if (editingId) {
        const response = await api.put('/products/update', { _id: editingId, ...form });
        alert(response.data.message || 'Product updated successfully!');
      } else {
        const response = await api.post('/products/add', form);
        alert(response.data.message || 'Product added successfully!');
      }

      setForm({ name: '', price: '', description: '', category: '', quantity: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      const errMsg = error.response?.data?.error || "An error occurred.";
      alert(errMsg);
      console.error("Error adding/updating product:", error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      quantity: product.quantity || ''
    });
    setEditingId(product._id);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await api.delete('/products/delete', { data: { _id } });
      alert(response.data.message || 'Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      const errMsg = error.response?.data?.error || "An error occurred.";
      alert(errMsg);
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Products</h2>

      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
        <div className="row g-4">
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
          <div className="col-md-3 d-grid mx-auto">
            <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'}`}>
              {editingId ? 'Update' : 'Add'} Product
            </button>
          </div>
        </div>
      </form>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4 pt-4" key={product._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">
                  <strong>Category:</strong> {product.category}<br />
                  <strong>Price:</strong> ₹{product.price}<br />
                  <strong>Quantity:</strong> {product.quantity}<br />
                  <strong>Description:</strong> {product.description}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

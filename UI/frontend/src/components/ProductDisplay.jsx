import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemsContext from '../ContextApi/ItemsContext';

function ProductDisplay() {
  const { cart, setCart } = useContext(ItemsContext);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const handleBuyNow = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} has been added to your cart.`);
  };

  const categories = ['All', ...new Set(products.map(p => p.category || 'Uncategorized'))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const groupedByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Our Products</h3>
        <Link to="/cart" className="btn btn-outline-primary">
          View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </Link>
      </div>

      {/* Category Pills */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            className={`btn btn-sm rounded-pill ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product display (grouped if All, otherwise just in a row) */}
      {selectedCategory === 'All' ? (
        Object.keys(groupedByCategory).map(category => (
          <div key={category} className="mb-5">
            <h4 className="pb-2">{category}</h4>
            <div className="row">
              {groupedByCategory[category].map(product => (
                <div className="col-md-4" key={product._id}>
                  <div className="card mb-4">
                    {product.image && (
                      <img
                        src={`http://localhost:5002/uploads/${product.image}`}
                        alt={product.name}
                        className="card-img p-2"
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">₹{product.price}</p>
                      <p className="card-text">{product.description}</p>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div className="col-md-4" key={product._id}>
              <div className="card mb-4">
                {product.image && (
                  <img
                    src={`http://localhost:5002/uploads/${product.image}`}
                    alt={product.name}
                    className="card-img p-2"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">₹{product.price}</p>
                  <p className="card-text">{product.description}</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <p className="text-center text-muted">No products available.</p>
      )}
    </div>
  );
}

export default ProductDisplay;

import React, { useContext, useEffect, useState } from 'react';
import ItemsContext from '../ContextApi/ItemsContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const { cart, setCart } = useContext(ItemsContext);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [users, setUsers] = useState([]);


  useEffect(() => {
    if (showModal) {
      axios.get('http://localhost:3003/users')
        .then(res => setUsers(res.data))
        .catch(err => console.error('Error fetching users:', err));
    }
  }, [showModal]);
  const handleRemove = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
  };

  const handleIncrease = (id) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrease = (id) => {
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    ));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmCheckout = async () => {
    try {
      for (const item of cart) {
        const order = {
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          customerName: customerName,
        };
        await axios.post('http://localhost:3003/orders', order);
      }
      alert('Orders placed successfully!');
      setCart([]);
      setShowModal(false);
      setCustomerName('');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error placing orders. Please try again.');
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Your Cart</h3>

      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.image && (
                        <img
                          src={`http://localhost:5002/uploads/${item.image}`}
                          alt={item.name}
                          width="60"
                          height="60"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex gap-3 align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDecrease(item._id)}
                          >-</button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIncrease(item._id)}
                          >+</button>
                        </div>
                      </div>
                    </td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-end fw-bold">Total:</td>
                  <td colSpan="2" className="fw-bold">₹{totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <button className="btn btn-success px-4" onClick={() => setShowModal(true)}>
              Proceed to Checkout
            </button>
          </div>

          {/* Bootstrap Modal */}
          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Order</h5>
                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <label className="form-label">Select Customer</label>
                    <select
                      className="form-select"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    >
                      <option value="">-- Choose a user --</option>
                      {users.map(user => (
                        <option key={user._id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button
                      className="btn btn-primary"
                      disabled={!customerName}
                      onClick={confirmCheckout}
                    >
                      Confirm & Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;

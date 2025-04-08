import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import AddProducts from './components/AddProducts';
import Users from './components/Users';
import Orders from './components/Orders';
import Cart from './components/Cart';
import ProductDisplay from './components/ProductDisplay';
import ItemsContext, { ItemsProvider } from './ContextApi/ItemsContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { AuthProvider } from './ContextApi/AuthContext';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { cart, setCart } = useContext(ItemsContext);

  return (
    <Router>
      <AuthProvider>
        <ItemsProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/addproduct' element={<ProtectedRoute><AddProducts /></ProtectedRoute>} />
            <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path='/productdisplay' element={<ProtectedRoute><ProductDisplay /></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute><Cart cart={cart} setCart={setCart} /></ProtectedRoute>} />
          </Routes>
        </ItemsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

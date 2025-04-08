import React, { useState } from 'react';
import { useAuth } from '../ContextApi/AuthContext';
import { login as loginAPI } from '../api/auth'; // Assuming the login API exists
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginAPI(form);
            login(res.data.token, res.data.username); // Save token and username in context
            alert('Logged in successfully!');
            navigate('/productdisplay'); // Redirect to the dashboard
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: '400px' }}>
            <h3>Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;

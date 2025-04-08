import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(form);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert('Registered successfully. Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: '400px' }}>
            <h3>Register</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={form.email}  // Confirm if this is properly showing in the input field
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={form.password}  // Confirm if this is properly showing in the input field
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="btn btn-success w-100 mb-2">Register</button>
                <div className="text-center mt-2">
                    <span>Already have an account? </span>
                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => navigate('/login')}
                        style={{ textDecoration: 'none' }}
                    >
                        Login
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Register;

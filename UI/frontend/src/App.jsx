import React from 'react';
import './App.css';
import Users from './components/Users';
import Orders from './components/Orders';
import Products from './components/AddProducts';

function App() {
    return (
        <div className="container">
            <h1>Dashboard</h1>
            <Users />
            <Orders />
            <Products />

        </div>
    );
}

export default App;

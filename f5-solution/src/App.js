import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/Component/Pages/Shop/Index';
import Login from '../src/Component/Pages/Login/Login';
import ProductPage from './Component/Pages/Shop/Product';
import Register from './Component/Pages/Login/Register';
import ResetPassword from './Component/Pages/Login/ResetPassword';
import ProductDetail from './Component/Pages/Shop/ProductDetail';
import Dashboard from './Component/Pages/Admin';
import Cart from './Component/Pages/Shop/Card';
import Profile from './Component/Pages/Shop/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Products" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/Products/:id" element={<ProductDetail />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/Profile/:username" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

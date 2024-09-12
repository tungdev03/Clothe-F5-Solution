import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/Component/Pages/Shop/Index';
import Login from '../src/Component/Pages/Login/Login';
import DashBoard from './Component/Pages/DashBoard';
import ProductPage from './Component/Pages/Shop/Product';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/DashBoard" element={<DashBoard/>}/>
          <Route path="/Products" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

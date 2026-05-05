import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import { isAdminRole } from './utils';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Packages from './pages/Packages';
import AiFinder from './pages/AiFinder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import { Esim, Support, Success } from './pages/StaticPages';

function Guard({ children, admin = false }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !isAdminRole(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="packages" element={<Packages />} />
            <Route path="ai-finder" element={<AiFinder />} />
            <Route path="esim" element={<Esim />} />
            <Route path="support" element={<Support />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Guard><Checkout /></Guard>} />
            <Route path="success" element={<Success />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Guard><Dashboard /></Guard>} />
            <Route path="admin" element={<Guard admin><Admin /></Guard>} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

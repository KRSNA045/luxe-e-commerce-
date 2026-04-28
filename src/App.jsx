import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Account from './pages/Account';
import { useStore } from './context/StoreContext';

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast">
      <span style={{ color: 'var(--accent-gold)' }}>{toast.icon}</span>
      {toast.msg}
    </div>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
      <AIChatbot />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppLayout />
      </StoreProvider>
    </BrowserRouter>
  );
}

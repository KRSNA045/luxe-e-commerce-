import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, MessageSquare, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount, setChatOpen, chatOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const scrollTo = (id) => {
    if (location.pathname !== '/') { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100); }
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <div className="navbar__left">
          <button className="navbar__menu-btn" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
            <button onClick={() => scrollTo('products')} className="nav-link">Collection</button>
            <button onClick={() => scrollTo('new-arrivals')} className="nav-link">New Arrivals</button>
            <button onClick={() => scrollTo('contact')} className="nav-link">Contact</button>
          </nav>
        </div>

        <Link to="/" className="navbar__logo">
          <span className="logo-word">LUXE</span>
          <span className="logo-dot">✦</span>
        </Link>

        <div className="navbar__right">
          <button className="navbar__icon-btn" onClick={() => setChatOpen(v => !v)} title="AI Assistant">
            <MessageSquare size={18} />
            <span className="ai-badge">AI</span>
          </button>
          <Link to="/cart" className="navbar__icon-btn">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <div className="navbar__user">
              <Link to="/account" className="navbar__icon-btn" title={user.name}>
                <User size={18} />
              </Link>
              <button className="navbar__icon-btn" onClick={logout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="nav-auth-link">Sign In</Link>
              <Link to="/signup" className="nav-auth-btn">Join</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

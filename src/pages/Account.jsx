import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Account.css';

export default function Account() {
  const { user, logout, orders } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="account-auth-prompt">
            <User size={48} />
            <h2>Sign in to view your account</h2>
            <p>Access your orders, wishlist, and preferences</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/signup" className="btn-outline">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h1 className="account-name">{user.name}</h1>
            <p className="account-email">{user.email}</p>
          </div>
          <button className="btn-outline account-logout" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="account-section">
          <h2 className="account-section-title"><Package size={18} />Order History</h2>
          {orders.length === 0 ? (
            <div className="account-empty">
              <ShoppingBag size={36} />
              <p>No orders yet. Start shopping!</p>
              <Link to="/" className="btn-primary">Explore Collection</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-card__header">
                    <div>
                      <div className="order-card__id">{order.id}</div>
                      <div className="order-card__date">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div>
                      <span className="order-card__status">{order.status}</span>
                    </div>
                    <div className="order-card__total">${order.total.toFixed(2)}</div>
                  </div>
                  <div className="order-card__items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-card__item">
                        <img src={item.image} alt={item.title}
                          onError={e => e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} />
                        <div className="order-card__item-info">
                          <div className="order-card__item-title">{item.title}</div>
                          <div className="order-card__item-meta">Qty: {item.qty} · ${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-card__footer">
                    <div className="order-card__address">📍 {order.address}</div>
                    <div className="order-card__payment">💳 Visa ••••{order.payment?.last4 || '4242'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">LUXE <span>✦</span></div>
            <p className="footer__tagline">
              Premium goods for those who appreciate the finer details.
              Crafted with intention, delivered with care.
            </p>
            <div className="footer__socials">
              {['IG', 'TW', 'PT', 'LI'].map(s => (
                <a key={s} href="#" className="footer__social">{s}</a>
              ))}
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-title">Shop</h4>
              <ul>
                <li><a href="#products">All Products</a></li>
                <li><a href="#new-arrivals">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Gift Cards</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Support</h4>
              <ul>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">Shipping Info</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Account</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/signup">Create Account</Link></li>
                <li><Link to="/cart">Your Cart</Link></li>
                <li><Link to="/account">Orders</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {year} LUXE Store. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer__payments">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(p => (
              <span key={p} className="footer__payment">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

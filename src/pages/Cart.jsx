import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, MapPin, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, cartCount, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState('cart'); // cart | address | payment | success
  const [address, setAddress] = useState({ name: user?.name || '', street: '', city: '', zip: '', country: 'US' });
  const [lastOrder, setLastOrder] = useState(null);

  const handlePlaceOrder = () => {
    const addr = `${address.name}, ${address.street}, ${address.city} ${address.zip}, ${address.country}`;
    const order = placeOrder(addr, { method: 'Visa', last4: '4242' });
    setLastOrder(order);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="cart-page">
        <div className="cart-success">
          <div className="success-icon"><Check size={32} /></div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-id">Order ID: <strong>{lastOrder?.id}</strong></p>
          <p className="success-total">Total charged: <strong>${lastOrder?.total.toFixed(2)}</strong></p>
          <p className="success-note">Estimated delivery: 2–4 business days. A confirmation has been saved to your account.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            <Link to="/account" className="btn-outline">View Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          {cartCount > 0 && <span className="cart-count">{cartCount} items</span>}
        </div>

        {/* Steps */}
        <div className="cart-steps">
          {['cart', 'address', 'payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={"cart-step" + (step === s ? ' cart-step--active' : '') + (['address','payment'].includes(step) && i === 0 ? ' cart-step--done' : '') + (step === 'payment' && i === 1 ? ' cart-step--done' : '')}>
                <div className="cart-step__num">{i + 1}</div>
                <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </div>
              {i < 2 && <div className="cart-step__line" />}
            </React.Fragment>
          ))}
        </div>

        {cart.length === 0 && step === 'cart' ? (
          <div className="cart-empty">
            <ShoppingBag size={48} />
            <h3>Your cart is empty</h3>
            <p>Discover our collection and add items you love</p>
            <Link to="/" className="btn-primary">Explore Collection</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-main">
              {/* Cart Items */}
              {step === 'cart' && (
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.title} className="cart-item__img"
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} />
                      <div className="cart-item__info">
                        <div className="cart-item__category">{item.category}</div>
                        <h3 className="cart-item__title">{item.title}</h3>
                        <div className="cart-item__price">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="cart-item__controls">
                        <div className="qty-control">
                          <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                        </div>
                        <div className="cart-item__subtotal">${(item.price * item.qty).toFixed(2)}</div>
                        <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Step */}
              {step === 'address' && (
                <div className="checkout-section">
                  <div className="checkout-section__header"><MapPin size={18} />Delivery Address</div>
                  <div className="checkout-form">
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
                      { key: 'street', label: 'Street Address', placeholder: '123 Main Street, Apt 4B' },
                      { key: 'city', label: 'City', placeholder: 'New York' },
                      { key: 'zip', label: 'ZIP Code', placeholder: '10001' },
                      { key: 'country', label: 'Country', placeholder: 'United States' },
                    ].map(f => (
                      <div className="form-group" key={f.key}>
                        <label className="form-label">{f.label}</label>
                        <input className="form-input" placeholder={f.placeholder}
                          value={address[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="checkout-section">
                  <div className="checkout-section__header"><CreditCard size={18} />Payment Details</div>
                  <div className="payment-card-demo">
                    <div className="pcd__chip">⬛</div>
                    <div className="pcd__number">•••• •••• •••• 4242</div>
                    <div className="pcd__row">
                      <div>
                        <div className="pcd__label">Card Holder</div>
                        <div className="pcd__value">{address.name || 'Demo User'}</div>
                      </div>
                      <div>
                        <div className="pcd__label">Expires</div>
                        <div className="pcd__value">12/28</div>
                      </div>
                      <div>
                        <div className="pcd__label">Network</div>
                        <div className="pcd__value">VISA</div>
                      </div>
                    </div>
                  </div>
                  <p className="payment-note">🔒 This is a demo checkout. No real payment is processed.</p>
                  <div className="checkout-address-review">
                    <MapPin size={14} />
                    <span>{address.street}, {address.city} {address.zip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-lines">
                <div className="summary-line"><span>Subtotal ({cartCount} items)</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="summary-line"><span>Shipping</span><span className="summary-free">Free</span></div>
                <div className="summary-line"><span>Tax (est.)</span><span>${(cartTotal * 0.08).toFixed(2)}</span></div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
              {step === 'cart' && (
                <button className="btn-primary summary-btn" onClick={() => setStep('address')} disabled={cart.length === 0}>
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              )}
              {step === 'address' && (
                <button className="btn-primary summary-btn"
                  onClick={() => setStep('payment')}
                  disabled={!address.name || !address.street || !address.city || !address.zip}>
                  Continue to Payment <ArrowRight size={16} />
                </button>
              )}
              {step === 'payment' && (
                <button className="btn-primary summary-btn" onClick={handlePlaceOrder}>
                  Place Order · ${(cartTotal * 1.08).toFixed(2)} <ArrowRight size={16} />
                </button>
              )}
              {step !== 'cart' && (
                <button className="btn-outline summary-btn-back" onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}>
                  ← Back
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Auth.css';

export default function Signup() {
  const { signup } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.ok) navigate('/');
    else setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>
      <div className="auth-card">
        <div className="auth-logo">LUXE <span>✦</span></div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the LUXE community</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" required placeholder="Jane Doe"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input className="form-input" type={show ? 'text' : 'password'} required placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" className="input-eye" onClick={() => setShow(v => !v)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : <><span>Create Account</span><ArrowRight size={16} /></>}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

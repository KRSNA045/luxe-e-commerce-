import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Auth.css';

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = login(form.email, form.password);
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
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input className="form-input" type={show ? 'text' : 'password'} required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" className="input-eye" onClick={() => setShow(v => !v)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={16} /></>}
          </button>
        </form>
        <p className="auth-switch">
          New to LUXE? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

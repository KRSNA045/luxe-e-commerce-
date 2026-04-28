import React, { useState } from 'react';
import { Mail, Send, Phone, MapPin, ArrowRight } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', message: '' }); }, 3000);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__left">
            <span className="section-label">Stay Connected</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
              Let's Stay <em>In Touch</em>
            </h2>
            <p className="contact__desc">
              Questions, collaborations, or just want to say hello?
              We reply within 24 hours to every message.
            </p>

            <div className="contact__info">
              <div className="contact__info-item">
                <div className="contact__info-icon"><Mail size={16} /></div>
                <div>
                  <div className="contact__info-label">Email</div>
                  <div className="contact__info-value">hello@luxestore.com</div>
                </div>
              </div>
              <div className="contact__info-item">
                <div className="contact__info-icon"><Phone size={16} /></div>
                <div>
                  <div className="contact__info-label">Phone</div>
                  <div className="contact__info-value">+1 (888) 595-LUXE</div>
                </div>
              </div>
              <div className="contact__info-item">
                <div className="contact__info-icon"><MapPin size={16} /></div>
                <div>
                  <div className="contact__info-label">Studio</div>
                  <div className="contact__info-value">New York, NY 10001</div>
                </div>
              </div>
            </div>

            <div className="contact__newsletter">
              <div className="contact__newsletter-title">Newsletter</div>
              <div className="contact__newsletter-desc">Early access. No spam. Ever.</div>
              <div className="contact__newsletter-form">
                <input type="email" placeholder="your@email.com" className="newsletter-input" />
                <button className="newsletter-btn"><ArrowRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="contact__right">
            <form className="contact__form" onSubmit={handleSubmit}>
              <h3 className="contact__form-title">Send a Message</h3>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input form-textarea"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  rows={5}
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="btn-primary contact__submit" disabled={sent}>
                {sent ? '✓ Message Sent!' : (
                  <><Send size={15} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

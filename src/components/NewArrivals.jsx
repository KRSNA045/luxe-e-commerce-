import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import './NewArrivals.css';

export default function NewArrivals() {
  const { newArrivals } = useStore();

  return (
    <section className="new-arrivals" id="new-arrivals">
      <div className="new-arrivals__bg">
        <div className="na-orb" />
      </div>

      <div className="container">
        <div className="new-arrivals__header">
          <span className="section-label">
            <Sparkles size={12} style={{ marginLeft: '-0.25rem' }} />
            Fresh In
          </span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
            New <em>Arrivals</em>
          </h2>
          <p className="new-arrivals__subtitle">
            The latest additions to our ever-evolving curation
          </p>
          <div className="gold-divider" />
        </div>

        <div className="new-arrivals__marquee-wrap">
          <div className="new-arrivals__marquee">
            {['New Season', '✦', 'Just Landed', '✦', 'Fresh Drops', '✦', 'New Season', '✦', 'Just Landed', '✦', 'Fresh Drops', '✦'].map((t, i) => (
              <span key={i} className={t === '✦' ? 'marquee-dot' : 'marquee-text'}>{t}</span>
            ))}
          </div>
        </div>

        <div className="new-arrivals__grid">
          {newArrivals.slice(0, 4).map((product, i) => (
            <div
              key={product.id}
              className="new-arrivals__item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <ProductCard product={product} badge="New" />
            </div>
          ))}
          {newArrivals.length === 0 && [...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card" style={{ aspectRatio: '1' }}>
              <div className="skeleton skeleton--img" style={{ height: '100%' }} />
            </div>
          ))}
        </div>

        <div className="new-arrivals__cta">
          <button className="btn-primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
            View All Products <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMouseMove = (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      hero.style.setProperty('--mouse-x', `${x * 100}%`);
      hero.style.setProperty('--mouse-y', `${y * 100}%`);
    };
    hero.addEventListener('mousemove', onMouseMove);
    return () => hero.removeEventListener('mousemove', onMouseMove);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" ref={heroRef} id="hero">
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
      </div>

      <div className="hero__content container">
        <div className="hero__eyebrow">
          <span className="section-label">New Season Collection</span>
          <div className="hero__stars">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
            <span>Trusted by 12,000+</span>
          </div>
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line">Crafted for</span>
          <span className="hero__title-line hero__title-accent">Those Who</span>
          <span className="hero__title-line hero__title-italic">Appreciate Detail</span>
        </h1>

        <p className="hero__desc">
          Each piece in our collection is selected for its exceptional quality,
          ethical sourcing, and timeless design. Luxury should feel effortless.
        </p>

        <div className="hero__actions">
          <button className="btn-primary hero__cta" onClick={scrollToProducts}>
            Explore Collection <ArrowRight size={16} />
          </button>
          <button className="btn-outline hero__cta-2" onClick={() => document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' })}>
            New Arrivals
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">500+</span>
            <span className="hero__stat-label">Curated Products</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">48h</span>
            <span className="hero__stat-label">Global Delivery</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">100%</span>
            <span className="hero__stat-label">Authentic Goods</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>

      <div className="hero__floating-card">
        <div className="floating-card__dot" />
        <div>
          <div className="floating-card__label">Latest Drop</div>
          <div className="floating-card__title">Titanium Series</div>
        </div>
        <div className="floating-card__price">From $165</div>
      </div>
    </section>
  );
}

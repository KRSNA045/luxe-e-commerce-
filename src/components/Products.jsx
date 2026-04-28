import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import './Products.css';

const CATEGORIES = ['All'];

export default function Products() {
  const { products, loadingProducts } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="products-section__header">
          <div>
            <span className="section-label">Our Collection</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
              Explore the <em>Catalogue</em>
            </h2>
          </div>
          <p className="products-section__desc">
            Thoughtfully sourced items from the world's finest makers.
          </p>
        </div>

        {/* Category Filter */}
        <div className="products-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loadingProducts ? (
          <div className="products-skeleton-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton--img" />
                <div className="skeleton-info">
                  <div className="skeleton skeleton--line skeleton--short" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line skeleton--medium" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="products-load-more">
                <button
                  className="btn-outline"
                  onClick={() => setVisibleCount(v => v + 8)}
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

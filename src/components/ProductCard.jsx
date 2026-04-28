import React, { useState } from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './ProductCard.css';

export default function ProductCard({ product, badge }) {
  const { addToCart } = useStore();
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 1000);
  };

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
  const rating = product.rating?.rate || 4.5;
  const count = product.rating?.count || 0;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'; }}
        />
        <div className="product-card__overlay">
          <button className="product-card__add-btn" onClick={handleAdd} disabled={adding}>
            <ShoppingBag size={16} />
            {adding ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
        {badge && <span className="product-card__badge">{badge}</span>}
        <button
          className={`product-card__heart ${liked ? 'product-card__heart--active' : ''}`}
          onClick={() => setLiked(v => !v)}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card__info">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__bottom">
          <div className="product-card__rating">
            <Star size={11} fill="currentColor" />
            <span>{rating}</span>
            <span className="product-card__count">({count})</span>
          </div>
          <div className="product-card__price">${price}</div>
        </div>
      </div>
    </div>
  );
}

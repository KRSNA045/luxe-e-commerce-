import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(null);

const FAKE_PRODUCTS_FALLBACK = [
  { id: 1, title: "Obsidian Leather Tote", price: 285, category: "Bags", rating: { rate: 4.8, count: 124 }, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", description: "Hand-stitched full-grain leather tote with obsidian hardware. A timeless statement piece.", isNew: true },
  { id: 2, title: "Merino Wool Overshirt", price: 195, category: "Clothing", rating: { rate: 4.6, count: 89 }, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", description: "Ultra-fine merino wool in a relaxed silhouette. Naturally temperature-regulating.", isNew: true },
  { id: 3, title: "Ceramic Pour-Over Set", price: 120, category: "Home", rating: { rate: 4.9, count: 203 }, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", description: "Hand-thrown ceramic pour-over dripper with matching server. Made in small batches.", isNew: false },
  { id: 4, title: "Titanium Card Wallet", price: 165, category: "Accessories", rating: { rate: 4.7, count: 156 }, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80", description: "CNC-machined grade-5 titanium. Holds up to 12 cards. Weighs 28g.", isNew: true },
  { id: 5, title: "Silk Slip Dress", price: 340, category: "Clothing", rating: { rate: 4.5, count: 67 }, image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&q=80", description: "Pure 22-momme silk charmeuse. Hand-finished hems. Dry clean only.", isNew: false },
  { id: 6, title: "Sandalwood Diffuser", price: 85, category: "Home", rating: { rate: 4.8, count: 312 }, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&q=80", description: "Cold-pressed sandalwood & bergamot. 60-hour burn time in hand-blown glass.", isNew: false },
  { id: 7, title: "Linen Blazer", price: 420, category: "Clothing", rating: { rate: 4.9, count: 45 }, image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=400&q=80", description: "Belgian linen, unstructured fit. Dry-cleaned and stone-washed for a lived-in feel.", isNew: true },
  { id: 8, title: "Marble Pen Stand", price: 78, category: "Home", rating: { rate: 4.6, count: 178 }, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80", description: "Solid Carrara marble, brushed brass inlay. Each piece unique.", isNew: false },
];

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_user')) || null; } catch { return null; }
  });
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart')) || []; } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_orders')) || []; } catch { return []; }
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch products from FakeStore API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        const enriched = data.map((p, i) => ({
          ...p,
          isNew: i < 4,
          image: p.image || FAKE_PRODUCTS_FALLBACK[i % FAKE_PRODUCTS_FALLBACK.length].image,
        }));
        setProducts(enriched);
      } catch {
        setProducts(FAKE_PRODUCTS_FALLBACK);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('luxe_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('luxe_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    if (user) localStorage.setItem('luxe_user', JSON.stringify(user));
    else localStorage.removeItem('luxe_user');
  }, [user]);

  const showToast = (msg, icon = '✓') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.title.slice(0, 30)}... added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (address, payment) => {
    const order = {
      id: 'LX' + Date.now(),
      items: [...cart],
      address,
      payment,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      date: new Date().toISOString(),
      status: 'Confirmed',
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    showToast(`Order ${order.id} placed successfully!`, '🎉');
    return order;
  };

  const login = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('luxe_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { ok: true }; }
    return { ok: false, error: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('luxe_users') || '[]');
    if (users.find(u => u.email === email)) return { ok: false, error: 'Email already exists' };
    const newUser = { id: Date.now(), name, email, password };
    localStorage.setItem('luxe_users', JSON.stringify([...users, newUser]));
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => { setUser(null); showToast('Logged out successfully'); };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <StoreContext.Provider value={{
      user, login, signup, logout,
      products, loadingProducts,
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal,
      orders, placeOrder,
      newArrivals,
      toast, showToast,
      chatOpen, setChatOpen,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

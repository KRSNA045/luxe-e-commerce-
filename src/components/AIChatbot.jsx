import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, ShoppingBag, CreditCard, MapPin, Package, Sparkles, Minimize2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './AIChatbot.css';

const SYSTEM_PROMPT = `You are LUXE Assistant — an ultra-premium AI shopping concierge for LUXE Store. You are elegant, helpful, and efficient.

You can help customers:
1. Find products from the store catalog
2. Add items to their cart (use action: ADD_TO_CART)
3. Set delivery address (use action: SET_ADDRESS)
4. Process payment (use action: PROCESS_PAYMENT)
5. Place orders (use action: PLACE_ORDER)
6. Show cart contents (use action: SHOW_CART)
7. Answer questions about products, shipping, returns

IMPORTANT: When a user says "buy X", "order X", "get me X", "add X to cart", or similar, you MUST:
1. Search for the product in the catalog provided
2. Confirm what you found
3. If no address saved, ask for delivery address
4. Confirm payment (static demo: Visa ending 4242)
5. Place the order using PLACE_ORDER action

Always respond with ONLY valid JSON in this exact format (no extra text):
{"message":"Your friendly response text","action":null,"data":{}}

Action values: null, "ADD_TO_CART", "SET_ADDRESS", "PROCESS_PAYMENT", "PLACE_ORDER", "SHOW_CART"

For ADD_TO_CART: data = {"productId": number, "qty": 1}
For SET_ADDRESS: data = {"address": "full address string"}
For PLACE_ORDER: data = {"address": "full address string", "paymentLast4": "4242"}
For PROCESS_PAYMENT: data = {"last4": "4242", "method": "Visa"}
For SHOW_CART: data = {}

Be warm, refined, and concise. Use luxury brand tone.`;

export default function AIChatbot() {
  const { chatOpen, setChatOpen, products, cart, addToCart, placeOrder, cartTotal, cartCount } = useStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to LUXE. I'm your personal shopping concierge. I can discover products, manage your cart, and place orders — simply tell me what you're looking for.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatOpen && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, chatOpen, minimized]);

  useEffect(() => {
    if (chatOpen && !minimized) inputRef.current?.focus();
  }, [chatOpen, minimized]);

  const handleAction = (action, data) => {
    if (action === 'ADD_TO_CART') {
      const pid = Number(data.productId);
      const product = products.find(p => p.id === pid);
      if (product) {
        addToCart(product, data.qty || 1);
        return `Added **${product.title}** to your cart.`;
      }
      return 'Product not found in catalog.';
    }
    if (action === 'SET_ADDRESS') {
      setAddress(data.address);
      return null;
    }
    if (action === 'PLACE_ORDER') {
      if (cart.length === 0) return 'Your cart is empty — please add items first.';
      const addr = data.address || address || '123 Demo Street, New York, NY 10001';
      const order = placeOrder(addr, { method: 'Visa', last4: data.paymentLast4 || '4242' });
      return `Order **${order.id}** confirmed! Total: **$${order.total.toFixed(2)}**. Estimated delivery: 2–4 business days.`;
    }
    if (action === 'SHOW_CART') {
      if (cart.length === 0) return 'Your cart is currently empty.';
      const items = cart.map(i => `• ${i.title} × ${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join('\n');
      return `Your cart (${cartCount} items, **$${cartTotal.toFixed(2)}** total):\n${items}`;
    }
    return null;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = {
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const catalog = products.slice(0, 20).map(p => ({ id: p.id, title: p.title, price: p.price, category: p.category }));
      const cartSummary = cart.length > 0
        ? `Cart has: ${cart.map(i => i.title + ' x' + i.qty).join(', ')}. Total: $${cartTotal.toFixed(2)}`
        : 'Cart is empty';

      const fullSystem = `${SYSTEM_PROMPT}\n\nProduct catalog:\n${JSON.stringify(catalog)}\n\nCurrent cart: ${cartSummary}\nSaved address: ${address || 'none'}`;

      const history = messages.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: fullSystem,
          messages: [...history, { role: 'user', content: text }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.[0]?.text || '{"message":"Sorry, something went wrong.","action":null,"data":{}}';

      let parsed;
      try {
        const match = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(match ? match[0] : raw);
      } catch {
        parsed = { message: raw.replace(/[{}]/g, ''), action: null, data: {} };
      }

      const actionResult = parsed.action ? handleAction(parsed.action, parsed.data || {}) : null;
      const finalMessage = actionResult ? `${parsed.message}\n\n${actionResult}` : parsed.message;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: finalMessage || 'How else can I assist you?',
        action: parsed.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Show Cart 🛒', msg: 'Show my cart' },
    { label: 'New Arrivals ✨', msg: 'What are the new arrivals?' },
    { label: 'Buy Something 🛍️', msg: 'I want to buy something' },
    { label: 'Place Order 📦', msg: 'Place my order now' },
  ];

  if (!chatOpen) return null;

  return (
    <div className={"chatbot" + (minimized ? " chatbot--minimized" : "")}>
      <div className="chatbot__header">
        <div className="chatbot__header-left">
          <div className="chatbot__avatar">
            <Bot size={16} />
            <span className="chatbot__online" />
          </div>
          <div>
            <div className="chatbot__name">LUXE Assistant</div>
            <div className="chatbot__status">AI Concierge · Always available</div>
          </div>
        </div>
        <div className="chatbot__header-actions">
          <button className="chatbot__ctrl-btn" onClick={() => setMinimized(v => !v)}><Minimize2 size={14} /></button>
          <button className="chatbot__ctrl-btn" onClick={() => setChatOpen(false)}><X size={14} /></button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="chatbot__context-bar">
            <div className="chatbot__ctx-item">
              <ShoppingBag size={11} />
              <span>{cartCount} items · ${cartTotal.toFixed(2)}</span>
            </div>
            {address && (
              <div className="chatbot__ctx-item">
                <MapPin size={11} />
                <span>{address.slice(0, 28)}{address.length > 28 ? '…' : ''}</span>
              </div>
            )}
          </div>

          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={"chatbot__msg chatbot__msg--" + msg.role}>
                {msg.role === 'assistant' && (
                  <div className="chatbot__msg-avatar"><Sparkles size={12} /></div>
                )}
                <div className="chatbot__msg-bubble">
                  <div className="chatbot__msg-text">
                    {msg.content.split('\n').map((line, j, arr) => (
                      <React.Fragment key={j}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={k}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                        {j < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {msg.action && (
                    <div className="chatbot__msg-action-tag">
                      {msg.action === 'ADD_TO_CART' && <><ShoppingBag size={10} /> Added to cart</>}
                      {msg.action === 'PLACE_ORDER' && <><Package size={10} /> Order placed</>}
                      {msg.action === 'PROCESS_PAYMENT' && <><CreditCard size={10} /> Payment processed</>}
                      {msg.action === 'SET_ADDRESS' && <><MapPin size={10} /> Address saved</>}
                      {msg.action === 'SHOW_CART' && <><ShoppingBag size={10} /> Cart displayed</>}
                    </div>
                  )}
                  <div className="chatbot__msg-time">{msg.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot__msg chatbot__msg--assistant">
                <div className="chatbot__msg-avatar"><Sparkles size={12} /></div>
                <div className="chatbot__msg-bubble chatbot__msg-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot__quick">
            {quickActions.map(qa => (
              <button key={qa.label} className="chatbot__quick-btn"
                onClick={() => { setInput(qa.msg); setTimeout(() => { sendMessage(); }, 50); }}>
                {qa.label}
              </button>
            ))}
          </div>

          <div className="chatbot__input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="chatbot__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask me to buy, add, or find anything…"
              disabled={loading}
            />
            <button className="chatbot__send" onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

# LUXE — Premium E-Commerce Store

A full-featured Vite + React e-commerce app with an AI-powered shopping concierge.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Features

- **4 Main Sections**: Hero, Products (API-powered), New Arrivals, Contact
- **Auth**: Sign Up / Sign In — all stored in localStorage
- **Cart**: Add, remove, update quantities
- **Checkout**: 3-step flow — Cart → Address → Payment → Order confirmation
- **AI Chatbot**: Powered by Claude API — understands natural language to:
  - Add items to cart
  - Set delivery address
  - Process (demo) payment
  - Place orders end-to-end
- **Product API**: Fetches from https://fakestoreapi.com with graceful fallback
- **Premium Dark Luxury aesthetic**: Cormorant Garamond + DM Sans, gold accents

## AI Chatbot Examples

Try saying:
- "Buy me the most expensive item"
- "Add a wallet to my cart"
- "What's in my cart?"
- "I want to order something for under $100"
- "Place my order, ship to 123 Main St, New York NY 10001"

## Tech Stack

- Vite 5 + React 18
- React Router v6
- Lucide React (icons)
- FakeStore API (products)
- Claude Sonnet API (AI chatbot)
- localStorage (all persistence)

## Project Structure

```
src/
  components/
    Navbar.jsx/.css       — Fixed top nav with cart count & AI toggle
    Hero.jsx/.css         — Full-screen animated hero
    Products.jsx/.css     — API-powered product grid with category filter
    ProductCard.jsx/.css  — Individual product card
    NewArrivals.jsx/.css  — Highlighted new products with marquee
    Contact.jsx/.css      — Contact form + newsletter
    Footer.jsx/.css       — Full site footer
    AIChatbot.jsx/.css    — AI shopping assistant (Claude API)
  pages/
    Home.jsx              — Assembles all 4 sections
    Login.jsx             — Sign in page
    Signup.jsx            — Create account page
    Cart.jsx/.css         — Cart + 3-step checkout
    Account.jsx/.css      — Order history
    Auth.css              — Shared auth styles
  context/
    StoreContext.jsx      — Global state (cart, user, orders, products)
  main.jsx                — React entry
  index.css               — Global styles + CSS variables
```

## Notes

- Payment is intentionally static/demo (Visa ****4242) — no real charges
- The Claude API key is handled by the platform (no key needed in code)
- All user data, cart, and orders persist in localStorage

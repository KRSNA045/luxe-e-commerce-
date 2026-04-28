import React from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';
import NewArrivals from '../components/NewArrivals';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Products />
      <NewArrivals />
      <Contact />
    </main>
  );
}

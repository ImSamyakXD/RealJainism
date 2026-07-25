import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChaturmasClient from '@/app/chaturmas/components/ChaturmasClient';

export const metadata = {
  title: 'Chaturmas 2025 — Muni, Aryika & Sadhu Locations | RealJainism',
  description: 'Find where Jain Digambar Acharyas, Munis, Aryikas, Kshullaks and Kshullikas are doing Chaturmas 2025 — searchable by name, state and city.',
};

export default function ChaturmasPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <ChaturmasClient />
      </main>
      <Footer />
    </>
  );
}

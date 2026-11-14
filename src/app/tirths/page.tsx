export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TirthsClient from './components/TirthsClient';

export const metadata = {
  title: 'Jain Tirth & Temple Directory — RealJainism',
  description: 'Explore verified Jain pilgrimage sites across India — Siddh Kshetras, Atishay Kshetras, and historic temple complexes with maps, darshan timings, and travel guides.',
};

export default function TirthsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-background">
        <TirthsClient />
      </main>
      <Footer />
    </>
  );
}

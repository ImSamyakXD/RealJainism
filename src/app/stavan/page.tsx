import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StavanClient from '@/app/stavan/components/StavanClient';

export const metadata = {
  title: 'Stavan, Bhajan & Stotra — RealJainism',
  description: 'A collection of Jain Stavan, Bhajan and Stotra lyrics for daily devotion and recitation.',
};

export default function StavanPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <StavanClient />
      </main>
      <Footer />
    </>
  );
}

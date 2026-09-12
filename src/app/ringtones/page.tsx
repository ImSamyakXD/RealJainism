import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RingtonesClient from './components/RingtonesClient';

export const metadata = {
  title: 'Jain Devotional Ringtones & Mantras — RealJainism',
  description: 'Download peaceful Jain ringtones, Navkar Mantra tunes, Bhaktamar Stotra chimes, and temple bells for personal use.',
};

export default function RingtonesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-background">
        <RingtonesClient />
      </main>
      <Footer />
    </>
  );
}

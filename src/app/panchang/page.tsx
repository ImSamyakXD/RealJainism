import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PanchangClient from '@/app/panchang/components/PanchangClient';

export const metadata = {
  title: 'Aaj Ka Panchang — RealJainism',
  description: 'Daily Jain panchang with tithi, paksha, Hindi month, sunrise, sunset, and tirthankar kalyanak.',
};

export default function PanchangPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PanchangClient />
      </main>
      <Footer />
    </>
  );
}
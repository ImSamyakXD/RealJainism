import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubmitTirthClient from './components/SubmitTirthClient';

export const metadata = {
  title: 'Submit a Tirth Kshetra — RealJainism',
  description:
    'Contribute to the comprehensive directory of Digambar Jain pilgrimage sites, Atishay Kshetras, Siddha Kshetras, and ancient basadis across Bharat.',
};

export default function SubmitTirthPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <SubmitTirthClient />
      </main>
      <Footer />
    </div>
  );
}

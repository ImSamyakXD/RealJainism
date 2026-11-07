import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportTirthClient from './components/ReportTirthClient';

export const metadata = {
  title: 'Report Tirth Issue — RealJainism',
  description: 'Report inaccurate information, phone numbers, or problem with a Digambar Jain Tirth Kshetra.',
};

export default function ReportTirthPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <ReportTirthClient />
      </main>
      <Footer />
    </div>
  );
}

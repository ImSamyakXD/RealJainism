import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WallpapersClient from '@/app/wallpapers/components/WallpapersClient';

export const metadata = {
  title: 'Jain Wallpapers & Ringtones — RealJainism',
  description: 'Download beautiful Jain devotional wallpapers and ringtones. Free for personal use.',
};

export default function WallpapersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <WallpapersClient />
      </main>
      <Footer />
    </>
  );
}
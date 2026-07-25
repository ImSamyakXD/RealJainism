'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Panchang', href: '/panchang' },
  { label: 'Chaturmas', href: '/chaturmas' },
  { label: 'Wallpapers', href: '/wallpapers' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border' :'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="RealJainism Home">
            <AppLogo
              src="/assets/images/logo-1784737155365.png"
              size={36}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-black text-lg tracking-tight text-foreground hidden sm:block">
              Real<span className="text-primary">Jainism</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link?.label}
              </Link>
            ))}
            <Link
              href="/#community"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200"
            >
              Join Community
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full border border-border text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={menuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
          </button>
        </div>
      </header>
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
              >
                {link?.label}
              </Link>
            ))}
            <Link
              href="/#community"
              onClick={() => setMenuOpen(false)}
              className="mt-4 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-accent transition-all"
            >
              Join Community
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
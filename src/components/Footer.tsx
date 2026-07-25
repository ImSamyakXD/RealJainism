import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="bg-muted/50 border border-border rounded-xl px-5 py-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
            <strong className="text-foreground">Disclaimer:</strong> All information on RealJainism — including temple details, chaturmas locations, muni/aryika information, wallpapers and devotional content — has been collected from publicly available sources and contributions from the Jain community. We make every effort to keep it accurate, but errors or outdated details may remain. This content is shared purely as a service to the community, with no intention of causing harm or disrespect to any individual, sadhu, sadhvi, temple or organization. RealJainism does not monetize this data in any way — there are no ads, subscriptions, or commercial use of this content, and the organization does not earn any money from it. If you notice an error or would like something corrected or removed, please reach out via our{' '}
            <Link href="/#contact" className="text-primary underline hover:text-accent transition-colors">Contact page</Link>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <AppLogo src="/assets/images/logo-1784737155365.png" size={28} />
          <span className="font-black text-sm tracking-tight text-foreground">
            Real<span className="text-primary">Jainism</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground flex-wrap justify-center">
          <Link href="/" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Home</Link>
          <Link href="/panchang" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Panchang</Link>
          <Link href="/chaturmas" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Chaturmas</Link>
          <Link href="/wallpapers" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Wallpapers</Link>
          <a href="https://www.instagram.com/real__jainism/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Instagram</a>
          <Link href="/#contact" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Contact</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/#contact" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Privacy</Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          © 2026 RealJainism
        </p>
      </div>
    </footer>
  );
}
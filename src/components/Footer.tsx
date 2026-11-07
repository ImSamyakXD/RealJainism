'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('contact.realjainism@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-border bg-[#0B0805]">
      {/* Downside Support & Disclaimer Cards */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Contact & Support Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1C140C] via-[#161009] to-[#0E0B07] border border-amber-900/40 hover:border-primary/50 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-rose-500 text-base sm:text-lg animate-pulse select-none" aria-hidden="true">❤️</span>
                <h3 className="font-mono text-sm sm:text-base font-bold text-foreground tracking-tight">
                  Contact &amp; Support
                </h3>
                <span className="ml-auto text-[9px] uppercase font-black tracking-widest text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full">
                  Community Seva
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                Maintained at personal expense. To support server costs or collaborate:
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-950/60 flex flex-wrap items-center justify-between gap-2.5 bg-[#120D08]/90 p-3 rounded-xl border border-amber-900/30">
              <a
                href="mailto:contact.realjainism@gmail.com"
                className="flex items-center gap-2.5 text-primary hover:text-accent font-mono text-xs sm:text-sm font-bold transition-colors group/link truncate"
                title="Send email to RealJainism"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary group-hover/link:scale-105 transition-transform">
                  <Icon name="EnvelopeIcon" size={15} />
                </div>
                <span className="underline-offset-4 group-hover/link:underline truncate">contact.realjainism@gmail.com</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-[11px] font-bold text-primary transition-all flex-shrink-0 active:scale-95"
                aria-label="Copy email address"
              >
                <Icon name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={13} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Disclaimer Box */}
          <div className="lg:col-span-7 bg-[#140F0A]/70 border border-border/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-center">
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              <strong className="text-foreground">Disclaimer:</strong> All information on RealJainism — including temple details, chaturmas locations, muni/aryika information, wallpapers and devotional content — has been collected from publicly available sources and contributions from the Jain community. We make every effort to keep it accurate, but errors or outdated details may remain. This content is shared purely as a service to the community, with no intention of causing harm or disrespect to any individual, sadhu, sadhvi, temple or organization. RealJainism does not monetize this data in any way — there are no ads, subscriptions, or commercial use of this content, and the organization does not earn any money from it. If you notice an error or would like something corrected or removed, please reach out via our{' '}
              <Link href="/#contact" className="text-primary underline hover:text-accent transition-colors">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/40 mt-4">
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
          <Link href="/tirths" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Tirths</Link>
          <Link href="/chaturmas" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Chaturmas</Link>
          <Link href="/wallpapers" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Wallpapers</Link>
          <a href="https://www.instagram.com/real__jainism/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Instagram</a>
          <Link href="/#contact" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Contact</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/#contact" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Privacy</Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/admin" className="hover:text-primary transition-colors min-h-[44px] flex items-center text-primary/80 font-bold">Admin Portal</Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          © 2026 RealJainism
        </p>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Atmospheric background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="blob-primary absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-pulse_slow" />
        <div className="blob-accent absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full animate-pulse_slow" style={{ animationDelay: '2s' }} />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Top label */}
        <div className="mb-8 sm:mb-12">
          <span className="text-motto text-primary opacity-70 tracking-[0.3em]">
            जय जिनेन्द्र
          </span>
        </div>

        {/* Hero grid: text left, image right */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Typography */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-8">
            <h1 className="text-hero-xl text-foreground uppercase">
              <span className="block gold-gradient-text">Real</span>
              <span className="block text-foreground/90">Jainism</span>
            </h1>

            {/* Sanskrit motto */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <p className="text-base sm:text-lg font-bold text-primary leading-relaxed">
                सम्यग्दर्शनज्ञानचारित्राणिमोक्षमार्ग:
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-widest">
                Right Vision · Right Knowledge · Right Conduct — The Path to Liberation
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-lg">
              Your daily Jain companion — panchang, tirthankar kalyanaks, wallpapers, ringtones, and a growing community of Shravak and Shravikas.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/panchang"
                className="bg-primary text-primary-foreground px-7 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200 shadow-lg">

                📅 Aaj Ka Panchang
              </Link>
              <Link
                href="/#community"
                className="border border-primary text-primary px-7 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all duration-200">

                Join Community
              </Link>
            </div>

            {/* Quick stat strip */}
            <div className="flex gap-8 pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-black text-primary">24 Tirthankar</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kalyanaks Tracked</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">Daily</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Panchang Updates</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">Free</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Always & Forever</p>
              </div>
            </div>
          </div>

          {/* Right: Devotional image */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end reveal reveal-delay-2">
            <div className="relative w-full max-w-sm lg:max-w-full">
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden saffron-glow border border-primary/20 relative">
                <AppImage
                  src="https://i.pinimg.com/736x/85/c7/7d/85c77d4a894e31560e7eec9675732e9e.jpg"
                  alt="Serene Jain temple interior with golden light filtering through ornate stone lattice windows, warm amber tones, deep shadows"
                  fill
                  className="object-cover"
                  priority />

                {/* Gradient scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                {/* Bottom caption */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                    Explore Jainism
                  </p>
                  <p className="text-foreground text-sm font-medium mt-1">
                    Panchang · Wallpapers · Ringtones
                  </p>
                </div>
              </div>
              {/* Decorative ring */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-full animate-float" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-primary/15 rounded-full animate-float" style={{ animationDelay: '3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary animate-pulse" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Scroll</p>
      </div>
    </section>);

}
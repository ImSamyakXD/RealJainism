import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const features = [
  {
    icon: 'CalendarDaysIcon',
    label: 'Panchang',
    title: 'Aaj Ka Panchang',
    description: 'Daily tithi, paksha, Hindi month, sunrise & sunset — with tirthankar kalyanak when applicable.',
    href: '/panchang',
    cta: 'View Today',
    span: 'lg:col-span-2 lg:row-span-2',
    large: true,
  },
  {
    icon: 'PhotoIcon',
    label: 'Wallpapers',
    title: 'Jain Wallpapers',
    description: 'Beautiful devotional wallpapers for your phone and desktop.',
    href: '/wallpapers',
    cta: 'Browse Gallery',
    span: 'lg:col-span-1',
    large: false,
  },
  {
    icon: 'MusicalNoteIcon',
    label: 'Ringtones',
    title: 'Jain Ringtones',
    description: 'Devotional ringtones and stavan audio for your daily use.',
    href: '/wallpapers#ringtones',
    cta: 'Listen Now',
    span: 'lg:col-span-1',
    large: false,
  },
  {
    icon: 'BuildingLibraryIcon',
    label: 'Chaturmas',
    title: 'Chaturmas 2025',
    description: 'Find where Acharyas, Munis, Aryikas, Kshullaks & Kshullikas are doing Chaturmas — searchable by name, state and city.',
    href: '/chaturmas',
    cta: 'Find Chaturmas',
    span: 'lg:col-span-2',
    large: false,
  },
  {
    icon: 'MapIcon',
    label: 'Temples',
    title: 'Jain Tirth & Temples',
    description: 'A directory of Jain Tirth Kshetras and temples across India — coming soon.',
    href: '/#temples',
    cta: 'Coming Soon',
    span: 'lg:col-span-2',
    large: false,
    comingSoon: true,
  },
  {
    icon: 'SparklesIcon',
    label: 'Stavan',
    title: 'Stavan, Bhajan & Stotra',
    description: 'A collection of devotional lyrics for daily recitation — coming soon.',
    href: '/#stavan',
    cta: 'Coming Soon',
    span: 'lg:col-span-2',
    large: false,
    comingSoon: true,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 reveal">
          <p className="text-motto text-primary mb-3 opacity-70">Explore</p>
          <h2 className="text-section-xl text-foreground uppercase">
            Everything <br />
            <span className="gold-gradient-text">Jain.</span>
          </h2>
        </div>

        {/* BENTO GRID AUDIT
          Cards: [Panchang, Wallpapers, Ringtones, Chaturmas, Temples, Stavan] — 6 cards
          Grid: 4-col desktop
          Row 1: [col-1+2: Panchang rs-2] [col-3: Wallpapers] [col-4: Ringtones]
          Row 2: [col-1+2: Panchang (cont)] [col-3+4: Chaturmas]
          Row 3: [col-1+2: Temples] [col-3+4: Stavan]
          Placed 6/6 ✓
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border overflow-hidden rounded-2xl">
          {/* Card: Panchang — col-span-2 row-span-2 */}
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-card p-8 flex flex-col justify-between min-h-[320px] lg:min-h-[480px] card-hover reveal group relative overflow-hidden">
            <div className="absolute inset-0 blob-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="CalendarDaysIcon" size={24} className="text-primary" />
                </div>
                <span className="text-motto text-primary opacity-70">Panchang</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground leading-tight mb-4">
                Aaj Ka <br />Panchang
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-sm">
                Daily tithi, paksha, Hindi month, sunrise & sunset — with tirthankar kalyanak when applicable. Updated every day.
              </p>
            </div>
            <div className="relative z-10 mt-8">
              <Link
                href="/panchang"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200"
              >
                View Today
                <Icon name="ArrowRightIcon" size={14} />
              </Link>
            </div>
          </div>

          {/* Card: Wallpapers */}
          <div className="bg-card p-6 sm:p-8 flex flex-col justify-between min-h-[220px] card-hover reveal reveal-delay-1 group relative overflow-hidden">
            <div className="absolute inset-0 blob-accent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="PhotoIcon" size={20} className="text-primary" />
              </div>
              <p className="text-motto text-primary opacity-70 mb-2">Wallpapers</p>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight mb-2">
                Jain Wallpapers
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                Beautiful devotional wallpapers for phone and desktop.
              </p>
            </div>
            <Link
              href="/wallpapers"
              className="relative z-10 mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
            >
              Browse <Icon name="ArrowRightIcon" size={12} />
            </Link>
          </div>

          {/* Card: Ringtones */}
          <div className="bg-card p-6 sm:p-8 flex flex-col justify-between min-h-[220px] card-hover reveal reveal-delay-2 group relative overflow-hidden">
            <div className="absolute inset-0 blob-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="MusicalNoteIcon" size={20} className="text-primary" />
              </div>
              <p className="text-motto text-primary opacity-70 mb-2">Ringtones</p>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight mb-2">
                Jain Ringtones
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                Devotional ringtones and stavan audio for daily use.
              </p>
            </div>
            <Link
              href="/wallpapers#ringtones"
              className="relative z-10 mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
            >
              Listen <Icon name="ArrowRightIcon" size={12} />
            </Link>
          </div>

          {/* Card: Chaturmas — col-span-2 */}
          <div className="sm:col-span-2 bg-card p-6 sm:p-8 flex flex-col justify-between min-h-[180px] card-hover reveal reveal-delay-3 group relative overflow-hidden">
            <div className="absolute inset-0 blob-accent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon name="BuildingLibraryIcon" size={20} className="text-primary" />
                  </div>
                  <p className="text-motto text-primary opacity-70">Chaturmas</p>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight mb-2">
                  Chaturmas 2025
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium max-w-xs">
                  Find where Acharyas, Munis, Aryikas, Kshullaks & Kshullikas are doing Chaturmas — searchable by name, state and city.
                </p>
              </div>
              <Link
                href="/chaturmas"
                className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200"
              >
                Find Chaturmas
                <Icon name="ArrowRightIcon" size={14} />
              </Link>
            </div>
          </div>

          {/* Card: Jain Tirth & Temples — col-span-2 — coming soon */}
          <div className="sm:col-span-2 bg-card p-6 sm:p-8 flex flex-col justify-between min-h-[180px] card-hover reveal reveal-delay-4 group relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon name="MapIcon" size={20} className="text-primary" />
                  </div>
                  <p className="text-motto text-primary opacity-70">Temples</p>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight mb-2">
                  Jain Tirth & Temples
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium max-w-xs">
                  A directory of Jain Tirth Kshetras and temples across India — announcement coming soon.
                </p>
              </div>
              <div className="kalyanak-badge px-5 py-3 rounded-xl text-center flex-shrink-0">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Coming</p>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Soon</p>
              </div>
            </div>
          </div>

          {/* Card: Stavan, Bhajan & Stotra — col-span-2 — coming soon */}
          <div className="sm:col-span-2 bg-card p-6 sm:p-8 flex flex-col justify-between min-h-[180px] card-hover reveal reveal-delay-4 group relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon name="SparklesIcon" size={20} className="text-primary" />
                  </div>
                  <p className="text-motto text-primary opacity-70">Stavan</p>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight mb-2">
                  Stavan, Bhajan & Stotra
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium max-w-xs">
                  A collection of Jain devotional lyrics for daily recitation — announcement coming soon.
                </p>
              </div>
              <div className="kalyanak-badge px-5 py-3 rounded-xl text-center flex-shrink-0">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Coming</p>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
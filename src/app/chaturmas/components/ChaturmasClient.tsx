'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import chaturmasData from '@/data/chaturmas-locations.json';

interface ChaturmasEntry {
  title: string;
  state: string;
  city: string;
  location: string;
  diksha_guru: string;
}

const PAGE_SIZE = 60;

// Derive a short rank/category label + icon from the title prefix.
// Order matters — more specific prefixes are checked first.
const RANK_RULES: { match: RegExp; label: string; icon: string }[] = [
  { match: /^Niryapak Muni/i, label: 'Niryapak Muni', icon: 'StarIcon' },
  { match: /^Ganini Aryika/i, label: 'Ganini Aryika', icon: 'SparklesIcon' },
  { match: /^Acharya/i, label: 'Acharya', icon: 'StarIcon' },
  { match: /^Upadhyay/i, label: 'Upadhyay', icon: 'AcademicCapIcon' },
  { match: /^Muni/i, label: 'Muni', icon: 'UserIcon' },
  { match: /^Aryika/i, label: 'Aryika', icon: 'SparklesIcon' },
  { match: /^Ailak/i, label: 'Ailak', icon: 'UserIcon' },
  { match: /^Kshullika/i, label: 'Kshullika', icon: 'UserIcon' },
  { match: /^Kshullak/i, label: 'Kshullak', icon: 'UserIcon' },
];

function getRank(title: string) {
  const rule = RANK_RULES.find((r) => r.match.test(title.trim()));
  return rule || { label: 'Sadhu / Sadhvi', icon: 'UserIcon' };
}

const data = chaturmasData as ChaturmasEntry[];

export default function ChaturmasClient() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const states = useMemo(
    () => Array.from(new Set(data.map((d) => d.state).filter(Boolean))).sort(),
    []
  );

  const cities = useMemo(() => {
    const pool = stateFilter ? data.filter((d) => d.state === stateFilter) : data;
    return Array.from(new Set(pool.map((d) => d.city).filter(Boolean))).sort();
  }, [stateFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((entry) => {
      if (stateFilter && entry.state !== stateFilter) return false;
      if (cityFilter && entry.city !== cityFilter) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.diksha_guru.toLowerCase().includes(q) ||
        entry.city.toLowerCase().includes(q) ||
        entry.state.toLowerCase().includes(q) ||
        entry.location.toLowerCase().includes(q)
      );
    });
  }, [query, stateFilter, cityFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetPaging = () => setVisibleCount(PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-motto text-primary mb-3 opacity-70">Chaturmas 2026</p>
        <h1 className="text-section-xl text-foreground uppercase">
          Find <span className="gold-gradient-text">Chaturmas.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground font-medium max-w-lg leading-relaxed">
          Search where Acharyas, Munis, Aryikas, Kshullaks and Kshullikas are doing Chaturmas 2026 — by name, state or city.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            name="MagnifyingGlassIcon"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPaging();
            }}
            placeholder="Search by name, diksha guru, city or state..."
            className="w-full bg-card border border-border rounded-full pl-11 pr-5 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setCityFilter('');
            resetPaging();
          }}
          className="bg-card border border-border rounded-full px-5 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            resetPaging();
          }}
          className="bg-card border border-border rounded-full px-5 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <p className="mb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </p>

      {/* Results */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((entry, idx) => {
            const rank = getRank(entry.title);
            return (
              <div
                key={`${entry.title}-${idx}`}
                className="bg-card border border-border rounded-xl p-5 card-hover flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name={rank.icon} size={16} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {rank.label}
                  </span>
                </div>

                <h3 className="text-sm font-black text-foreground leading-snug">
                  {entry.title}
                </h3>

                <div className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                  <Icon name="MapPinIcon" size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {[entry.location, entry.city, entry.state].filter(Boolean).join(', ') || 'Location not available'}
                  </span>
                </div>

                {entry.diksha_guru && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground font-medium pt-2 border-t border-border">
                    <Icon name="UserGroupIcon" size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="text-foreground font-bold">Diksha Guru:</span> {entry.diksha_guru}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-bold text-muted-foreground">No results found. Try a different search.</p>
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all duration-200"
          >
            Load More
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 bg-muted/50 border border-border rounded-xl px-5 py-4 flex gap-3 items-start">
        <Icon name="InformationCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          <strong className="text-foreground">Disclaimer:</strong> Chaturmas location data is collected from public sources and may change or contain errors. If you spot incorrect information or want to report an update, please{' '}
          <Link href="/#contact" className="text-primary underline hover:text-accent transition-colors">
            contact us via the Contact page
          </Link>.
        </p>
      </div>
    </div>
  );
}

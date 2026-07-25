'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import entries from '@/data/stavan-bhajan-stotra.json';

interface StavanEntry {
  id: string;
  title: string;
  type: 'Stavan' | 'Bhajan' | 'Stotra' | string;
  language?: string;
  author?: string;
  lyrics: string;
  meaning?: string;
}

const data = entries as StavanEntry[];

const TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Stavan', value: 'Stavan' },
  { label: 'Bhajan', value: 'Bhajan' },
  { label: 'Stotra', value: 'Stotra' },
];

export default function StavanClient() {
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((entry) => {
      if (activeTab !== 'All' && entry.type !== activeTab) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.lyrics.toLowerCase().includes(q) ||
        (entry.author || '').toLowerCase().includes(q)
      );
    });
  }, [activeTab, query]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-motto text-primary mb-3 opacity-70">Devotion</p>
        <h1 className="text-section-xl text-foreground uppercase">
          Stavan, Bhajan <span className="gold-gradient-text">& Stotra.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground font-medium max-w-lg leading-relaxed">
          A growing collection of Jain devotional lyrics for daily recitation and prayer.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Icon
          name="MagnifyingGlassIcon"
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author or lyrics..."
          className="w-full bg-card border border-border rounded-full pl-11 pr-5 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* Result count */}
      <p className="mb-6 text-xs font-black uppercase tracking-widest text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
      </p>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const isOpen = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-xl overflow-hidden card-hover"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {entry.type}
                      </span>
                      {entry.language && (
                        <>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {entry.language}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-black text-foreground truncate">{entry.title}</p>
                    {entry.author && (
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">by {entry.author}</p>
                    )}
                  </div>
                  <Icon
                    name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-border">
                    <p className="whitespace-pre-line text-sm text-foreground leading-relaxed font-medium">
                      {entry.lyrics}
                    </p>
                    {entry.meaning && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Meaning</p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{entry.meaning}</p>
                      </div>
                    )}
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

      {/* Coming soon note */}
      <p className="text-center text-xs text-muted-foreground pt-10 font-medium">
        More Stavan, Bhajan and Stotra lyrics being added regularly. Connect with our{' '}
        <a href="https://t.me/real_jainism" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
          Telegram channel
        </a>{' '}
        to suggest one.
      </p>
    </div>
  );
}

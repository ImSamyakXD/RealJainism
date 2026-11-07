'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import tirthsFallback from '@/data/tirths-data.json';
import TirthDisclaimerModal from './TirthDisclaimerModal';

// Dynamically import TirthsMap to avoid SSR Leaflet window errors
const TirthsMap = dynamic(() => import('./TirthsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
        Loading Sacred India Map (OpenStreetMap)...
      </span>
    </div>
  ),
});

interface Tirth {
  id: string;
  slug: string;
  name: string;
  hindi_name?: string;
  tirth_type: string;
  tradition: string;
  state: string;
  district: string;
  city: string;
  description: string;
  cover_image_url: string;
  moolnayak_details?: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string;
  verification_status: string;
}

const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  siddh_kshetra:    { label: 'Siddh Kshetra',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', icon: 'StarIcon' },
  atishay_kshetra:  { label: 'Atishay Kshetra',  color: 'text-rose-400 bg-rose-400/10 border-rose-400/30', icon: 'SparklesIcon' },
  tirth_kshetra:    { label: 'Tirth Kshetra',    color: 'text-primary bg-primary/10 border-primary/30', icon: 'MapPinIcon' },
  temple_complex:   { label: 'Temple Complex',   color: 'text-sky-400 bg-sky-400/10 border-sky-400/30', icon: 'BuildingLibraryIcon' },
  historical_site:  { label: 'Heritage Site',    color: 'text-sky-400 bg-sky-400/10 border-sky-400/30', icon: 'AcademicCapIcon' },
  temple:           { label: 'Temple',           color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'HomeModernIcon' },
  pilgrimage_site:  { label: 'Pilgrimage Site',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: 'MapIcon' },
  other:            { label: 'Sacred Site',      color: 'text-muted-foreground bg-muted/30 border-border', icon: 'GlobeAsiaAustraliaIcon' },
};

function getTirthCategory(type: string): 'siddh' | 'atishay' | 'heritage' {
  if (type === 'siddh_kshetra') return 'siddh';
  if (type === 'atishay_kshetra') return 'atishay';
  return 'heritage';
}

export default function TirthsClient() {
  const [tirths, setTirths] = useState<Tirth[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'atishay' | 'siddh' | 'heritage'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  useEffect(() => {
    async function fetchTirths() {
      try {
        const apiRes = await fetch('/api/admin/tirths?limit=1000');
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.tirths && apiData.tirths.length > 0) {
            setTirths(apiData.tirths as Tirth[]);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback to supabase
      }

      try {
        const { data, error } = await supabase
          .from('tirths')
          .select('id, slug, name, hindi_name, tirth_type, tradition, state, district, city, description, cover_image_url, moolnayak_details, latitude, longitude, google_maps_url, verification_status')
          .eq('verification_status', 'published')
          .order('name', { ascending: true });

        if (error || !data || data.length === 0) {
          setTirths(tirthsFallback as Tirth[]);
        } else {
          // Keep Digambara entries and sanitize cover URLs
          const digambaraOnly = (data as Tirth[]).filter(
            (t) => !t.tradition || t.tradition.toLowerCase().includes('digambar')
          );
          const cleaned = digambaraOnly.map((item) => {
            let cover = (item.cover_image_url || '').trim();
            if (cover.includes('Banda%20Munisuvratnath%20Mandir.png')) {
              cover = cover.replace('Banda%20Munisuvratnath%20Mandir.png', 'Banda%20Munisuvratnath%20Mandir.jpg');
            }
            return {
              ...item,
              cover_image_url: cover,
            };
          });
          setTirths(cleaned.length > 0 ? cleaned : (tirthsFallback as Tirth[]));
        }
      } catch {
        setTirths(tirthsFallback as Tirth[]);
      } finally {
        setLoading(false);
      }
    }
    fetchTirths();
  }, []);

  const states = useMemo(
    () => Array.from(new Set(tirths.map((t) => t.state))).sort(),
    [tirths]
  );

  // Category counts
  const counts = useMemo(() => {
    return {
      all: tirths.length,
      siddh: tirths.filter((t) => getTirthCategory(t.tirth_type) === 'siddh').length,
      atishay: tirths.filter((t) => getTirthCategory(t.tirth_type) === 'atishay').length,
      heritage: tirths.filter((t) => getTirthCategory(t.tirth_type) === 'heritage').length,
    };
  }, [tirths]);

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tirths.filter((t) => {
      if (stateFilter && t.state !== stateFilter) return false;
      if (categoryFilter !== 'all' && getTirthCategory(t.tirth_type) !== categoryFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.hindi_name || '').toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q) ||
        (t.moolnayak_details || '').toLowerCase().includes(q)
      );
    });
  }, [tirths, query, stateFilter, categoryFilter]);

  const hasFilters = query || stateFilter || categoryFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* ── Sacred Tirth Disclaimer & Community Notice Modal ── */}
      <TirthDisclaimerModal
        forceOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />

      {/* ── Top Header Section (Screenshot 1 Design) ──────── */}
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-2 opacity-90">
          TirthDarshan / Pilgrimage Explorer
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
              Explore Sacred <span className="gold-gradient-text">Jain India.</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Find sacred Digambar Tirths by location, spiritual significance, and heritage.
              Explore Siddh Kshetras, Atishay Kshetras, and heritage basadis with live distance calculations.
            </p>
          </div>

          {/* Action Controls: View Switcher + Notice Button + Submit Tirth Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A140E] p-1.5 rounded-full border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Squares2X2Icon" size={15} />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'map'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="MapIcon" size={15} />
                Show on Maps
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowDisclaimerModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
              title="View Tirth Notice & Disclaimer"
            >
              <span>🙏</span>
              <span>Notice</span>
            </button>

            <Link
              href="/tirths/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
              title="Submit a missing Tirth Kshetra"
            >
              <Icon name="PlusCircleIcon" size={16} />
              Submit Tirth Kshetra
            </Link>
          </div>
        </div>
      </div>

      {/* ── Search Bar (Screenshot 1 style) ────────────────── */}
      <div className="mb-6">
        <div className="relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tirth, city, state, or PIN code..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-12 py-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="XMarkIcon" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── 4 Category Selector Cards (Screenshot 1 Grid) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        
        {/* Card 1: All Tirths */}
        <div
          onClick={() => setCategoryFilter('all')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all card-hover ${
            categoryFilter === 'all'
              ? 'bg-[#1C160F] border-yellow-400/60 shadow-lg shadow-yellow-400/5 ring-1 ring-yellow-400/30'
              : 'bg-card border-border hover:border-yellow-400/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              All Tirths
            </span>
          </div>
          <p className="text-2xl font-black text-foreground">
            All <span className="text-xs text-muted-foreground font-bold">({counts.all} Sacred Sites)</span>
          </p>
        </div>

        {/* Card 2: Atishay */}
        <div
          onClick={() => setCategoryFilter('atishay')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all card-hover ${
            categoryFilter === 'atishay'
              ? 'bg-[#1C1214] border-rose-500/60 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/30'
              : 'bg-card border-border hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Atishay
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            Special religious significance <span className="text-xs text-muted-foreground">({counts.atishay})</span>
          </p>
        </div>

        {/* Card 3: Siddha Kshetra */}
        <div
          onClick={() => setCategoryFilter('siddh')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all card-hover ${
            categoryFilter === 'siddh'
              ? 'bg-[#17121E] border-purple-500/60 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/30'
              : 'bg-card border-border hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Siddha Kshetra
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            Liberation-associated sites (Moksha Bhoomi) <span className="text-xs text-muted-foreground">({counts.siddh})</span>
          </p>
        </div>

        {/* Card 4: Heritage */}
        <div
          onClick={() => setCategoryFilter('heritage')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all card-hover ${
            categoryFilter === 'heritage'
              ? 'bg-[#10161E] border-sky-500/60 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/30'
              : 'bg-card border-border hover:border-sky-500/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Heritage
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">
            Historical and architectural complexes <span className="text-xs text-muted-foreground">({counts.heritage})</span>
          </p>
        </div>
      </div>

      {/* ── Interactive India Map Banner (Screenshot 1) ────── */}
      {viewMode === 'grid' && (
        <div className="mb-10 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#201810] via-card to-[#201810] border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Icon name="MapPinIcon" size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">
                Interactive Sacred India Map
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Colored markers · Nearby city finder · OpenStreetMap · Live GPS locator
              </p>
            </div>
          </div>

          <button
            onClick={() => setViewMode('map')}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-accent px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex-shrink-0"
          >
            <Icon name="MapIcon" size={16} />
            Show on Maps
          </button>
        </div>
      )}

      {/* ── VIEW MODE: Interactive Map (Screenshot 2) ──────── */}
      {viewMode === 'map' && (
        <div className="mb-14">
          <TirthsMap
            tirths={tirths}
            selectedCategory={categoryFilter}
            onSelectCategory={(cat) => setCategoryFilter(cat as any)}
            onBackToGrid={() => setViewMode('grid')}
            initialCity={query}
          />
        </div>
      )}

      {/* ── VIEW MODE: Grid Section ────────────────────────── */}
      {viewMode === 'grid' && (
        <>
          {/* Secondary State Filter + Active Tags */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-card border border-border rounded-full px-5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              >
                <option value="">All States ({states.length})</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={() => { setQuery(''); setStateFilter(''); setCategoryFilter('all'); }}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'Tirth' : 'Tirths'} found`}
            </p>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-24 bg-muted/60 rounded-full" />
                    <div className="h-5 w-4/5 bg-muted/60 rounded-full" />
                    <div className="h-3 w-1/2 bg-muted/60 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            /* Tirth Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tirth) => {
                const typeInfo = TYPE_LABELS[tirth.tirth_type] || TYPE_LABELS.other;
                return (
                  <Link
                    key={tirth.id}
                    href={`/tirths/${tirth.slug}`}
                    className="group bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-muted/40">
                      <img
                        src={tirth.cover_image_url || '/assets/images/tirth-finder-fallback.png'}
                        alt={tirth.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/assets/images/tirth-finder-fallback.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                      <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${typeInfo.color}`}>
                        <Icon name={typeInfo.icon} size={11} />
                        {typeInfo.label}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <div>
                        <h3 className="text-sm font-black text-foreground leading-snug group-hover:text-primary transition-colors">
                          {tirth.name}
                        </h3>
                        {tirth.hindi_name && (
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            {tirth.hindi_name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Icon name="MapPinIcon" size={13} className="flex-shrink-0 text-primary/70" />
                        <span>{tirth.city}, {tirth.state}</span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                        {tirth.description}
                      </p>

                      <div className="flex items-center justify-end pt-3 border-t border-border/60 mt-auto">
                        <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-2 transition-all">
                          View Details
                          <Icon name="ArrowRightIcon" size={11} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-card/30 border border-border rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="MagnifyingGlassIcon" size={28} className="text-primary/60" />
              </div>
              <h3 className="text-base font-black text-foreground mb-2">No Tirths Found</h3>
              <p className="text-sm text-muted-foreground font-medium mb-6">
                No pilgrimage sites match your current filters. Try adjusting your search, or submit this missing tirth to our directory.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => { setQuery(''); setStateFilter(''); setCategoryFilter('all'); }}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-sm"
                >
                  Clear Filters
                </button>
                <Link
                  href="/tirths/submit"
                  className="bg-card border border-primary/40 text-primary px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-sm flex items-center gap-2"
                >
                  <Icon name="PlusCircleIcon" size={15} />
                  Submit a Tirth Kshetra
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Community Contribution Card ───────────────────── */}
      <div className="mt-14 bg-gradient-to-r from-card via-card to-primary/10 border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-wider">
            <Icon name="SparklesIcon" size={12} />
            Community Directory
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
            Know a Sacred Tirth Not Listed Here?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Help preserve and document all Digambar Jain pilgrimage sites, Atishay Kshetras, and ancient basadis across Bharat. Submit details to our team.
          </p>
        </div>
        <Link
          href="/tirths/submit"
          className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg shadow-primary/20"
        >
          <Icon name="PlusCircleIcon" size={16} />
          Submit a Tirth Kshetra
        </Link>
      </div>

      {/* ── Bottom Disclaimer ────────────────────────────── */}
      <div className="mt-12 bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-lg">
        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
            <Icon name="InformationCircleIcon" size={20} />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed font-medium space-y-1">
            <p>
              <strong className="text-foreground">Tirth Directory Notice & Disclaimer:</strong> Managing and verifying vast pilgrimage data across India is challenging. If you notice any inaccuracy, missing detail, or changed trust contact, please report it so we can investigate and resolve it promptly.
            </p>
            <p className="text-primary font-semibold italic">
              &ldquo;यदि संकलन में अनजाने में कोई त्रुटि या भूल रह गई हो, तो हृदय से &lsquo;उत्तम क्षमा&rsquo;&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <Link
            href="/tirths/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          >
            <Icon name="PencilSquareIcon" size={15} />
            <span>Report a Mistake</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDisclaimerModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
          >
            <span>🙏</span>
            <span>Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

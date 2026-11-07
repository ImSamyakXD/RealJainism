'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import TirthDisclaimerModal from '@/app/tirths/components/TirthDisclaimerModal';

interface DarshanTimings {
  morning?: string;
  evening?: string;
  notes?: string;
}

interface NearbyTransport {
  railway?: string;
  airport?: string;
  bus?: string;
  road?: string;
}

interface Tirth {
  id: string;
  slug: string;
  name: string;
  hindi_name?: string;
  alternate_names?: string[];
  tirth_type: string;
  tradition: string;
  state: string;
  district: string;
  city: string;
  pin_code?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string;
  description: string;
  history?: string;
  religious_significance?: string;
  moolnayak_details?: string;
  darshan_timings?: DarshanTimings;
  facilities?: string[];
  accessibility_notes?: string;
  nearby_transport?: NearbyTransport;
  contact_phone?: string;
  official_website?: string;
  cover_image_url: string;
  verification_status: string;
  verified_by?: string;
  verified_at?: string;
}

const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  siddh_kshetra:   { label: 'Siddh Kshetra',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: 'StarIcon' },
  atishay_kshetra: { label: 'Atishay Kshetra', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: 'SparklesIcon' },
  tirth_kshetra:   { label: 'Tirth Kshetra',   color: 'text-primary bg-primary/10 border-primary/30',         icon: 'MapPinIcon' },
  temple_complex:  { label: 'Temple Complex',  color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', icon: 'BuildingLibraryIcon' },
  historical_site: { label: 'Heritage Site',   color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',       icon: 'AcademicCapIcon' },
  temple:          { label: 'Temple',          color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'HomeModernIcon' },
};

interface Props {
  slug: string;
  initialData: Tirth;
}

function isCallablePhone(phone?: string | null): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  // If text contains alphabet characters (e.g., "Inquire at Local..."), it's not a dialable phone number
  if (/[a-zA-Z]/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function getValidWebsite(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'Not found' || trimmed.includes('realjainism.bot.cd')) {
    return null;
  }
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
}

export default function TirthDetailClient({ slug, initialData }: Props) {
  const [tirth, setTirth] = useState<Tirth>(() => ({
    ...initialData,
    official_website: getValidWebsite(initialData.official_website) || undefined,
  }));
  const [imgError, setImgError] = useState(false);

  // Reset imgError whenever cover_image_url updates
  useEffect(() => {
    setImgError(false);
  }, [tirth.cover_image_url]);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    issueType: 'Incorrect Information',
    name: '',
    contact: '',
    details: '',
  });
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    if (!isReportModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsReportModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReportModalOpen]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus('sending');
    setReportError('');

    try {
      const res = await fetch('https://formspree.io/f/xgaoglle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Tirth Issue Report: ${tirth.name} (${tirth.state})`,
          tirth_name: tirth.name,
          tirth_slug: tirth.slug,
          tirth_state: tirth.state,
          tirth_city: tirth.city,
          issue_type: reportForm.issueType,
          reporter_name: reportForm.name,
          reporter_contact: reportForm.contact,
          issue_details: reportForm.details,
        }),
      });

      if (res.ok) {
        setReportStatus('success');
      } else {
        const data = await res.json().catch(() => null);
        setReportStatus('error');
        setReportError(data?.error || 'Failed to submit report. Please try again.');
      }
    } catch {
      setReportStatus('error');
      setReportError('Network error. Please check your connection and try again.');
    }
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    if (reportStatus === 'success') {
      setReportStatus('idle');
      setReportForm({
        issueType: 'Incorrect Information',
        name: '',
        contact: '',
        details: '',
      });
    }
  };

  // Try to hydrate from Supabase for live data
  useEffect(() => {
    async function hydrate() {
      try {
        const { data, error } = await supabase
          .from('tirths')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          setTirth((prev) => {
            const pick = (newVal: any, oldVal: any) =>
              newVal && newVal !== 'Not found' ? newVal : oldVal;

            // Only set official_website if explicitly provided in Supabase and valid
            const liveWebsite = getValidWebsite(data.official_website);

            // Crucial: preserve existing cover image (e.g. from custom admin upload/edit)
            const cleanSupabaseCover = (data.cover_image_url || '').trim();
            const preservedCover =
              prev.cover_image_url && prev.cover_image_url.trim().length > 0
                ? prev.cover_image_url
                : cleanSupabaseCover;

            return {
              ...prev,
              ...data,
              cover_image_url: preservedCover,
              pin_code: pick(data.pin_code, prev.pin_code),
              address: pick(data.address, prev.address),
              contact_phone: pick(data.contact_phone, prev.contact_phone),
              official_website: liveWebsite || undefined,
              moolnayak_details: pick(data.moolnayak_details, prev.moolnayak_details),
              history: pick(data.history, prev.history),
              religious_significance: pick(data.religious_significance, prev.religious_significance),
              nearby_transport: {
                ...prev.nearby_transport,
                ...(data.nearby_transport || {}),
                airport: pick(data.nearby_transport?.airport, prev.nearby_transport?.airport),
                railway: pick(data.nearby_transport?.railway, prev.nearby_transport?.railway),
                road: pick(data.nearby_transport?.road, prev.nearby_transport?.road),
              },
              darshan_timings: {
                ...prev.darshan_timings,
                ...(data.darshan_timings || {}),
                morning: pick(data.darshan_timings?.morning, prev.darshan_timings?.morning),
                evening: pick(data.darshan_timings?.evening, prev.darshan_timings?.evening),
                notes: pick(data.darshan_timings?.notes, prev.darshan_timings?.notes),
              },
              facilities:
                data.facilities && data.facilities.length > 0 && !data.facilities.includes('Not found')
                  ? data.facilities
                  : prev.facilities,
            };
          });
        }
      } catch { /* keep initial data */ }
    }
    hydrate();
  }, [slug, initialData]);

  const typeInfo = TYPE_LABELS[tirth.tirth_type] || TYPE_LABELS.tirth_kshetra;
  const hasCoords = tirth.latitude != null && tirth.longitude != null && !isNaN(Number(tirth.latitude)) && !isNaN(Number(tirth.longitude));
  const mapsUrl = tirth.google_maps_url || (hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${tirth.latitude},${tirth.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([tirth.name, tirth.city, tirth.state].filter(Boolean).join(', '))}`
  );

  const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={16} className="text-primary" />
        </div>
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* ── Sacred Tirth Disclaimer & Community Notice Modal ── */}
      <TirthDisclaimerModal />

      {/* ── Back Link ─────────────────────────────────────── */}
      <Link
        href="/tirths"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <Icon name="ArrowLeftIcon" size={14} />
        Tirth Directory
      </Link>

      {/* ── Hero Section ──────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-10 border border-border">
        <div className="h-72 sm:h-96 bg-muted/40">
          <img
            src={imgError ? '/assets/images/tirth-finder-fallback.png' : (tirth.cover_image_url || '/assets/images/tirth-finder-fallback.png')}
            alt={tirth.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          {/* Type badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mb-3 ${typeInfo.color}`}>
            <Icon name={typeInfo.icon} size={11} />
            {typeInfo.label}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight">
            {tirth.name}
          </h1>
          {tirth.hindi_name && (
            <p className="text-base sm:text-xl text-primary/90 font-bold mt-1">{tirth.hindi_name}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
              <Icon name="MapPinIcon" size={14} className="text-primary/70" />
              {tirth.city}, {tirth.district}, {tirth.state}
              {tirth.pin_code && <span className="text-muted-foreground/60"> — {tirth.pin_code}</span>}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Icon name="UserGroupIcon" size={14} />
              {tirth.tradition}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alternate Names ───────────────────────────────── */}
      {tirth.alternate_names && tirth.alternate_names.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tirth.alternate_names.map((name) => (
            <span key={name} className="bg-muted/40 border border-border text-muted-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {name}
            </span>
          ))}
        </div>
      )}

      {/* ── Quick Action Buttons ──────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg shadow-primary/20"
        >
          <Icon name="MapIcon" size={15} />
          Open in Google Maps
        </a>

        {/* Official Website — only rendered if entered in Supabase */}
        {tirth.official_website && (
          <a
            href={tirth.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-primary/40 text-primary text-xs font-black uppercase tracking-widest hover:border-primary hover:bg-primary/10 transition-all shadow-sm"
          >
            <Icon name="GlobeAltIcon" size={15} />
            Official Website
          </a>
        )}

        {/* Contact Phone — dialable link if real phone number; static badge if informational inquiry note */}
        {tirth.contact_phone && (
          isCallablePhone(tirth.contact_phone) ? (
            <a
              href={`tel:${tirth.contact_phone.trim().replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all shadow-sm"
              title={`Call ${tirth.contact_phone}`}
            >
              <Icon name="PhoneIcon" size={15} />
              {tirth.contact_phone}
            </a>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-xs font-bold tracking-normal cursor-default select-text shadow-sm"
              title={tirth.contact_phone}
            >
              <Icon name="PhoneIcon" size={15} className="text-muted-foreground/70 flex-shrink-0" />
              <span>{tirth.contact_phone}</span>
            </div>
          )
        )}

        {/* Report Tirth Kshetra Button */}
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/60 hover:text-red-300 transition-all shadow-sm"
          title={`Report an issue or problem regarding ${tirth.name}`}
        >
          <Icon name="ExclamationCircleIcon" size={15} className="text-red-400" />
          Report
        </button>
      </div>

      {/* ── Main Content Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column — Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          <SectionCard title="About This Tirth" icon="InformationCircleIcon">
            <p className="text-sm text-muted-foreground leading-relaxed">{tirth.description}</p>
          </SectionCard>

          {/* Moolnayak */}
          {tirth.moolnayak_details && (
            <SectionCard title="Moolnayak & Principal Idol" icon="StarIcon">
              <div className="flex gap-3">
                <div className="w-1 flex-shrink-0 rounded-full bg-gradient-to-b from-primary to-accent" />
                <p className="text-sm text-muted-foreground leading-relaxed">{tirth.moolnayak_details}</p>
              </div>
            </SectionCard>
          )}

          {/* Religious Significance */}
          {tirth.religious_significance && (
            <SectionCard title="Religious Significance" icon="SparklesIcon">
              <p className="text-sm text-muted-foreground leading-relaxed">{tirth.religious_significance}</p>
            </SectionCard>
          )}

          {/* History */}
          {tirth.history && (
            <SectionCard title="Historical Background" icon="AcademicCapIcon">
              <p className="text-sm text-muted-foreground leading-relaxed">{tirth.history}</p>
            </SectionCard>
          )}

          {/* Darshan Timings */}
          {tirth.darshan_timings && (
            <SectionCard title="Darshan Timings" icon="ClockIcon">
              <div className="space-y-3">
                {tirth.darshan_timings.morning && (
                  <div className="flex gap-3">
                    <span className="text-xs font-black text-primary uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">Morning</span>
                    <span className="text-sm text-foreground font-medium">{tirth.darshan_timings.morning}</span>
                  </div>
                )}
                {tirth.darshan_timings.evening && (
                  <div className="flex gap-3">
                    <span className="text-xs font-black text-primary uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">Evening</span>
                    <span className="text-sm text-foreground font-medium">{tirth.darshan_timings.evening}</span>
                  </div>
                )}
                {tirth.darshan_timings.notes && (
                  <div className="mt-3 pt-3 border-t border-border/60 flex gap-2 items-start">
                    <Icon name="InformationCircleIcon" size={14} className="text-primary/70 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{tirth.darshan_timings.notes}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right Column — Info Sidebar */}
        <div className="space-y-6">

          {/* Location & Map Embed */}
          <SectionCard title="Location & Map" icon="MapPinIcon">
            {tirth.address && (
              <p className="text-xs text-muted-foreground font-medium mb-4 leading-relaxed">{tirth.address}</p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-xl overflow-hidden border border-border mb-3 group"
            >
              <iframe
                title={`Map of ${tirth.name}`}
                src={hasCoords
                  ? `https://maps.google.com/maps?q=${tirth.latitude},${tirth.longitude}&z=13&output=embed`
                  : `https://maps.google.com/maps?q=${encodeURIComponent([tirth.name, tirth.city, tirth.state].filter(Boolean).join(', '))}&z=13&output=embed`
                }
                className="w-full h-44 pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-primary text-primary-foreground text-xs font-black px-4 py-2 rounded-full">
                  Open in Maps
                </span>
              </div>
            </a>
            <div className="text-[10px] text-muted-foreground/60 font-mono">
              {hasCoords
                ? `${Number(tirth.latitude).toFixed(4)}°N, ${Number(tirth.longitude).toFixed(4)}°E`
                : `${tirth.city || ''}${tirth.city && tirth.state ? ', ' : ''}${tirth.state || 'India'}`
              }
            </div>
          </SectionCard>

          {/* Facilities */}
          {tirth.facilities && tirth.facilities.length > 0 && (
            <SectionCard title="Pilgrim Facilities" icon="HomeModernIcon">
              <div className="flex flex-wrap gap-2">
                {tirth.facilities.map((fac) => (
                  <span key={fac} className="bg-muted/40 border border-border text-foreground text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {fac}
                  </span>
                ))}
              </div>
              {tirth.accessibility_notes && (
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed flex gap-2">
                  <Icon name="UserGroupIcon" size={13} className="text-primary/70 flex-shrink-0 mt-0.5" />
                  {tirth.accessibility_notes}
                </p>
              )}
            </SectionCard>
          )}

          {/* How to Reach */}
          {tirth.nearby_transport && (
            <SectionCard title="How to Reach" icon="TruckIcon">
              <div className="space-y-3">
                {[
                  { key: 'railway', label: 'Railway', icon: 'BuildingOffice2Icon' },
                  { key: 'airport', label: 'Airport', icon: 'PaperAirplaneIcon' },
                  { key: 'road', label: 'Road', icon: 'TruckIcon' },
                  { key: 'bus', label: 'Bus', icon: 'TruckIcon' },
                ].map(({ key, label, icon }) => {
                  const val = (tirth.nearby_transport as any)?.[key];
                  if (!val) return null;
                  return (
                    <div key={key} className="flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name={icon} size={12} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">{label}</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{val}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Verification Seal */}
          <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-4 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/15 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckBadgeIcon" size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-0.5">
                Verified Information <span className="text-[10px] normal-case font-semibold text-muted-foreground tracking-normal block sm:inline mt-0.5 sm:mt-0 sm:ml-1">(Mistake may be done, you can contact via contact form)</span>
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {tirth.verified_by || 'RealJainism Research Team'} ·{' '}
                {tirth.verified_at ? new Date(tirth.verified_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '2026'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Nav ────────────────────────────────────── */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border pt-8">
        <Link
          href="/tirths"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={14} />
          Back to All Tirths
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all"
          >
            <Icon name="MapIcon" size={14} />
            Navigate
          </a>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/60 hover:text-red-300 transition-all"
          >
            <Icon name="ExclamationCircleIcon" size={14} className="text-red-400" />
            Report Issue
          </button>
          <Link
            href="/tirths/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-xs font-black uppercase tracking-widest hover:border-primary/40 transition-all"
          >
            <Icon name="PlusCircleIcon" size={14} />
            Submit a Tirth
          </Link>
        </div>
      </div>

      {/* ── Report Issue Modal ────────────────────────────── */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeReportModal();
          }}
        >
          <div className="bg-card border border-red-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeReportModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
              aria-label="Close modal"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider mb-3">
              <Icon name="ExclamationCircleIcon" size={13} />
              Report Tirth Issue
            </div>

            <h3
              id="report-modal-title"
              className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground mb-1.5"
            >
              Report Problem
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Reporting for <span className="text-foreground font-bold">{tirth.name}</span>{' '}
              <span className="opacity-70">
                ({tirth.city ? `${tirth.city}, ` : ''}{tirth.state})
              </span>
            </p>

            {reportStatus === 'success' ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto text-primary">
                  <Icon name="CheckCircleIcon" size={36} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-foreground">
                  Report Received · Jai Jinendra!
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you for reporting this issue for {tirth.name}. Our team will review your report and update the information promptly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-accent transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="report-issueType"
                    className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5"
                  >
                    What is the problem? <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="report-issueType"
                    value={reportForm.issueType}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, issueType: e.target.value })
                    }
                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                  >
                    <option value="Incorrect Information">Incorrect Temple / Idol Information</option>
                    <option value="Wrong Contact Phone / Office Details">Wrong Contact Phone / Committee Office</option>
                    <option value="Wrong Timings / Dharamshala / Bhojanshala">Outdated Timings / Dharamshala / Bhojanshala</option>
                    <option value="Incorrect Location / Map Coordinates">Incorrect Location / Map Coordinates</option>
                    <option value="Temple Condition / Upkeep Issue">Temple Condition / Sanctity / Upkeep Issue</option>
                    <option value="Duplicate or Outdated Listing">Duplicate or Outdated Listing</option>
                    <option value="Other Problem">Other Problem / Suggestion</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="report-name"
                      className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5"
                    >
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="report-name"
                      type="text"
                      required
                      value={reportForm.name}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, name: e.target.value })
                      }
                      placeholder="Rahul Jain"
                      className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="report-contact"
                      className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5"
                    >
                      Email or WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="report-contact"
                      type="text"
                      required
                      value={reportForm.contact}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, contact: e.target.value })
                      }
                      placeholder="rahul@example.com or phone"
                      className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="report-details"
                    className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5"
                  >
                    Describe the Problem / What needs fixing? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="report-details"
                    required
                    rows={4}
                    value={reportForm.details}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, details: e.target.value })
                    }
                    placeholder="Provide details about what is wrong (e.g., correct phone number, new committee trust office, timing changes, corrected address)..."
                    className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 transition-colors resize-none"
                  />
                </div>

                {reportStatus === 'error' && (
                  <p className="text-xs font-bold text-red-400">
                    {reportError || 'Something went wrong. Please try again.'}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="px-4 py-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportStatus === 'sending'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-60"
                  >
                    {reportStatus === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon name="ExclamationCircleIcon" size={14} />
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

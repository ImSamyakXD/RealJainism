'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppLogo from '@/components/ui/AppLogo';

type TabType = 'overview' | 'tirths' | 'wallpapers' | 'ringtones' | 'events' | 'sql';

interface TirthItem {
  id?: string;
  slug: string;
  name: string;
  hindi_name?: string;
  tirth_type: string;
  tradition: string;
  state: string;
  district?: string;
  city: string;
  address?: string;
  pin_code?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  description: string;
  history?: string;
  moolnayak_details?: string;
  darshan_timings?: {
    morning?: string;
    evening?: string;
  };
  facilities?: string[];
  contact_phone?: string;
  official_website?: string;
  cover_image_url: string;
}

interface WallpaperItem {
  id: string;
  title: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  category?: string;
  downloads?: number;
  created_at?: string;
}

interface RingtoneItem {
  id: string;
  name: string;
  artist?: string;
  duration?: string;
  audioUrl: string;
  downloads?: number;
  created_at?: string;
}

interface SpecialEventItem {
  id: string;
  slug: string;
  title: string;
  hindi_title?: string;
  tithi_date?: string;
  upcoming_date?: string;
  category?: string;
  badge?: string;
  description: string;
  rituals?: string;
  significance?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Ladakh'
];

export default function AdminPanelClient() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [tirths, setTirths] = useState<TirthItem[]>([]);
  const [tirthsTotal, setTirthsTotal] = useState<number | null>(null);
  const [tirthsTotalAll, setTirthsTotalAll] = useState<number | null>(null);
  const [tirthsLoading, setTirthsLoading] = useState(false);
  const [tirthSearch, setTirthSearch] = useState('');
  const [tirthStateFilter, setTirthStateFilter] = useState('all');
  const [tirthPage, setTirthPage] = useState(1);

  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [wallpapersLoading, setWallpapersLoading] = useState(false);

  const [ringtones, setRingtones] = useState<RingtoneItem[]>([]);
  const [ringtonesLoading, setRingtonesLoading] = useState(false);
  const [playingRingtoneId, setPlayingRingtoneId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [events, setEvents] = useState<SpecialEventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Modals & form states
  const [editingTirth, setEditingTirth] = useState<TirthItem | null>(null);
  const [isNewTirthModalOpen, setIsNewTirthModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalTargetTirth, setPhotoModalTargetTirth] = useState<TirthItem | null>(null);
  const [photoModalUploading, setPhotoModalUploading] = useState(false);
  const [photoModalDragOver, setPhotoModalDragOver] = useState(false);
  const [photoModalPreviewUrl, setPhotoModalPreviewUrl] = useState<string | null>(null);
  const [editTirthPhotoUploading, setEditTirthPhotoUploading] = useState(false);
  const [editTirthPhotoDragOver, setEditTirthPhotoDragOver] = useState(false);

  // Wallpaper Upload Form
  const [wpTitle, setWpTitle] = useState('');
  const [wpCategory, setWpCategory] = useState('Temples');
  const [wpUrl, setWpUrl] = useState('');
  const [wpUploading, setWpUploading] = useState(false);

  // Ringtone Upload Form
  const [rtName, setRtName] = useState('');
  const [rtArtist, setRtArtist] = useState('Devotional Chants');
  const [rtDuration, setRtDuration] = useState('1:00');
  const [rtUrl, setRtUrl] = useState('');
  const [rtUploading, setRtUploading] = useState(false);

  // Special Event Form
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEventItem | null>(null);
  const [evTitle, setEvTitle] = useState('');
  const [evHindiTitle, setEvHindiTitle] = useState('');
  const [evTithiDate, setEvTithiDate] = useState('');
  const [evUpcomingDate, setEvUpcomingDate] = useState('');
  const [evCategory, setEvCategory] = useState('Maha Parv');
  const [evBadge, setEvBadge] = useState('Sacred Parv');
  const [evDescription, setEvDescription] = useState('');
  const [evRituals, setEvRituals] = useState('');
  const [evSignificance, setEvSignificance] = useState('');
  const [evImageUrl, setEvImageUrl] = useState('');
  const [evSubmitting, setEvSubmitting] = useState(false);

  // Check login on load
  useEffect(() => {
    const savedToken = localStorage.getItem('rj_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
    }
    setAuthChecking(false);
  }, []);

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('rj_admin_token', data.token);
        setIsAuthenticated(true);
        showToast('Welcome, Admin! Access granted.');
      } else {
        setAuthError(data.message || 'Invalid passcode. Please try again.');
      }
    } catch (err: any) {
      setAuthError('Error verifying credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rj_admin_token');
    setIsAuthenticated(false);
    showToast('Logged out successfully');
  };

  // Load datasets when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadWallpapers();
    loadRingtones();
    loadEvents();
    loadTirths();
  }, [isAuthenticated]);

  // Load tirths when tab, search, filter or page changes
  useEffect(() => {
    if (!isAuthenticated) return;
    loadTirths();
  }, [isAuthenticated, tirthSearch, tirthStateFilter, tirthPage]);

  // Fetch helpers
  const loadTirths = async () => {
    setTirthsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(tirthPage),
        limit: '30',
        q: tirthSearch,
        state: tirthStateFilter,
      });
      const res = await fetch(`/api/admin/tirths?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTirths(data.tirths || []);
        setTirthsTotal(typeof data.total === 'number' ? data.total : (data.tirths?.length || 0));
        if (typeof data.totalAll === 'number') {
          setTirthsTotalAll(data.totalAll);
        } else if (!tirthSearch && tirthStateFilter === 'all') {
          setTirthsTotalAll(data.total || data.tirths?.length || 0);
        }
      }
    } catch {
      showToast('Failed to load tirths', 'error');
    } finally {
      setTirthsLoading(false);
    }
  };

  const loadWallpapers = async () => {
    setWallpapersLoading(true);
    try {
      const res = await fetch('/api/admin/wallpapers');
      if (res.ok) {
        const data = await res.json();
        setWallpapers(data || []);
      }
    } catch {
      showToast('Failed to load wallpapers', 'error');
    } finally {
      setWallpapersLoading(false);
    }
  };

  const loadRingtones = async () => {
    setRingtonesLoading(true);
    try {
      const res = await fetch('/api/admin/ringtones');
      if (res.ok) {
        const data = await res.json();
        setRingtones(data || []);
      }
    } catch {
      showToast('Failed to load ringtones', 'error');
    } finally {
      setRingtonesLoading(false);
    }
  };

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data || []);
      }
    } catch {
      showToast('Failed to load events', 'error');
    } finally {
      setEventsLoading(false);
    }
  };

  // Generic File Upload Handler
  const handleFileUpload = async (file: File, folder: 'wallpapers' | 'ringtones' | 'tirths' | 'events'): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return data.url;
      } else {
        showToast(data.message || 'File upload failed', 'error');
        return null;
      }
    } catch {
      showToast('File upload network error', 'error');
      return null;
    }
  };

  // Add Wallpaper Handler
  const handleAddWallpaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wpTitle || !wpUrl) {
      showToast('Please provide a title and an image', 'error');
      return;
    }

    setWpUploading(true);
    try {
      const res = await fetch('/api/admin/wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: wpTitle,
          url: wpUrl,
          category: wpCategory,
        }),
      });

      if (res.ok) {
        showToast('Wallpaper published successfully!');
        setWpTitle('');
        setWpUrl('');
        loadWallpapers();
      } else {
        showToast('Failed to save wallpaper', 'error');
      }
    } catch {
      showToast('Network error while saving wallpaper', 'error');
    } finally {
      setWpUploading(false);
    }
  };

  // Delete Wallpaper
  const handleDeleteWallpaper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallpaper?')) return;
    try {
      const res = await fetch(`/api/admin/wallpapers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Wallpaper deleted');
        setWallpapers((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      showToast('Failed to delete wallpaper', 'error');
    }
  };

  // Add Ringtone Handler
  const handleAddRingtone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtName || !rtUrl) {
      showToast('Please provide a ringtone name and audio file/URL', 'error');
      return;
    }

    setRtUploading(true);
    try {
      const res = await fetch('/api/admin/ringtones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rtName,
          artist: rtArtist,
          duration: rtDuration,
          audioUrl: rtUrl,
        }),
      });

      if (res.ok) {
        showToast('Ringtone published successfully!');
        setRtName('');
        setRtArtist('Devotional Chants');
        setRtDuration('1:00');
        setRtUrl('');
        loadRingtones();
      } else {
        showToast('Failed to save ringtone', 'error');
      }
    } catch {
      showToast('Network error while saving ringtone', 'error');
    } finally {
      setRtUploading(false);
    }
  };

  // Delete Ringtone
  const handleDeleteRingtone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ringtone?')) return;
    try {
      const res = await fetch(`/api/admin/ringtones?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Ringtone deleted');
        setRingtones((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      showToast('Failed to delete ringtone', 'error');
    }
  };

  // Play / Pause Ringtone
  const togglePlayRingtone = (ringtone: RingtoneItem) => {
    if (playingRingtoneId === ringtone.id) {
      audioPlayerRef.current?.pause();
      setPlayingRingtoneId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = ringtone.audioUrl;
        audioPlayerRef.current.play();
        setPlayingRingtoneId(ringtone.id);
      }
    }
  };

  // Save / Update Tirth Handler
  const handleSaveTirth = async (tirthData: Partial<TirthItem>) => {
    try {
      const isNew = !tirthData.slug || isNewTirthModalOpen;
      const res = await fetch('/api/admin/tirths', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tirthData),
      });

      if (res.ok) {
        showToast(isNew ? 'New Tirth created successfully!' : 'Tirth updated successfully!');
        setEditingTirth(null);
        setIsNewTirthModalOpen(false);
        setIsPhotoModalOpen(false);
        setPhotoModalTargetTirth(null);
        setPhotoModalPreviewUrl(null);
        loadTirths();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save tirth', 'error');
      }
    } catch {
      showToast('Network error while saving tirth', 'error');
    }
  };

  // Upload and attach photo for selected Tirth with progress
  const handlePhotoModalFile = async (file: File) => {
    if (!photoModalTargetTirth) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    try {
      const localPreview = URL.createObjectURL(file);
      setPhotoModalPreviewUrl(localPreview);
      setPhotoModalUploading(true);

      showToast('Uploading photo to server...');
      const url = await handleFileUpload(file, 'tirths');
      if (url) {
        await handleSaveTirth({
          slug: photoModalTargetTirth.slug,
          cover_image_url: url,
        });
        showToast('Photo uploaded and updated successfully!');
        setIsPhotoModalOpen(false);
        setPhotoModalTargetTirth(null);
        setPhotoModalPreviewUrl(null);
      } else {
        setPhotoModalPreviewUrl(null);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload photo', 'error');
      setPhotoModalPreviewUrl(null);
    } finally {
      setPhotoModalUploading(false);
    }
  };

  // Delete Tirth
  const handleDeleteTirth = async (slug: string) => {
    if (!confirm(`Are you sure you want to remove tirth '${slug}'?`)) return;
    try {
      const res = await fetch(`/api/admin/tirths?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Tirth deleted');
        setTirths((prev) => prev.filter((t) => t.slug !== slug));
        setTirthsTotal((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
        setTirthsTotalAll((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
        loadTirths();
      }
    } catch {
      showToast('Failed to delete tirth', 'error');
    }
  };

  // Open Event Modal for New / Edit
  const handleOpenEventModal = (ev?: SpecialEventItem) => {
    if (ev) {
      setEditingEvent(ev);
      setEvTitle(ev.title);
      setEvHindiTitle(ev.hindi_title || '');
      setEvTithiDate(ev.tithi_date || '');
      setEvUpcomingDate(ev.upcoming_date || '');
      setEvCategory(ev.category || 'Maha Parv');
      setEvBadge(ev.badge || 'Sacred Parv');
      setEvDescription(ev.description || '');
      setEvRituals(ev.rituals || '');
      setEvSignificance(ev.significance || '');
      setEvImageUrl(ev.image_url || '');
    } else {
      setEditingEvent(null);
      setEvTitle('');
      setEvHindiTitle('');
      setEvTithiDate('');
      setEvUpcomingDate('');
      setEvCategory('Maha Parv');
      setEvBadge('Sacred Parv');
      setEvDescription('');
      setEvRituals('');
      setEvSignificance('');
      setEvImageUrl('');
    }
    setEventModalOpen(true);
  };

  // Save Event (POST / PUT)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle || !evDescription) {
      showToast('Title and description are required', 'error');
      return;
    }

    setEvSubmitting(true);
    try {
      const payload = {
        id: editingEvent?.id,
        slug: editingEvent?.slug,
        title: evTitle,
        hindi_title: evHindiTitle,
        tithi_date: evTithiDate,
        upcoming_date: evUpcomingDate,
        category: evCategory,
        badge: evBadge,
        description: evDescription,
        rituals: evRituals,
        significance: evSignificance,
        image_url: evImageUrl,
        is_active: true,
      };

      const res = await fetch('/api/admin/events', {
        method: editingEvent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingEvent ? 'Event updated!' : 'Special Parv added!');
        setEventModalOpen(false);
        loadEvents();
      } else {
        showToast('Failed to save event', 'error');
      }
    } catch {
      showToast('Network error while saving event', 'error');
    } finally {
      setEvSubmitting(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this special event?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}&slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Event removed');
        setEvents((prev) => prev.filter((e) => e.id !== id && e.slug !== slug));
      }
    } catch {
      showToast('Failed to delete event', 'error');
    }
  };

  // If loading auth
  if (authChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If Not Authenticated — Login Prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <AppLogo src="/assets/images/logo-1784737155365.png" size={42} />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Real<span className="text-primary">Jainism</span> Admin
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Direct Upload & Management Portal
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
              <Icon name="ExclamationTriangleIcon" size={18} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                Admin Passcode / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-accent transition-all duration-200 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Icon name="LockClosedIcon" size={16} />
                  <span>Enter Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border">
            <Link
              href="/"
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hidden audio element for ringtone preview */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingRingtoneId(null)}
        className="hidden"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-black border transition-all animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === 'error'
              ? 'bg-destructive text-destructive-foreground border-destructive/40'
              : 'bg-emerald-600 text-white border-emerald-500/50'
          }`}
        >
          <Icon
            name={toastMessage.type === 'error' ? 'ExclamationTriangleIcon' : 'CheckCircleIcon'}
            size={20}
          />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo src="/assets/images/logo-1784737155365.png" size={36} />
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight">
                Real<span className="text-primary">Jainism</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl border border-border hover:border-primary text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
            >
              <Icon name="ArrowTopRightOnSquareIcon" size={14} />
              <span className="hidden sm:inline">View Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-border/40 py-2">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon="HomeIcon"
            label="Overview"
          />
          <TabButton
            active={activeTab === 'tirths'}
            onClick={() => setActiveTab('tirths')}
            icon="BuildingLibraryIcon"
            label="Tirths & Photos"
            count={tirthsTotalAll ?? tirthsTotal ?? undefined}
          />
          <TabButton
            active={activeTab === 'wallpapers'}
            onClick={() => setActiveTab('wallpapers')}
            icon="PhotoIcon"
            label="Wallpapers"
            count={wallpapers.length}
          />
          <TabButton
            active={activeTab === 'ringtones'}
            onClick={() => setActiveTab('ringtones')}
            icon="MusicalNoteIcon"
            label="Ringtones"
            count={ringtones.length}
          />
          <TabButton
            active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            icon="CalendarIcon"
            label="Panchang Parv"
            count={events.length}
          />
          <TabButton
            active={activeTab === 'sql'}
            onClick={() => setActiveTab('sql')}
            icon="CommandLineIcon"
            label="Supabase SQL"
          />
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* ========================================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Welcome Card */}
            <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Unified Website Management
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                  Upload & Edit Directly to Your Website
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  No need to open the Supabase dashboard! You can now upload wallpapers, audio ringtones, update tirth descriptions, replace temple photos, and publish special Jain Parv announcements directly from this panel.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('wallpapers')}
                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-1.5"
                  >
                    <Icon name="PhotoIcon" size={16} />
                    <span>Upload Wallpaper</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ringtones')}
                    className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Icon name="MusicalNoteIcon" size={16} />
                    <span>Upload Ringtone</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tirths')}
                    className="px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary text-foreground text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Icon name="BuildingLibraryIcon" size={16} />
                    <span>Manage Tirths</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Icon name="SparklesIcon" size={16} />
                    <span>Publish Parv / Diwali</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Sacred Tirths"
                value={tirthsTotalAll !== null ? String(tirthsTotalAll) : tirthsTotal !== null ? String(tirthsTotal) : (tirthsLoading ? "..." : "0")}
                subtitle="All verified Digambar Kshetras"
                icon="BuildingLibraryIcon"
                color="text-amber-400"
                onClick={() => setActiveTab('tirths')}
              />
              <StatCard
                title="Wallpapers"
                value={String(wallpapers.length)}
                subtitle="HD devotional wallpapers"
                icon="PhotoIcon"
                color="text-sky-400"
                onClick={() => setActiveTab('wallpapers')}
              />
              <StatCard
                title="Ringtones"
                value={String(ringtones.length)}
                subtitle="Sacred chants & stavans"
                icon="MusicalNoteIcon"
                color="text-emerald-400"
                onClick={() => setActiveTab('ringtones')}
              />
              <StatCard
                title="Special Parv"
                value={String(events.length)}
                subtitle="Diwali, Paryushan & festivals"
                icon="CalendarIcon"
                color="text-purple-400"
                onClick={() => setActiveTab('events')}
              />
            </div>

            {/* Quick Summary Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Wallpapers */}
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-foreground flex items-center gap-2">
                    <Icon name="PhotoIcon" size={18} className="text-primary" />
                    <span>Active Wallpapers</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('wallpapers')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {wallpapers.slice(0, 6).map((wp) => (
                    <div key={wp.id} className="group relative rounded-xl overflow-hidden aspect-[9/16] bg-muted">
                      <img src={wp.url} alt={wp.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                        <p className="text-[10px] font-bold text-white line-clamp-1">{wp.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Events on Panchang */}
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-foreground flex items-center gap-2">
                    <Icon name="CalendarIcon" size={18} className="text-primary" />
                    <span>Panchang Special Parv & Festivals</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Manage Events →
                  </button>
                </div>
                <div className="space-y-3">
                  {events.slice(0, 4).map((ev) => (
                    <div key={ev.id} className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-foreground">{ev.title}</p>
                        <p className="text-[10px] font-semibold text-primary">{ev.tithi_date || ev.upcoming_date}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {ev.badge || 'Parv'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TIRTHS & PHOTOS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'tirths' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Action Bar */}
            <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={tirthSearch}
                    onChange={(e) => {
                      setTirthSearch(e.target.value);
                      setTirthPage(1);
                    }}
                    placeholder="Search tirth name, city, state, moolnayak..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* State Filter */}
                <select
                  value={tirthStateFilter}
                  onChange={(e) => {
                    setTirthStateFilter(e.target.value);
                    setTirthPage(1);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="all">All States & Territories</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Add New Tirth Button */}
              <button
                onClick={() => {
                  setEditingTirth({
                    slug: '',
                    name: '',
                    hindi_name: '',
                    tirth_type: 'atishay_kshetra',
                    tradition: 'Digambara',
                    state: 'Madhya Pradesh',
                    city: '',
                    description: '',
                    moolnayak_details: '',
                    cover_image_url: '',
                    contact_phone: '',
                    official_website: '',
                    facilities: ['Dharamshala', 'Bhojanshala', 'Drinking Water', 'Parking'],
                  });
                  setIsNewTirthModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent transition-all flex items-center justify-center gap-2"
              >
                <Icon name="PlusIcon" size={16} />
                <span>Add New Tirth</span>
              </button>
            </div>

            {/* Total Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-2">
              <span>Showing {tirths.length} of {tirthsTotal !== null ? tirthsTotal : "..."} Tirths{tirthsTotalAll !== null && tirthsTotal !== null && tirthsTotal !== tirthsTotalAll && <span className="ml-1 text-primary font-normal">({tirthsTotalAll} total in database)</span>}</span>
              <span>All currently uploaded tirths available for direct edit</span>
            </div>

            {/* Tirths Grid */}
            {tirthsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
                ))}
              </div>
            ) : tirths.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-8">
                <Icon name="BuildingLibraryIcon" size={36} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm font-bold text-foreground">No tirths found matching your search</p>
                <p className="text-xs text-muted-foreground mt-1">Try another search keyword or clear filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tirths.map((t) => (
                  <div
                    key={t.slug}
                    className="bg-card border border-border hover:border-primary/50 transition-all rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative h-44 w-full bg-muted overflow-hidden group">
                        {t.cover_image_url ? (
                          <img
                            src={t.cover_image_url}
                            alt={t.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                            <Icon name="PhotoIcon" size={28} />
                            <span className="text-[10px] mt-1">No cover image</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setPhotoModalTargetTirth(t);
                              setIsPhotoModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-black/60 hover:bg-primary text-white backdrop-blur-md text-xs font-bold transition-all shadow-md flex items-center gap-1"
                            title="Change photo"
                          >
                            <Icon name="CameraIcon" size={14} />
                            <span className="text-[10px] hidden group-hover:inline">Upload Photo</span>
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-amber-300">
                          {t.city}, {t.state}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-base font-black text-foreground line-clamp-1">{t.name}</h4>
                        </div>
                        {t.hindi_name && (
                          <p className="text-xs font-bold text-primary mb-2 line-clamp-1">{t.hindi_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {t.description || 'No description entered yet.'}
                        </p>
                        {t.moolnayak_details && (
                          <p className="text-[11px] font-semibold text-foreground/80 line-clamp-1 bg-muted/40 px-2.5 py-1 rounded-lg">
                            <span className="text-muted-foreground">Moolnayak: </span>
                            {t.moolnayak_details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
                      <Link
                        href={`/tirths/${t.slug}`}
                        target="_blank"
                        className="text-[11px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <Icon name="EyeIcon" size={13} />
                        <span>View</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPhotoModalTargetTirth(t);
                            setIsPhotoModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-border hover:border-primary text-xs font-bold text-foreground transition-all flex items-center gap-1"
                        >
                          <Icon name="PhotoIcon" size={13} />
                          <span>Photo</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTirth({ ...t });
                            setIsNewTirthModalOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-1"
                        >
                          <Icon name="PencilSquareIcon" size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTirth(t.slug)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          title="Delete tirth"
                        >
                          <Icon name="TrashIcon" size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {tirthsTotal > 30 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
                <button
                  disabled={tirthPage <= 1}
                  onClick={() => setTirthPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-black uppercase disabled:opacity-30 hover:border-primary transition-all"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-muted-foreground">
                  Page {tirthPage} of {Math.ceil(tirthsTotal / 30)}
                </span>
                <button
                  disabled={tirthPage >= Math.ceil(tirthsTotal / 30)}
                  onClick={() => setTirthPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-black uppercase disabled:opacity-30 hover:border-primary transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. WALLPAPERS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'wallpapers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Upload Wallpaper Card */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="max-w-2xl mb-6">
                <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Icon name="CloudArrowUpIcon" size={20} className="text-primary" />
                  <span>Direct Wallpaper Upload</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload devotional wallpapers directly from your device or paste an external image link. Files are automatically hosted in the website without needing Supabase.
                </p>
              </div>

              <form onSubmit={handleAddWallpaper} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                      Wallpaper Title *
                    </label>
                    <input
                      type="text"
                      value={wpTitle}
                      onChange={(e) => setWpTitle(e.target.value)}
                      placeholder="e.g. Sammed Shikharji Divine Dawn"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={wpCategory}
                      onChange={(e) => setWpCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Temples">Sacred Temples & Basadis</option>
                      <option value="Tirthankara">Tirthankara Idols & Jina Murti</option>
                      <option value="Ahimsa">Ahimsa & Sacred Symbols</option>
                      <option value="Mandala">Dharma Mandala</option>
                      <option value="Tirth Kshetra">Tirth Kshetra Pilgrimage</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Drop Zone */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                    Choose Image File (JPG, PNG, WebP) OR Paste URL
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Drag and drop / file input */}
                    <label className="border-2 border-dashed border-border hover:border-primary/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/20 hover:bg-muted/40">
                      <Icon name="PhotoIcon" size={28} className="text-primary mb-2" />
                      <span className="text-xs font-bold text-foreground">Click to browse from device</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Instant upload to website uploads folder</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            showToast('Uploading & publishing wallpaper...');
                            const url = await handleFileUpload(file, 'wallpapers');
                            if (url) {
                              const titleToUse = wpTitle.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                              try {
                                await fetch('/api/admin/wallpapers', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    title: titleToUse,
                                    url,
                                    category: wpCategory,
                                  }),
                                });
                              } catch {
                                // Supabase trigger already registered it
                              }
                              setWpTitle('');
                              setWpUrl('');
                              showToast('Wallpaper published live!');
                              loadWallpapers();
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Or URL */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground">Or direct image link:</span>
                      <input
                        type="url"
                        value={wpUrl}
                        onChange={(e) => setWpUrl(e.target.value)}
                        placeholder="https://... image.jpg"
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                      />
                      {wpUrl && (
                        <div className="flex items-center gap-3 pt-2">
                          <img src={wpUrl} alt="Preview" className="w-12 h-16 object-cover rounded-lg border border-border shadow-sm" />
                          <span className="text-[11px] text-emerald-400 font-bold">Image ready for publishing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={wpUploading || !wpUrl || !wpTitle}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent disabled:opacity-40 transition-all flex items-center gap-2"
                  >
                    {wpUploading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon name="CheckCircleIcon" size={16} />
                        <span>Publish Wallpaper</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Wallpapers Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-foreground">
                  Published Wallpapers ({wallpapers.length})
                </h3>
                <span className="text-xs font-bold text-muted-foreground">Live on /wallpapers</span>
              </div>

              {wallpapersLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[9/16] rounded-2xl bg-card border border-border animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {wallpapers.map((wp) => (
                    <div
                      key={wp.id}
                      className="group bg-card border border-border hover:border-primary/50 transition-all rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-[9/16] bg-muted overflow-hidden">
                        <img src={wp.url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => handleDeleteWallpaper(wp.id)}
                            className="p-1.5 rounded-lg bg-black/70 hover:bg-destructive text-white backdrop-blur-sm transition-all"
                            title="Delete wallpaper"
                          >
                            <Icon name="TrashIcon" size={13} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-amber-300 backdrop-blur-sm">
                            {wp.category || 'HD JPG'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-black text-foreground line-clamp-1">{wp.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{wp.downloads || 0} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. RINGTONES TAB */}
        {/* ========================================================================= */}
        {activeTab === 'ringtones' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Upload Ringtone Card */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="max-w-2xl mb-6">
                <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Icon name="MusicalNoteIcon" size={20} className="text-primary" />
                  <span>Direct Ringtone & Audio Upload</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload MP3, WAV, or AAC audio files directly from your computer, or paste an audio URL. Plays live on the website /ringtones page with instant download.
                </p>
              </div>

              <form onSubmit={handleAddRingtone} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                      Ringtone Name *
                    </label>
                    <input
                      type="text"
                      value={rtName}
                      onChange={(e) => setRtName(e.target.value)}
                      placeholder="e.g. Navkar Mahamantra Flute Tune"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                      Artist / Chants
                    </label>
                    <input
                      type="text"
                      value={rtArtist}
                      onChange={(e) => setRtArtist(e.target.value)}
                      placeholder="e.g. Sacred Stotra Chimes"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={rtDuration}
                      onChange={(e) => setRtDuration(e.target.value)}
                      placeholder="e.g. 0:45 or 1:12"
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                    Audio File (MP3, WAV, AAC) OR Audio URL
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <label className="border-2 border-dashed border-border hover:border-primary/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/20 hover:bg-muted/40">
                      <Icon name="MusicalNoteIcon" size={28} className="text-primary mb-2" />
                      <span className="text-xs font-bold text-foreground">Click to upload audio from device</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Saves into public/uploads/ringtones/</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            showToast('Uploading audio to server...');
                            const url = await handleFileUpload(file, 'ringtones');
                            if (url) {
                              setRtUrl(url);
                              if (!rtName) setRtName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                              showToast('Audio uploaded successfully!');
                            }
                          }
                        }}
                      />
                    </label>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground">Or audio file URL:</span>
                      <input
                        type="url"
                        value={rtUrl}
                        onChange={(e) => setRtUrl(e.target.value)}
                        placeholder="https://... song.mp3"
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                      />
                      {rtUrl && (
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (audioPlayerRef.current) {
                                audioPlayerRef.current.src = rtUrl;
                                audioPlayerRef.current.play();
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-black flex items-center gap-1.5"
                          >
                            <Icon name="PlayIcon" size={14} />
                            <span>Preview Audio</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={rtUploading || !rtUrl || !rtName}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent disabled:opacity-40 transition-all flex items-center gap-2"
                  >
                    {rtUploading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon name="CheckCircleIcon" size={16} />
                        <span>Publish Ringtone</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Ringtones List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-foreground">
                  Published Ringtones ({ringtones.length})
                </h3>
                <span className="text-xs font-bold text-muted-foreground">Live on /ringtones</span>
              </div>

              {ringtonesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-card border border-border animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {ringtones.map((rt) => {
                    const isPlaying = playingRingtoneId === rt.id;
                    return (
                      <div
                        key={rt.id}
                        className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => togglePlayRingtone(rt)}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                              isPlaying
                                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                          >
                            <Icon name={isPlaying ? 'PauseIcon' : 'PlayIcon'} size={20} />
                          </button>

                          <div>
                            <p className="text-sm font-black text-foreground">{rt.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {rt.artist || 'Devotional'} · {rt.duration || '1:00'} · {rt.downloads || 0} downloads
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={rt.audioUrl}
                            download
                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                            title="Download audio"
                          >
                            <Icon name="ArrowDownTrayIcon" size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteRingtone(rt.id)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            title="Delete ringtone"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. PANCHANG SPECIAL PARV TAB */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Intro */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Panchang Page Special Events
                </span>
                <h3 className="text-xl font-black text-foreground mt-1">
                  Special Jain Parv & Sacred Festivals (विशेष जैन पर्व)
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Directly upload and manage detailed descriptions for sacred events like Diwali (Mahavir Nirvana Kalyanak), Paryushan / Das Lakshan Mahaparv, Mahavir Jayanti, and Akshay Tritiya. All descriptions published here instantly appear in the Special Events section on the Panchang page.
                </p>
              </div>

              <button
                onClick={() => handleOpenEventModal()}
                className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Icon name="PlusIcon" size={16} />
                <span>Add New Parv / Festival</span>
              </button>
            </div>

            {/* Events List */}
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-card border border-border hover:border-primary/50 transition-all rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between"
                  >
                    {/* Optional Image */}
                    {ev.image_url && (
                      <div className="w-full md:w-44 h-32 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {ev.category || 'Maha Parv'}
                        </span>
                        {ev.tithi_date && (
                          <span className="text-xs font-semibold text-muted-foreground">
                            📅 {ev.tithi_date}
                          </span>
                        )}
                        {ev.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
                            {ev.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-black text-foreground">{ev.title}</h4>
                      {ev.hindi_title && (
                        <p className="text-xs font-bold text-primary">{ev.hindi_title}</p>
                      )}

                      <p className="text-xs text-foreground/80 leading-relaxed font-normal line-clamp-2">
                        {ev.description}
                      </p>

                      {ev.rituals && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                          <strong className="text-foreground">Vidhi: </strong>
                          {ev.rituals}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link
                        href="/panchang"
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <Icon name="EyeIcon" size={14} />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleOpenEventModal(ev)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-1"
                      >
                        <Icon name="PencilSquareIcon" size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.slug)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Delete event"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. SUPABASE SQL TOOLS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'sql' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Icon name="CommandLineIcon" size={20} className="text-primary" />
                <span>Supabase Database Schema & Sync</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Your website currently uses a robust direct upload layer with hybrid syncing. If you wish to also create the tables in your Supabase project (rllagzfmqpkzjhxnzxpf.supabase.co), simply copy the SQL below and paste it into the Supabase SQL Editor.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-muted/50 border border-border font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-96">
                <pre>{`-- 1. WALLPAPERS TABLE
CREATE TABLE IF NOT EXISTS public.wallpapers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    width INTEGER DEFAULT 1080,
    height INTEGER DEFAULT 1920,
    format TEXT DEFAULT 'HD JPG',
    category TEXT DEFAULT 'Temples',
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RINGTONES TABLE
CREATE TABLE IF NOT EXISTS public.ringtones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    artist TEXT DEFAULT 'Spiritual Chants',
    duration TEXT DEFAULT '1:00',
    audio_url TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SPECIAL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.special_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    hindi_title TEXT,
    tithi_date TEXT,
    upcoming_date TEXT,
    category TEXT DEFAULT 'Maha Parv',
    badge TEXT DEFAULT 'Festival',
    description TEXT NOT NULL,
    rituals TEXT,
    significance TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Saved file: supabase_admin_tables.sql</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.wallpapers (\n id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n title TEXT NOT NULL,\n url TEXT NOT NULL,\n width INTEGER DEFAULT 1080,\n height INTEGER DEFAULT 1920,\n format TEXT DEFAULT 'HD JPG',\n category TEXT DEFAULT 'Temples',\n downloads INTEGER DEFAULT 0,\n created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.ringtones (\n id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n name TEXT NOT NULL,\n artist TEXT DEFAULT 'Spiritual Chants',\n duration TEXT DEFAULT '1:00',\n audio_url TEXT NOT NULL,\n downloads INTEGER DEFAULT 0,\n created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE IF NOT EXISTS public.special_events (\n id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n slug TEXT UNIQUE NOT NULL,\n title TEXT NOT NULL,\n hindi_title TEXT,\n tithi_date TEXT,\n upcoming_date TEXT,\n category TEXT DEFAULT 'Maha Parv',\n badge TEXT DEFAULT 'Festival',\n description TEXT NOT NULL,\n rituals TEXT,\n significance TEXT,\n image_url TEXT,\n is_active BOOLEAN DEFAULT TRUE,\n created_at TIMESTAMPTZ DEFAULT NOW()\n);`);
                    showToast('SQL script copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-1.5"
                >
                  <Icon name="DocumentDuplicateIcon" size={14} />
                  <span>Copy SQL Code</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: EDIT / CREATE TIRTH */}
      {/* ========================================================================= */}
      {(editingTirth || isNewTirthModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-black text-foreground">
                {isNewTirthModalOpen ? 'Add New Sacred Tirth' : `Edit: ${editingTirth?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingTirth(null);
                  setIsNewTirthModalOpen(false);
                }}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTirth) handleSaveTirth(editingTirth);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Tirth Name (English) *
                  </label>
                  <input
                    type="text"
                    value={editingTirth?.name || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    value={editingTirth?.hindi_name || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, hindi_name: e.target.value } : null)}
                    placeholder="e.g. श्री महावीर जी अतिशय क्षेत्र"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    State *
                  </label>
                  <select
                    value={editingTirth?.state || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, state: e.target.value } : null)}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-primary"
                    required
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={editingTirth?.city || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, city: e.target.value } : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={editingTirth?.tirth_type || 'atishay_kshetra'}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, tirth_type: e.target.value } : null)}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="siddh_kshetra">Siddh Kshetra</option>
                    <option value="atishay_kshetra">Atishay Kshetra</option>
                    <option value="tirth_kshetra">Tirth Kshetra</option>
                    <option value="temple_complex">Temple Complex</option>
                    <option value="historical_site">Heritage Site</option>
                    <option value="temple">Temple / Basadi</option>
                  </select>
                </div>
              </div>

              {/* Cover Photo Direct Upload & URL with Drag and Drop */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1.5">
                  Cover Photo (Drag & Drop, Upload from PC, or Paste Link)
                </label>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!editTirthPhotoUploading) setEditTirthPhotoDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setEditTirthPhotoDragOver(false);
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setEditTirthPhotoDragOver(false);
                    if (editTirthPhotoUploading) return;
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        showToast('Please drop a valid image file (JPG, PNG, WebP)', 'error');
                        return;
                      }
                      setEditTirthPhotoUploading(true);
                      showToast('Uploading cover photo...');
                      const url = await handleFileUpload(file, 'tirths');
                      if (url) {
                        setEditingTirth((prev) => prev ? { ...prev, cover_image_url: url } : null);
                        showToast('Cover photo uploaded successfully!');
                      }
                      setEditTirthPhotoUploading(false);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 transition-all mb-2.5 ${
                    editTirthPhotoDragOver
                      ? 'border-primary bg-primary/15 scale-[1.01]'
                      : 'border-border bg-muted/10 hover:border-primary/50'
                  }`}
                >
                  {editTirthPhotoUploading ? (
                    <div className="flex items-center justify-center gap-3 py-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-foreground">Uploading cover photo to server...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
                          <Icon name="PhotoIcon" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {editTirthPhotoDragOver ? 'Drop image here now!' : 'Drag & drop image here or browse file'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Supports JPG, PNG, WebP (auto-uploads)</p>
                        </div>
                      </div>
                      <label className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-accent transition-all flex items-center gap-1.5 flex-shrink-0">
                        <Icon name="CameraIcon" size={14} />
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setEditTirthPhotoUploading(true);
                              showToast('Uploading photo...');
                              const url = await handleFileUpload(file, 'tirths');
                              if (url) {
                                setEditingTirth((prev) => prev ? { ...prev, cover_image_url: url } : null);
                                showToast('Photo uploaded!');
                              }
                              setEditTirthPhotoUploading(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingTirth?.cover_image_url || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, cover_image_url: e.target.value } : null)}
                    placeholder="Or paste direct image URL: https://... cover.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                  {editingTirth?.cover_image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingTirth((prev) => prev ? { ...prev, cover_image_url: '' } : null)}
                      className="px-3 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-red-400 transition-colors"
                      title="Clear photo"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {editingTirth?.cover_image_url && (
                  <div className="mt-2.5 h-28 w-44 rounded-xl overflow-hidden border border-border relative group">
                    <img src={editingTirth.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Sacred Description * (Displayed on website)
                </label>
                <textarea
                  rows={4}
                  value={editingTirth?.description || ''}
                  onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Detailed spiritual history, miraculous occurrences, ancient background..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-primary"
                  required
                />
              </div>

              {/* Moolnayak & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Moolnayak Bhagwan Details
                  </label>
                  <input
                    type="text"
                    value={editingTirth?.moolnayak_details || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, moolnayak_details: e.target.value } : null)}
                    placeholder="e.g. Bhagwan Parsvanath (Green Jade Padmasana)"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Contact Phone / Trust Office
                  </label>
                  <input
                    type="text"
                    value={editingTirth?.contact_phone || ''}
                    onChange={(e) => setEditingTirth((prev) => prev ? { ...prev, contact_phone: e.target.value } : null)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTirth(null);
                    setIsNewTirthModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent"
                >
                  Save Tirth Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIRECT PHOTO UPLOAD FOR A SPECIFIC TIRTH */}
      {/* ========================================================================= */}
      {isPhotoModalOpen && photoModalTargetTirth && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="pr-4">
                <h3 className="text-base font-black text-foreground">
                  Update Tirth Photo
                </h3>
                <p className="text-xs text-primary font-bold line-clamp-1 mt-0.5">
                  {photoModalTargetTirth.name}
                </p>
              </div>
              <button
                disabled={photoModalUploading}
                onClick={() => {
                  if (photoModalUploading) return;
                  setIsPhotoModalOpen(false);
                  setPhotoModalTargetTirth(null);
                  setPhotoModalPreviewUrl(null);
                }}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                title="Close"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!photoModalUploading) setPhotoModalDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setPhotoModalDragOver(false);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  setPhotoModalDragOver(false);
                  if (photoModalUploading) return;
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    await handlePhotoModalFile(file);
                  }
                }}
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                  photoModalDragOver
                    ? 'border-primary bg-primary/15 scale-[1.01] shadow-lg shadow-primary/10 ring-2 ring-primary/40'
                    : 'border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/30'
                }`}
              >
                {photoModalUploading ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    {photoModalPreviewUrl ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border mb-3 relative shadow-inner">
                        <img
                          src={photoModalPreviewUrl}
                          alt="Uploading preview"
                          className="w-full h-full object-cover blur-[1px] opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    )}
                    <p className="text-xs font-black text-foreground uppercase tracking-wider">Uploading photo...</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Uploading to cloud storage and updating tirth directory</p>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    {photoModalTargetTirth.cover_image_url && !photoModalDragOver ? (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border mb-3 relative group shadow-sm">
                        <img
                          src={photoModalTargetTirth.cover_image_url}
                          alt="Current cover"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="CameraIcon" size={20} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary mb-3">
                        <Icon name="ArrowUpTrayIcon" size={24} />
                      </div>
                    )}
                    <span className="text-xs font-bold text-foreground text-center">
                      {photoModalDragOver ? 'Drop photo here now!' : 'Drag & drop photo here, or click to browse'}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Supports JPG, PNG, WebP (auto-saves immediately)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={photoModalUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handlePhotoModalFile(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Direct URL Alternative */}
              {!photoModalUploading && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-xs font-medium text-muted-foreground">Or paste direct image URL:</span>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="https://... photo.jpg"
                      defaultValue={photoModalTargetTirth.cover_image_url}
                      id="direct-photo-url-input"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const input = document.getElementById('direct-photo-url-input') as HTMLInputElement;
                        if (input?.value?.trim()) {
                          setPhotoModalUploading(true);
                          await handleSaveTirth({
                            slug: photoModalTargetTirth.slug,
                            cover_image_url: input.value.trim(),
                          });
                          setPhotoModalUploading(false);
                          setIsPhotoModalOpen(false);
                          setPhotoModalTargetTirth(null);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent whitespace-nowrap transition-colors"
                    >
                      Save URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SPECIAL EVENT & PARV (PANCHANG) */}
      {/* ========================================================================= */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-lg font-black text-foreground">
                {editingEvent ? `Edit Parv: ${editingEvent.title}` : 'Add New Special Jain Parv / Festival'}
              </h3>
              <button
                onClick={() => setEventModalOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Event Title (e.g. Diwali - Mahavir Nirvana) *
                  </label>
                  <input
                    type="text"
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    placeholder="Diwali — Bhagwan Mahavir Nirvana Mahotsav"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Hindi Title
                  </label>
                  <input
                    type="text"
                    value={evHindiTitle}
                    onChange={(e) => setEvHindiTitle(e.target.value)}
                    placeholder="दीपावली — भगवान महावीर निर्वाण कल्याणक"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Tithi / Day
                  </label>
                  <input
                    type="text"
                    value={evTithiDate}
                    onChange={(e) => setEvTithiDate(e.target.value)}
                    placeholder="Kartik Krishna Amavasya"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Upcoming Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={evUpcomingDate}
                    onChange={(e) => setEvUpcomingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={evCategory}
                    onChange={(e) => setEvCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="Maha Parv">Maha Parv</option>
                    <option value="Nirvana Kalyanak">Nirvana Kalyanak</option>
                    <option value="Janma Kalyanak">Janma Kalyanak</option>
                    <option value="Ahimsa Day">Ahimsa Day</option>
                    <option value="Forgiveness">Forgiveness Parv</option>
                    <option value="Daan Parv">Daan / Parna Parv</option>
                    <option value="Vrat">Vrat & Tithi</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Full Description & Story * (Shown on Panchang Page)
                </label>
                <textarea
                  rows={4}
                  value={evDescription}
                  onChange={(e) => setEvDescription(e.target.value)}
                  placeholder="Explain why this day is sacred in Jainism, story of Nirvana, Kevalgyan, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-primary"
                  required
                />
              </div>

              {/* Rituals & Vidhi */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Pujan Vidhi & Rituals (पूजन एवं अनुष्ठान विधि)
                </label>
                <textarea
                  rows={3}
                  value={evRituals}
                  onChange={(e) => setEvRituals(e.target.value)}
                  placeholder="1. Nirvana Ladoo offering in morning\n2. Ghee Deepak lighting\n3. Jaap and recitation"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>

              {/* Significance */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Spiritual Significance (धार्मिक महत्व)
                </label>
                <input
                  type="text"
                  value={evSignificance}
                  onChange={(e) => setEvSignificance(e.target.value)}
                  placeholder="Spiritual message of the festival"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                />
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Event Banner Image (Upload from PC or Paste Link)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={evImageUrl}
                    onChange={(e) => setEvImageUrl(e.target.value)}
                    placeholder="https://... image.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black cursor-pointer hover:bg-primary/20 transition-all flex items-center gap-1.5">
                    <Icon name="CameraIcon" size={14} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          showToast('Uploading event banner...');
                          const url = await handleFileUpload(file, 'events');
                          if (url) {
                            setEvImageUrl(url);
                            showToast('Banner uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={evSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-accent"
                >
                  {evSubmitting ? 'Saving...' : 'Publish to Panchang Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
      }`}
    >
      <Icon name={icon} size={15} />
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border/80 hover:border-primary/50 transition-all rounded-3xl p-5 shadow-sm cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-muted/50 ${color} group-hover:scale-110 transition-transform`}>
          <Icon name={icon} size={18} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-black text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{subtitle}</p>
    </div>
  );
}

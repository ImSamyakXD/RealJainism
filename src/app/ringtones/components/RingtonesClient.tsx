'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Ringtone {
  id: string;
  name: string;
  artist?: string;
  duration: string;
  audioUrl: string;
  downloads: number;
}

const fallbackRingtones: Ringtone[] = [
  {
    id: '1',
    name: 'Navkar Mantra Peace Tune',
    artist: 'Spiritual Chants',
    duration: '0:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-bell-112338.mp3',
    downloads: 1420,
  },
  {
    id: '2',
    name: 'Jai Jinendra Stavan Flute',
    artist: 'Devotional Flute',
    duration: '1:12',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73367.mp3?filename=flute-meditation-14257.mp3',
    downloads: 2890,
  },
  {
    id: '3',
    name: 'Mahavir Janma Kalyanak Dhun',
    artist: 'Jain Stotra',
    duration: '1:30',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884ca46961.mp3?filename=ambient-spiritual-11538.mp3',
    downloads: 3100,
  },
  {
    id: '4',
    name: 'Bhaktamar Stotra Chime',
    artist: 'Sacred Chimes',
    duration: '0:50',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=zen-bell-18652.mp3',
    downloads: 1950,
  },
  {
    id: '5',
    name: 'Jain Temple Sacred Bell',
    artist: 'Temple Rituals',
    duration: '0:35',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_34b3f5b721.mp3?filename=temple-gong-sound-24344.mp3',
    downloads: 4120,
  },
  {
    id: '6',
    name: 'Mangalam Bhagwan Mahaviro Aarti',
    artist: 'Aarti Collection',
    duration: '1:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_99397943fa.mp3?filename=indian-meditation-124976.mp3',
    downloads: 2540,
  },
];

export default function RingtonesClient() {
  const [ringtonesList, setRingtonesList] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch ringtones from Supabase asynchronously
  useEffect(() => {
    async function fetchRingtonesFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('ringtones')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch notice (using fallback):', error.message);
          setRingtonesList(fallbackRingtones);
        } else if (data && data.length > 0) {
          const mapped: Ringtone[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artist || 'Jain Stavan',
            duration: item.duration || '1:00',
            audioUrl: item.audio_url || item.audioUrl,
            downloads: item.downloads || 0,
          }));
          setRingtonesList(mapped);
        } else {
          setRingtonesList(fallbackRingtones);
        }
      } catch (e) {
        console.warn('Supabase connection error:', e);
        setRingtonesList(fallbackRingtones);
      } finally {
        setLoading(false);
      }
    }

    fetchRingtonesFromSupabase();
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayToggle = (rt: Ringtone) => {
    if (playingId === rt.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(rt.audioUrl);
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setPlayingId(null);
        setCurrentTime(0);
      });

      audio.play().catch((err) => {
        console.warn('Playback error:', err);
      });
      setPlayingId(rt.id);
    }
  };

  const handleDownload = async (rt: Ringtone) => {
    setDownloadingId(rt.id);
    try {
      const res = await fetch(rt.audioUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${rt.name.replace(/[^a-zA-Z0-9_\-]/g, '_')}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement('a');
      link.href = rt.audioUrl;
      link.download = `${rt.name}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredRingtones = ringtonesList.filter((rt) =>
    rt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rt.artist && rt.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-motto text-primary mb-2 opacity-80">Devotional Audio Downloads</p>
          <h1 className="text-section-xl text-foreground uppercase tracking-tight">
            Jain <span className="gold-gradient-text">Ringtones.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Listen, preview, and download peaceful Jain spiritual ringtones and mantras for your phone.
          </p>
        </div>

        {/* Cross-Link Banner to Wallpapers */}
        <Link
          href="/wallpapers"
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/30 hover:border-primary text-foreground text-xs font-bold shadow-xs hover:shadow-md transition-all self-start md:self-auto"
        >
          <span>🖼️ Looking for Wallpapers?</span>
          <Icon name="ArrowRightIcon" size={14} className="text-primary" />
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ringtones by title..."
            className="w-full bg-card border border-border text-foreground text-xs sm:text-sm px-4 py-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-xs"
          />
          <Icon
            name="MagnifyingGlassIcon"
            size={18}
            className="absolute left-3 top-3.5 text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 bg-muted/40 border border-border rounded-xl p-4 flex gap-3 items-start">
        <Icon name="InformationCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Note:</strong> All ringtones are free to download for personal devotional use. Downloaded MP3 files can be set directly as your mobile ringtone or alarm chime.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-card/50 border border-border/60 rounded-2xl p-5 animate-pulse flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted/70" />
                <div className="space-y-2">
                  <div className="w-44 h-4 bg-muted/80 rounded" />
                  <div className="w-28 h-3 bg-muted/50 rounded" />
                </div>
              </div>
              <div className="w-28 h-9 bg-muted/70 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        /* Ringtones Grid / List */
        <div className="space-y-3.5">
          {filteredRingtones.map((rt) => {
            const isPlaying = playingId === rt.id;
            const progressPercent = isPlaying && duration > 0 ? (currentTime / duration) * 100 : 0;

            return (
              <div
                key={rt.id}
                className={`bg-card border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md ${
                  isPlaying ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Play / Pause Toggle Button */}
                    <button
                      onClick={() => handlePlayToggle(rt)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
                        isPlaying
                          ? 'bg-primary text-primary-foreground scale-105'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                      aria-label={isPlaying ? 'Pause ringtone' : 'Play ringtone'}
                    >
                      <Icon
                        name={isPlaying ? 'PauseIcon' : 'PlayIcon'}
                        size={20}
                        variant="solid"
                      />
                    </button>

                    {/* Title & Artist */}
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-foreground truncate">{rt.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-medium">
                        <span>{rt.artist}</span>
                        <span>·</span>
                        <span>{rt.duration}</span>
                        <span>·</span>
                        <span className="text-emerald-600 font-semibold">{rt.downloads} downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Action */}
                  <button
                    onClick={() => handleDownload(rt)}
                    disabled={downloadingId === rt.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xs flex-shrink-0 disabled:opacity-50"
                  >
                    <Icon name="ArrowDownTrayIcon" size={16} />
                    <span className="hidden sm:inline">
                      {downloadingId === rt.id ? 'Downloading...' : 'Download MP3'}
                    </span>
                  </button>
                </div>

                {/* Live Audio Progress Bar */}
                {isPlaying && (
                  <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {Math.floor(currentTime)}s / {Math.floor(duration || 0)}s
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRingtones.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-2xl p-6">
              <p className="text-sm text-muted-foreground font-medium">
                No ringtones found matching "{searchQuery}".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Community Contribution Notice */}
      <div className="mt-12 text-center bg-card border border-border rounded-3xl p-6 sm:p-8">
        <h3 className="font-bold text-base text-foreground mb-2">Want to upload your ringtones or wallpapers?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
          Contact our Telegram bot and send the image in doc format or join the channel to submit your devotional media.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://t.me/real_jainism"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md"
          >
            Join Telegram Channel
          </a>
          <a
            href="https://t.me/real_jainism_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-primary/40 hover:border-primary text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all shadow-sm"
          >
            Telegram Bot
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Wallpaper {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  format: string;
  downloads: number;
}

interface Ringtone {
  id: string;
  name: string;
  artist: string;
  duration: string;
  audioUrl: string;
}

const fallbackWallpapers: Wallpaper[] = [
  {
    id: 'wp-1',
    title: 'Jain Temple Serenity',
    url: 'https://i.pinimg.com/1200x/d2/04/6b/d2046bc9a771f71311ff475024e4ec1f.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 1840,
  },
  {
    id: 'wp-2',
    title: 'Golden Tirthankara Light',
    url: 'https://i.pinimg.com/736x/70/15/5c/70155c5730bfd1015fbcbc5b8c15e6ef.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 2430,
  },
  {
    id: 'wp-3',
    title: 'Peaceful Dharma Mandala',
    url: 'https://i.pinimg.com/736x/e8/64/12/e86412a3c9eb8676c1917ff12b9153aa.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 3120,
  },
  {
    id: 'wp-4',
    title: 'Sacred Lotus Ahimsa',
    url: 'https://i.pinimg.com/736x/35/e7/87/35e787de8aa2d245abf5c8f492099738.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 1560,
  },
  {
    id: 'wp-5',
    title: 'Spiritual Girnar Path',
    url: 'https://i.pinimg.com/736x/9f/81/72/9f8172a25b622da3e7cb31852f1e52fa.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 2980,
  },
  {
    id: 'wp-6',
    title: 'Dharma Chakra Symbol',
    url: 'https://i.pinimg.com/736x/ff/d2/03/ffd2034b5f975b6289d5490aadf8907a.jpg',
    width: 1080,
    height: 1920,
    format: 'HD JPG',
    downloads: 4100,
  },
];

const sampleRingtones: Ringtone[] = [
  {
    id: 'rt-1',
    name: 'Navkar Mantra Peace Tune',
    artist: 'Spiritual Chants',
    duration: '0:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-bell-112338.mp3',
  },
  {
    id: 'rt-2',
    name: 'Jai Jinendra Stavan Flute',
    artist: 'Devotional Flute',
    duration: '1:12',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73367.mp3?filename=flute-meditation-14257.mp3',
  },
  {
    id: 'rt-3',
    name: 'Jain Temple Sacred Bell',
    artist: 'Temple Rituals',
    duration: '0:35',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_34b3f5b721.mp3?filename=temple-gong-sound-24344.mp3',
  },
];

export default function WallpapersClient() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingRingtoneId, setPlayingRingtoneId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch wallpapers from Supabase dynamically
  useEffect(() => {
    async function fetchWallpapersFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('wallpapers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch notice (using fallback):', error.message);
          setWallpapers(fallbackWallpapers);
        } else if (data && data.length > 0) {
          const mapped: Wallpaper[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            url: item.image_url || item.url,
            width: item.width || 1080,
            height: item.height || 1920,
            format: item.format || 'HD JPG',
            downloads: item.downloads || 0,
          }));
          setWallpapers(mapped);
        } else {
          setWallpapers(fallbackWallpapers);
        }
      } catch (e) {
        console.warn('Supabase connection error:', e);
        setWallpapers(fallbackWallpapers);
      } finally {
        setLoading(false);
      }
    }

    fetchWallpapersFromSupabase();
  }, []);

  // Direct Blob Download Handler to bypass cross-origin browser opening
  const handleDownloadWallpaper = async (wp: Wallpaper) => {
    setDownloadingId(wp.id);
    try {
      const res = await fetch(wp.url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${wp.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct blob fetch failed, triggering standard download link:', err);
      const link = document.createElement('a');
      link.href = wp.url;
      link.download = `${wp.title}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePlayRingtone = (rt: Ringtone) => {
    if (playingRingtoneId === rt.id) {
      audioRef.current?.pause();
      setPlayingRingtoneId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(rt.audioUrl);
      audioRef.current = audio;
      audio.play().catch((e) => console.warn('Audio play error:', e));
      audio.onended = () => setPlayingRingtoneId(null);
      setPlayingRingtoneId(rt.id);
    }
  };

  const handleDownloadRingtone = async (rt: Ringtone) => {
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
    }
  };

  const filteredWallpapers = wallpapers.filter((wp) =>
    wp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-motto text-primary mb-2 opacity-80">HD Wallpapers & Ringtones</p>
          <h1 className="text-section-xl text-foreground uppercase tracking-tight">
            Jain <span className="gold-gradient-text">Media Library.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Beautiful devotional wallpapers and peaceful ringtones for your phone and personal spiritual practice.
          </p>
        </div>

        {/* Navigation Banner to Ringtones Page */}
        <Link
          href="/ringtones"
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/30 hover:border-primary text-foreground text-xs font-bold shadow-xs hover:shadow-md transition-all self-start md:self-auto"
        >
          <span>🎵 Explore All Ringtones</span>
          <Icon name="ArrowRightIcon" size={14} className="text-primary" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wallpapers..."
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

      {/* Loading Skeleton for Wallpapers */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-14">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-card/60 border border-border/50 aspect-[9/16] animate-pulse" />
          ))}
        </div>
      ) : (
        /* Wallpapers Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-14">
          {filteredWallpapers.map((wp) => (
            <div
              key={wp.id}
              onClick={() => setSelectedWallpaper(wp)}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border aspect-[9/16] cursor-pointer card-hover shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <AppImage
                src={wp.url}
                alt={wp.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-[11px] font-bold text-foreground truncate mb-1">{wp.title}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{wp.format}</span>
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold">
                    Preview
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedWallpaper && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-card border border-border rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedWallpaper(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-colors"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>

            {/* Preview Image */}
            <div className="relative w-full aspect-[9/16] max-h-[50vh] rounded-2xl overflow-hidden mb-4 border border-border/60">
              <AppImage
                src={selectedWallpaper.url}
                alt={selectedWallpaper.title}
                fill
                className="object-contain bg-black/40"
              />
            </div>

            {/* Wallpaper Details */}
            <h3 className="font-extrabold text-base text-foreground mb-1">{selectedWallpaper.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Resolution: {selectedWallpaper.width} x {selectedWallpaper.height} • Format: {selectedWallpaper.format}
            </p>

            {/* Direct Download Action Button */}
            <button
              onClick={() => handleDownloadWallpaper(selectedWallpaper)}
              disabled={downloadingId === selectedWallpaper.id}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest text-center shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Icon name="ArrowDownTrayIcon" size={16} />
              {downloadingId === selectedWallpaper.id ? 'Downloading File...' : 'Download High Resolution Wallpaper'}
            </button>
          </div>
        </div>
      )}

      {/* Community Contribution Notice */}
      <div className="text-center bg-card border border-border rounded-3xl p-6 sm:p-8">
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
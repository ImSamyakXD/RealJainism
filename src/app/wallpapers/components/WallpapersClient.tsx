'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  display_name?: string;
}

// Cloudinary config — cloud name from provided URL
const CLOUD_NAME = 'dlhzfsik';

// Mock wallpapers using Cloudinary-style URLs with Pexels fallback
// In production, replace with actual Cloudinary API fetch using server-side route
const mockWallpapers: CloudinaryResource[] = [
  {
    public_id: 'jain_wallpaper_1',
    secure_url: 'https://i.pinimg.com/1200x/d2/04/6b/d2046bc9a771f71311ff475024e4ec1f.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Jain Temple Serenity',
  },
  {
    public_id: 'jain_wallpaper_2',
    secure_url: 'https://i.pinimg.com/736x/70/15/5c/70155c5730bfd1015fbcbc5b8c15e6ef.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Golden Temple Light',
  },
  {
    public_id: 'jain_wallpaper_3',
    secure_url: 'https://i.pinimg.com/736x/e8/64/12/e86412a3c9eb8676c1917ff12b9153aa.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Peaceful Mandala',
  },
  {
    public_id: 'jain_wallpaper_4',
    secure_url: 'https://i.pinimg.com/736x/35/e7/87/35e787de8aa2d245abf5c8f492099738.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Sacred Lotus',
  },
  {
    public_id: 'jain_wallpaper_5',
    secure_url: 'https://i.pinimg.com/736x/9f/81/72/9f8172a25b622da3e7cb31852f1e52fa.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Spiritual Path',
  },
  {
    public_id: 'jain_wallpaper_6',
    secure_url: 'https://i.pinimg.com/736x/ff/d2/03/ffd2034b5f975b6289d5490aadf8907a.jpg',
    width: 800, height: 1200, format: 'jpg',
    display_name: 'Dharma Symbol',
  },
];

const mockRingtones = [
  { id: '1', name: 'Jai Jinendra Stavan', duration: '2:34', category: 'Stavan' },
  { id: '2', name: 'Navkar Mantra', duration: '1:12', category: 'Mantra' },
  { id: '3', name: 'Mahavir Janma Kalyanak', duration: '3:05', category: 'Devotional' },
  { id: '4', name: 'Parshvanath Stuti', duration: '2:18', category: 'Stuti' },
  { id: '5', name: 'Samayik Bell', duration: '0:30', category: 'Bell' },
  { id: '6', name: 'Aarti Dhun', duration: '1:45', category: 'Aarti' },
];

export default function WallpapersClient() {
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'ringtones'>('wallpapers');
  const [wallpapers] = useState<CloudinaryResource[]>(mockWallpapers);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Scroll to ringtones if hash present
  useEffect(() => {
    if (window.location.hash === '#ringtones') {
      setActiveTab('ringtones');
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-motto text-primary mb-3 opacity-70">Downloads</p>
        <h1 className="text-section-xl text-foreground uppercase">
          Jain <span className="gold-gradient-text">Media.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground font-medium max-w-lg leading-relaxed">
          Beautiful devotional wallpapers and ringtones for your daily spiritual practice.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border pb-4">
        <button
          onClick={() => setActiveTab('wallpapers')}
          className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'wallpapers' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          🖼 Wallpapers
        </button>
        <button
          id="ringtones"
          onClick={() => setActiveTab('ringtones')}
          className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'ringtones' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          🎵 Ringtones
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 bg-muted/50 border border-border rounded-xl px-5 py-4 flex gap-3 items-start">
        <Icon name="InformationCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          <strong className="text-foreground">Disclaimer:</strong> These images and audio files are collected from various free and open sources on the internet. RealJainism does not solely own the copyright or authority over this content. If you believe any content infringes your rights or needs to be removed, please{' '}
          <a href="/#contact" className="text-primary underline hover:text-accent transition-colors">
            contact us via the Contact page
          </a>.
        </p>
      </div>

      {/* Wallpapers Grid */}
      {activeTab === 'wallpapers' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {wallpapers.map((wp, idx) => (
            <WallpaperCard key={wp.public_id} wallpaper={wp} index={idx} />
          ))}
        </div>

      )}
  <p className="text-center text-xs text-muted-foreground pt-4 font-medium">
                      More Wallpapers coming soon. Connect with our{' '}
                      <a href="https://t.me/real_jainism" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                        Telegram channel
                      </a>{' '}
                      for updates and suggestion.
                    </p>

      {/* Ringtones List */}
      {activeTab === 'ringtones' && (
        <div className="space-y-3">
          {mockRingtones.map((rt) => (
            <div
              key={rt.id}
              className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 card-hover"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPlayingId(playingId === rt.id ? null : rt.id)}
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 hover:bg-primary/30 transition-colors"
                  aria-label={playingId === rt.id ? 'Pause' : 'Play'}
                >
                  <Icon
                    name={playingId === rt.id ? 'PauseIcon' : 'PlayIcon'}
                    size={18}
                    className="text-primary"
                    variant="solid"
                  />
                </button>
                <div>
                  <p className="text-sm font-black text-foreground">{rt.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {rt.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{rt.duration}</span>
                  </div>
                </div>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors min-h-[44px] px-2"
                aria-label={`Download ${rt.name}`}
              >
                <Icon name="ArrowDownTrayIcon" size={16} />
                <span className="hidden sm:inline">Download</span>
              </a>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground pt-4 font-medium">
            More ringtones coming soon. Connect with our{' '}
            <a href="https://t.me/real_jainism" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
              Telegram channel
            </a>{' '}
            for updates.
          </p>
        </div>
      )}
    </div>
  );
}

function WallpaperCard({ wallpaper, index }: { wallpaper: CloudinaryResource; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-muted aspect-[9/16] card-hover cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AppImage
        src={wallpaper.secure_url}
        alt={`${wallpaper.display_name || 'Jain devotional wallpaper'} — serene temple artwork with warm golden tones, suitable for phone wallpaper`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      />
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Download button */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-[10px] font-black text-foreground mb-2 truncate">
          {wallpaper.display_name || `Wallpaper ${index + 1}`}
        </p>
        <a
          href={wallpaper.secure_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 w-full bg-primary text-primary-foreground py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
          aria-label={`Download ${wallpaper.display_name || 'wallpaper'}`}
        >
          <Icon name="ArrowDownTrayIcon" size={12} />
          Download
        </a>
      </div>
    </div>
  );
}
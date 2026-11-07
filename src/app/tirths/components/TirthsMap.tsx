'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string;
}

interface Props {
  tirths: Tirth[];
  selectedCategory: string; // 'all' | 'atishay' | 'siddh' | 'heritage'
  onSelectCategory: (cat: string) => void;
  onBackToGrid: () => void;
  initialCity?: string;
}

// Major Indian cities database for instant fast lookup
const INDIAN_CITIES: Record<string, [number, number]> = {
  'jaipur': [26.9124, 75.7873],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'indore': [22.7196, 75.8577],
  'bhopal': [23.2599, 77.4126],
  'gwalior': [26.2183, 78.1828],
  'mumbai': [19.0760, 72.8777],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'hyderabad': [17.3850, 78.4867],
  'kolkata': [22.5726, 88.3639],
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'agra': [27.1767, 78.0081],
  'jabalpur': [23.1815, 79.9864],
  'sagar': [23.8388, 78.7378],
  'lalitpur': [24.6896, 78.4116],
  'tikamgarh': [24.7438, 78.8311],
  'kota': [25.2138, 75.8648],
  'ajmer': [26.4499, 74.6399],
  'udaipur': [24.5854, 73.7125],
  'nashik': [19.9975, 73.7898],
  'nagpur': [21.1458, 79.0882],
  'patna': [25.5941, 85.1376],
  'ranchi': [23.3441, 85.3096],
  'varanasi': [25.3176, 82.9739],
  'meerut': [28.9845, 77.7064],
  'jhansi': [25.4484, 78.5685],
  'damoh': [23.8323, 79.4422],
  'chhatarpur': [24.9164, 79.5946],
  'solapur': [17.6599, 75.9064],
  'kolhapur': [16.7050, 74.2433],
  'mangaluru': [12.9141, 74.8560],
  'mysuru': [12.2958, 76.6394],
};

// Category styling metadata
const CATEGORIES: Record<string, { label: string; color: string; border: string; bg: string; dot: string }> = {
  all: { label: 'All Tirths', color: '#E8B86D', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
  atishay: { label: 'Atishay Kshetra', color: '#F43F5E', border: 'border-rose-500/40', bg: 'bg-rose-500/10', dot: 'bg-rose-500' },
  siddh: { label: 'Siddha Kshetra', color: '#8B5CF6', border: 'border-purple-500/40', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
  heritage: { label: 'Heritage & Historical', color: '#0284C7', border: 'border-sky-500/40', bg: 'bg-sky-500/10', dot: 'bg-sky-500' },
};

function getTirthGroup(type: string): string {
  if (type === 'siddh_kshetra') return 'siddh';
  if (type === 'atishay_kshetra') return 'atishay';
  if (type === 'historical_site' || type === 'temple_complex' || type === 'tirth_kshetra') return 'heritage';
  return 'heritage';
}

function getMarkerColor(type: string): { bg: string; border: string; glow: string } {
  if (type === 'siddh_kshetra') {
    return { bg: '#8B5CF6', border: '#C4B5FD', glow: 'rgba(139, 92, 246, 0.45)' };
  }
  if (type === 'atishay_kshetra') {
    return { bg: '#F43F5E', border: '#FECDD3', glow: 'rgba(244, 63, 94, 0.45)' };
  }
  if (type === 'historical_site' || type === 'temple_complex') {
    return { bg: '#0284C7', border: '#BAE6FD', glow: 'rgba(2, 132, 199, 0.45)' };
  }
  return { bg: '#C8965A', border: '#FDE68A', glow: 'rgba(200, 150, 90, 0.45)' };
}

function getDistanceKm(lat1: number, lon1: number, lat2?: number | null, lon2?: number | null): number | null {
  if (lat2 == null || lon2 == null || isNaN(Number(lat2)) || isNaN(Number(lon2))) return null;
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);
  const R = 6371;
  const dLat = ((numLat2 - lat1) * Math.PI) / 180;
  const dLon = ((numLon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((numLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function TirthsMap({
  tirths,
  selectedCategory,
  onSelectCategory,
  onBackToGrid,
  initialCity = '',
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [cityInput, setCityInput] = useState(initialCity);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [userLocationName, setUserLocationName] = useState<string>('');
  const [locating, setLocating] = useState(false);
  const [showNearbyDrawer, setShowNearbyDrawer] = useState(false);

  // Filter tirths by category
  const filteredTirths = useMemo(() => {
    if (selectedCategory === 'all') return tirths;
    return tirths.filter((t) => getTirthGroup(t.tirth_type) === selectedCategory);
  }, [tirths, selectedCategory]);

  // Compute nearby tirths sorted by distance
  const nearbyTirths = useMemo(() => {
    if (!userCoords) return [];
    return tirths
      .filter((t) => t.latitude != null && t.longitude != null && !isNaN(Number(t.latitude)) && !isNaN(Number(t.longitude)))
      .map((t) => ({
        ...t,
        distance: getDistanceKm(userCoords[0], userCoords[1], t.latitude, t.longitude) ?? 999999,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [tirths, userCoords]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on central India
    const map = L.map(mapContainerRef.current, {
      center: [23.2, 78.8],
      zoom: 5.4,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
    });

    // Add zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever filtered tirths change or user coordinates update
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredTirths.forEach((tirth) => {
      if (
        tirth.latitude == null ||
        tirth.longitude == null ||
        isNaN(Number(tirth.latitude)) ||
        isNaN(Number(tirth.longitude))
      ) {
        return;
      }
      const lat = Number(tirth.latitude);
      const lon = Number(tirth.longitude);
      const colors = getMarkerColor(tirth.tirth_type);
      const dist = userCoords
        ? getDistanceKm(userCoords[0], userCoords[1], lat, lon)
        : null;

      // Custom HTML Pin
      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background: ${colors.bg};
            border: 2px solid ${colors.border};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 14px ${colors.glow};
            transition: transform 0.2s ease;
          "></div>
          <div style="
            position: relative;
            z-index: 2;
            width: 10px;
            height: 10px;
            background: #ffffff;
            border-radius: 50%;
            margin-top: -3px;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-tirth-pin',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      const popupHtml = `
        <div style="font-family: inherit; width: 260px; color: #1e1e1e;">
          <div style="position: relative; height: 110px; border-radius: 10px; overflow: hidden; margin-bottom: 8px;">
            <img src="${tirth.cover_image_url || '/assets/images/tirth-finder-fallback.png'}" alt="${tirth.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/tirth-finder-fallback.png'" />
            <div style="position: absolute; top: 6px; left: 6px; background: ${colors.bg}; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; text-transform: uppercase;">
              ${tirth.tirth_type.replace('_', ' ')}
            </div>
          </div>
          <h4 style="margin: 0; font-size: 13px; font-weight: 900; line-height: 1.25; color: #111;">${tirth.name}</h4>
          ${tirth.hindi_name ? `<p style="margin: 2px 0 6px 0; font-size: 11px; color: #8C6D3B; font-weight: 700;">${tirth.hindi_name}</p>` : ''}
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #555;">📍 ${tirth.city}, ${tirth.state}</p>
          ${dist !== null ? `<div style="display: inline-block; background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-bottom: 8px;">⚡ ${dist} km from your location</div>` : ''}
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="/tirths/${tirth.slug}" style="flex: 1; text-align: center; background: #C8965A; color: #ffffff; font-size: 11px; font-weight: 800; padding: 6px 10px; border-radius: 6px; text-decoration: none;">View Details</a>
            <a href="${tirth.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${tirth.latitude},${tirth.longitude}`}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; background: #f3f4f6; color: #111; font-size: 11px; font-weight: 800; padding: 6px 10px; border-radius: 6px; text-decoration: none;">Map ↗</a>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lon], { icon: customIcon });
      marker.bindPopup(popupHtml, { maxWidth: 280 });
      markersLayer.addLayer(marker);
    });
  }, [filteredTirths, userCoords]);

  // Handle User City Search
  const handleCitySearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCity = cityInput.trim().toLowerCase();
    if (!cleanCity) return;

    // Check predefined dictionary
    if (INDIAN_CITIES[cleanCity]) {
      const coords = INDIAN_CITIES[cleanCity];
      setUserCoords(coords);
      setUserLocationName(cityInput.trim());
      focusLocation(coords[0], coords[1], cityInput.trim());
      setShowNearbyDrawer(true);
      return;
    }

    // Fallback: OpenStreetMap Nominatim Geocoding API
    try {
      setLocating(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
          cityInput.trim()
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const coords: [number, number] = [lat, lon];
        setUserCoords(coords);
        setUserLocationName(cityInput.trim());
        focusLocation(lat, lon, cityInput.trim());
        setShowNearbyDrawer(true);
      } else {
        alert(`Could not pinpoint "${cityInput}". Please check spelling or select from quick cities.`);
      }
    } catch {
      alert('Network error while searching location. Please select a city.');
    } finally {
      setLocating(false);
    }
  };

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords([lat, lon]);
        setUserLocationName('My Current Location');
        setCityInput('Current Location');
        focusLocation(lat, lon, 'Your Location');
        setShowNearbyDrawer(true);
        setLocating(false);
      },
      (err) => {
        alert('Could not obtain your GPS location. Please type your city name.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Center map on location with pulsing user pin
  const focusLocation = (lat: number, lon: number, label: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Glowing user location pin
    const userPinHtml = `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(6, 182, 212, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #06B6D4; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(6, 182, 212, 0.8);"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: userPinHtml,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = L.marker([lat, lon], { icon: userIcon }).addTo(map);
    marker.bindPopup(`<b>📍 ${label}</b><br><span style="font-size:11px;">Search Origin Point</span>`).openPopup();
    userMarkerRef.current = marker;

    map.flyTo([lat, lon], 7, { duration: 1.2 });
  };

  // Reset to India Overview
  const handleResetIndiaView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([23.2, 78.8], 5.4, { duration: 1 });
  };

  // Fly to specific tirth
  const handleFlyToTirth = (tirth: Tirth) => {
    const map = mapInstanceRef.current;
    if (
      !map ||
      tirth.latitude == null ||
      tirth.longitude == null ||
      isNaN(Number(tirth.latitude)) ||
      isNaN(Number(tirth.longitude))
    ) {
      return;
    }
    map.flyTo([Number(tirth.latitude), Number(tirth.longitude)], 12, { duration: 1 });
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border bg-card shadow-2xl flex flex-col">

      {/* ── Top Header Bar (Screenshot 2 style) ───────────── */}
      <div className="bg-[#120E09] border-b border-border/70 p-4 sm:p-5 flex flex-col gap-4">
        
        {/* Row 1: Back, Title, Locate Me, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Back button */}
          <button
            onClick={onBackToGrid}
            className="flex items-center gap-2 bg-muted/60 hover:bg-muted text-foreground px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-border transition-all"
          >
            <Icon name="ArrowLeftIcon" size={14} />
            Back to Grid
          </button>

          {/* Title banner */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-foreground">
              All-India Sacred Digambar Pilgrimage Map
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-bold">
              ({filteredTirths.length} Tirths)
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Locate Me */}
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <Icon name="MapPinIcon" size={13} />
              {locating ? 'Locating...' : 'Locate Me'}
            </button>

            {/* Reset India View */}
            <button
              onClick={handleResetIndiaView}
              className="flex items-center gap-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              title="Reset View to All India"
            >
              <Icon name="GlobeAsiaAustraliaIcon" size={14} />
              India View
            </button>
          </div>
        </div>

        {/* Row 2: Search City Input & Quick Cities */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* City Search Form */}
          <form onSubmit={handleCitySearch} className="relative flex-1">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Put your city to find nearby tirths (e.g. Jaipur, Indore, Delhi, Bhopal, Gwalior)..."
              className="w-full bg-[#1A140E] border border-border rounded-full pl-10 pr-24 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Search City
            </button>
          </form>

          {/* Nearby Drawer Toggle Button */}
          {userCoords && (
            <button
              onClick={() => setShowNearbyDrawer(!showNearbyDrawer)}
              className="flex items-center justify-center gap-1.5 bg-yellow-400/15 hover:bg-yellow-400/25 border border-yellow-400/40 text-yellow-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all"
            >
              <Icon name="SparklesIcon" size={14} />
              {showNearbyDrawer ? 'Hide Nearby' : `Nearby Tirths (${nearbyTirths.length})`}
            </button>
          )}
        </div>

        {/* Row 3: Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
            Filter by:
          </span>

          {Object.entries(CATEGORIES).map(([key, item]) => {
            const count =
              key === 'all'
                ? tirths.length
                : tirths.filter((t) => getTirthGroup(t.tirth_type) === key).length;
            const isActive = selectedCategory === key;

            return (
              <button
                key={key}
                onClick={() => onSelectCategory(key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  isActive
                    ? `${item.bg} ${item.border} text-foreground ring-1 ring-primary/40`
                    : 'bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Map Canvas & Nearby Drawer ───────────────── */}
      <div className="relative w-full h-[600px] sm:h-[680px]">
        
        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Legend Overlay (Bottom-left) */}
        <div className="absolute bottom-4 left-4 z-[400] bg-[#120E09]/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-xl max-w-xs hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
            Map Legend
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
              <span>Siddha Kshetra (Nirvana Bhoomi)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span>Atishay Kshetra (Miraculous)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="w-3 h-3 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
              <span>Heritage & Ancient Complex</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="w-3 h-3 rounded-full bg-[#06B6D4] ring-2 ring-white/50" />
              <span>Your Search Location</span>
            </div>
          </div>
        </div>

        {/* Nearby Tirths Sliding Drawer (Right Side) */}
        {showNearbyDrawer && userCoords && (
          <div className="absolute top-4 right-4 bottom-4 z-[400] w-80 sm:w-96 bg-[#120E09]/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-border/70 flex items-center justify-between bg-card/60">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Proximity Finder
                </p>
                <h4 className="text-sm font-black text-foreground">
                  Nearby from {userLocationName}
                </h4>
              </div>
              <button
                onClick={() => setShowNearbyDrawer(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            {/* List of Nearby Tirths */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {nearbyTirths.map((t, idx) => {
                const group = getTirthGroup(t.tirth_type);
                const meta = CATEGORIES[group] || CATEGORIES.all;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleFlyToTirth(t)}
                    className="group bg-[#1A140E] hover:bg-[#251C14] border border-border rounded-xl p-3 cursor-pointer transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.border} ${meta.bg} text-foreground`}>
                        {meta.label}
                      </span>
                      <span className="text-xs font-black text-amber-400 font-mono">
                        {t.distance} km away
                      </span>
                    </div>

                    <h5 className="text-xs font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                      {idx + 1}. {t.name}
                    </h5>

                    <p className="text-[11px] text-muted-foreground font-medium">
                      📍 {t.city}, {t.state}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-primary mt-1 border-t border-border/40">
                      <span>Tap to focus on map</span>
                      <Link
                        href={`/tirths/${t.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="underline hover:text-accent"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

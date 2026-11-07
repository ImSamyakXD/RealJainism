-- ==============================================================================
-- Real Jainism — Admin Tables (Wallpapers, Ringtones, Special Events)
-- Run this in your Supabase SQL Editor if you wish to sync directly with Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WALLPAPERS TABLE
CREATE TABLE IF NOT EXISTS public.wallpapers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    width INTEGER DEFAULT 1080,
    height INTEGER DEFAULT 1920,
    format TEXT DEFAULT 'HD JPG',
    category TEXT DEFAULT 'Temples',
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view wallpapers" ON public.wallpapers;
CREATE POLICY "Public can view wallpapers" ON public.wallpapers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all wallpaper actions" ON public.wallpapers;
CREATE POLICY "Allow all wallpaper actions" ON public.wallpapers FOR ALL USING (true) WITH CHECK (true);

-- 2. RINGTONES TABLE
CREATE TABLE IF NOT EXISTS public.ringtones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    artist TEXT DEFAULT 'Spiritual Chants',
    duration TEXT DEFAULT '1:00',
    audio_url TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ringtones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view ringtones" ON public.ringtones;
CREATE POLICY "Public can view ringtones" ON public.ringtones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all ringtone actions" ON public.ringtones;
CREATE POLICY "Allow all ringtone actions" ON public.ringtones FOR ALL USING (true) WITH CHECK (true);

-- 3. SPECIAL EVENTS & PARV TABLE (for Panchang & Festive Announcements)
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
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.special_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view special events" ON public.special_events;
CREATE POLICY "Public can view special events" ON public.special_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all special events actions" ON public.special_events;
CREATE POLICY "Allow all special events actions" ON public.special_events FOR ALL USING (true) WITH CHECK (true);

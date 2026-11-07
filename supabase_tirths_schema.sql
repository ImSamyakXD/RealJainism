-- ==============================================================================
-- Real Jainism — Jain Tirth & Temple Directory Database Schema
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. MAIN TABLE: tirths
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tirths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hindi_name TEXT,
    alternate_names TEXT[] DEFAULT '{}',
    tirth_type TEXT NOT NULL DEFAULT 'tirth_kshetra' CHECK (
        tirth_type IN (
            'siddh_kshetra',
            'atishay_kshetra',
            'tirth_kshetra',
            'temple',
            'temple_complex',
            'historical_site',
            'pilgrimage_site',
            'other'
        )
    ),
    tradition TEXT DEFAULT 'Digambara' CHECK (
        tradition IN (
            'Digambara',
            'Śvetāmbara',
            'Digambara / Śvetāmbara',
            'Both',
            'Ancient / Shared Heritage',
            'Not Verified'
        )
    ),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    pin_code TEXT,
    address TEXT,
    latitude DOUBLE PRECISION CHECK (latitude >= -90 AND latitude <= 90),
    longitude DOUBLE PRECISION CHECK (longitude >= -180 AND longitude <= 180),
    google_maps_url TEXT,
    openstreetmap_url TEXT,
    description TEXT NOT NULL,
    history TEXT,
    religious_significance TEXT,
    moolnayak_details TEXT,
    festivals JSONB DEFAULT '[]'::jsonb,
    inscriptions_archaeology TEXT,
    darshan_timings JSONB DEFAULT '{
        "morning": "6:00 AM - 11:30 AM",
        "evening": "5:30 PM - 8:30 PM",
        "aarti": "7:00 PM",
        "notes": "Timings may vary slightly during festivals and eclipse days."
    }'::jsonb,
    facilities TEXT[] DEFAULT '{
        "Dharamshala",
        "Bhojanshala",
        "Drinking Water",
        "Parking",
        "Washrooms"
    }',
    accessibility_notes TEXT,
    nearby_transport JSONB DEFAULT '{
        "railway": "",
        "airport": "",
        "bus": "",
        "road": ""
    }'::jsonb,
    contact_phone TEXT,
    contact_email TEXT,
    official_website TEXT,
    cover_image_url TEXT,
    sources_summary TEXT,
    verification_status TEXT NOT NULL DEFAULT 'published' CHECK (
        verification_status IN (
            'draft',
            'in_review',
            'verified',
            'published',
            'rejected'
        )
    ),
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by TEXT DEFAULT 'RealJainism Research Team',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. GALLERY IMAGES TABLE: tirth_images
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tirth_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tirth_id UUID NOT NULL REFERENCES public.tirths(id) ON DELETE CASCADE,
    storage_path TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    category TEXT DEFAULT 'exterior' CHECK (
        category IN (
            'cover',
            'exterior',
            'architecture',
            'complex',
            'moolnayak',
            'facilities',
            'historical',
            'other'
        )
    ),
    photographer_credit TEXT,
    source_url TEXT,
    license_type TEXT DEFAULT 'CC BY-SA / Fair Devotional Use',
    permission_notes TEXT,
    rights_status TEXT DEFAULT 'approved' CHECK (
        rights_status IN ('pending', 'approved', 'rejected', 'needs_review')
    ),
    is_cover BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. VERIFIED SOURCES TABLE: tirth_sources
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tirth_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tirth_id UUID NOT NULL REFERENCES public.tirths(id) ON DELETE CASCADE,
    source_title TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT DEFAULT 'Official Temple Trust' CHECK (
        source_type IN (
            'Official Temple Trust',
            'Government Heritage / Tourism',
            'Ancient Inscription / Shastra',
            'Academic Publication',
            'Field Verification',
            'Other'
        )
    ),
    supports_fields TEXT[] DEFAULT '{"history", "moolnayak"}',
    accessed_at DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. INDEXES FOR HIGH-SPEED SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tirths_slug ON public.tirths(slug);
CREATE INDEX IF NOT EXISTS idx_tirths_state ON public.tirths(state);
CREATE INDEX IF NOT EXISTS idx_tirths_district ON public.tirths(district);
CREATE INDEX IF NOT EXISTS idx_tirths_type ON public.tirths(tirth_type);
CREATE INDEX IF NOT EXISTS idx_tirths_tradition ON public.tirths(tradition);
CREATE INDEX IF NOT EXISTS idx_tirths_status ON public.tirths(verification_status);
CREATE INDEX IF NOT EXISTS idx_tirth_images_tirth_id ON public.tirth_images(tirth_id);
CREATE INDEX IF NOT EXISTS idx_tirth_sources_tirth_id ON public.tirth_sources(tirth_id);

-- ==============================================================================
-- 6. AUTO-UPDATE TRIGGER FOR updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tirths_updated_at ON public.tirths;
CREATE TRIGGER trigger_tirths_updated_at
    BEFORE UPDATE ON public.tirths
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.tirths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tirth_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tirth_sources ENABLE ROW LEVEL SECURITY;

-- 7.1 Public Read for Published Tirths
DROP POLICY IF EXISTS "Public can view published tirths" ON public.tirths;
CREATE POLICY "Public can view published tirths"
    ON public.tirths
    FOR SELECT
    USING (verification_status = 'published');

-- 7.2 Public Read for Images belonging to Published Tirths
DROP POLICY IF EXISTS "Public can view approved images" ON public.tirth_images;
CREATE POLICY "Public can view approved images"
    ON public.tirth_images
    FOR SELECT
    USING (rights_status = 'approved');

-- 7.3 Public Read for Sources
DROP POLICY IF EXISTS "Public can view sources" ON public.tirth_sources;
CREATE POLICY "Public can view sources"
    ON public.tirth_sources
    FOR SELECT
    USING (true);

-- 7.4 Authenticated / Admin Full Access (Insert/Update/Delete)
DROP POLICY IF EXISTS "Authenticated users have full access to tirths" ON public.tirths;
CREATE POLICY "Authenticated users have full access to tirths"
    ON public.tirths
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to tirth_images" ON public.tirth_images;
CREATE POLICY "Authenticated users have full access to tirth_images"
    ON public.tirth_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to tirth_sources" ON public.tirth_sources;
CREATE POLICY "Authenticated users have full access to tirth_sources"
    ON public.tirth_sources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 8. STORAGE BUCKET: tirth-photos (Public Read for visitors)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('tirth-photos', 'tirth-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view photos in tirth-photos bucket
DROP POLICY IF EXISTS "Public can read tirth-photos" ON storage.objects;
CREATE POLICY "Public can read tirth-photos"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'tirth-photos');

-- Storage RLS: Authenticated users can upload photos
DROP POLICY IF EXISTS "Authenticated can upload tirth-photos" ON storage.objects;
CREATE POLICY "Authenticated can upload tirth-photos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'tirth-photos');

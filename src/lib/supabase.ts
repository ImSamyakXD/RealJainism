import { createClient } from '@supabase/supabase-js';

// Primary Supabase Project (Tirths, Temples & Heritage Directory: rllagzfmqpkzjhxnzxpf)
const defaultPrimaryUrl = 'https://rllagzfmqpkzjhxnzxpf.supabase.co';
const defaultPrimaryAnonKey = 'sb_publishable_udA4w_gpdSX7x9cfwUf83Q_gIqHLkpP';

// Media Supabase Project (Wallpapers & Ringtones: vcojoqgwwfihjipkrxnp)
const defaultMediaUrl = 'https://vcojoqgwwfihjipkrxnp.supabase.co';
const defaultMediaAnonKey = 'sb_publishable_CvVPg9hIloJUv3O3lXBiTw_4A5QL8WA';

// 1. Primary Supabase (Tirths)
// If NEXT_PUBLIC_SUPABASE_URL was accidentally configured to the Media Supabase project (vcojoqgwwfihjipkrxnp),
// route to the actual Primary Tirths Supabase project so tirths queries and updates do not fail.
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl =
  rawSupabaseUrl && !rawSupabaseUrl.includes('vcojoqgwwfihjipkrxnp')
    ? rawSupabaseUrl
    : defaultPrimaryUrl;

const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isMediaKey =
  rawSupabaseAnonKey &&
  (rawSupabaseAnonKey === defaultMediaAnonKey ||
    rawSupabaseAnonKey.includes('vcojoqgwwfihjipkrxnp'));
const supabaseAnonKey =
  rawSupabaseAnonKey && !isMediaKey
    ? rawSupabaseAnonKey
    : defaultPrimaryAnonKey;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// 2. Media Supabase Project (Wallpapers & Ringtones Database & Storage Buckets)
const mediaSupabaseUrl =
  process.env.NEXT_PUBLIC_MEDIA_SUPABASE_URL || defaultMediaUrl;
const mediaSupabaseAnonKey =
  process.env.NEXT_PUBLIC_MEDIA_SUPABASE_ANON_KEY || defaultMediaAnonKey;
const mediaSupabaseSecretKey = process.env.MEDIA_SUPABASE_SECRET_KEY || '';

// Client-safe instance (read/downloads)
export const mediaSupabase = createClient(mediaSupabaseUrl, mediaSupabaseAnonKey);

// Server-side admin instance (direct bucket uploads and database writes)
export const mediaSupabaseAdmin = createClient(
  mediaSupabaseUrl,
  mediaSupabaseSecretKey || mediaSupabaseAnonKey
);

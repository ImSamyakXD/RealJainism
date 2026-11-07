import { createClient } from '@supabase/supabase-js';

// Primary Supabase Project (Tirths, Temples & Heritage Directory)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rllagzfmqpkzjhxnzxpf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_udA4w_gpdSX7x9cfwUf83Q_gIqHLkpP';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Media Supabase Project (Wallpapers & Ringtones Database & Storage Buckets)
const mediaSupabaseUrl =
  process.env.NEXT_PUBLIC_MEDIA_SUPABASE_URL || 'https://vcojoqgwwfihjipkrxnp.supabase.co';
const mediaSupabaseAnonKey =
  process.env.NEXT_PUBLIC_MEDIA_SUPABASE_ANON_KEY || 'sb_publishable_CvVPg9hIloJUv3O3lXBiTw_4A5QL8WA';
const mediaSupabaseSecretKey =
  process.env.MEDIA_SUPABASE_SECRET_KEY || '';

// Client-safe instance (read/downloads)
export const mediaSupabase = createClient(mediaSupabaseUrl, mediaSupabaseAnonKey);

// Server-side admin instance (direct bucket uploads and database writes)
export const mediaSupabaseAdmin = createClient(
  mediaSupabaseUrl,
  mediaSupabaseSecretKey || mediaSupabaseAnonKey
);

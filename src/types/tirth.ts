export type TirthType =
  | 'siddh_kshetra'
  | 'atishay_kshetra'
  | 'tirth_kshetra'
  | 'temple'
  | 'temple_complex'
  | 'historical_site'
  | 'pilgrimage_site'
  | 'other';

export type TraditionType = 'Digambara';

export type VerificationStatus =
  | 'draft'
  | 'in_review'
  | 'verified'
  | 'published'
  | 'rejected';

export interface DarshanTimings {
  morning?: string;
  evening?: string;
  notes?: string;
}

export interface NearbyTransport {
  railway?: string;
  airport?: string;
  bus?: string;
  road?: string;
}

export interface TirthImage {
  id: string;
  tirth_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  category?: 'cover' | 'exterior' | 'architecture' | 'complex' | 'moolnayak' | 'facilities' | 'historical' | 'other';
  photographer_credit?: string;
  source_url?: string;
  is_cover?: boolean;
  display_order?: number;
}

export interface TirthSource {
  id: string;
  tirth_id: string;
  source_title: string;
  source_url?: string;
  source_type: string;
  accessed_at?: string;
  notes?: string;
}

export interface Tirth {
  id: string;
  slug: string;
  name: string;
  hindi_name?: string;
  alternate_names?: string[];
  tirth_type: TirthType;
  tradition: TraditionType;
  state: string;
  district: string;
  city: string;
  pin_code?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string;
  openstreetmap_url?: string;
  description: string;
  history?: string;
  religious_significance?: string;
  moolnayak_details?: string;
  festivals?: Array<{
    name: string;
    tithi?: string;
    description?: string;
  }>;
  inscriptions_archaeology?: string;
  darshan_timings?: DarshanTimings;
  facilities: string[];
  accessibility_notes?: string;
  nearby_transport?: NearbyTransport;
  contact_phone?: string;
  contact_email?: string;
  official_website?: string;
  cover_image_url: string;
  gallery_images?: TirthImage[];
  sources?: TirthSource[];
  verification_status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
}

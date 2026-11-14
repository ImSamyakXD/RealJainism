export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TirthDetailClient from './components/TirthDetailClient';
import tirthsFallback from '@/data/tirths-data.json';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

const SLUG_ALIASES: Record<string, string> = {
  gomateshwara: 'shravanabelagola',
  deogarh: 'up-deogarh-up',
  'khajuraho-jain': 'khajuraho-jain-temples',
  moodabidri: 'moodabidri-thousand-pillar',
  kundalpur: 'kundalpur-bade-baba',
  shikharji: 'shikharji-parasnath',
  sonagiri: 'sonagiri-datia',
  mahavirji: 'shri-mahavirji-karauli',
  champapuri: 'champapuri-bhagalpur',
  'jh-sammed-shikharji': 'shikharji-parasnath',
  'mp-deogarh': 'up-deogarh-up',
  'mp-khajuraho': 'khajuraho-jain-temples',
  'mp-nainagiri': 'nainagiri-reshandigiri',
  'mp-aharji': 'aharji-tikamgarh',
  'mp-dronagiri': 'dronagiri-chhatarpur',
  'rj-padampura': 'padampura-jaipur',
  'ka-moodabidri': 'moodabidri-thousand-pillar',
  'ka-karkala': 'karkala-bahubali',
  'ka-venur': 'venur-bahubali',
};

export async function generateStaticParams() {
  const tirths = tirthsFallback as Array<{ slug: string }>;
  const allSlugs = new Set(tirths.map((t) => t.slug));
  Object.keys(SLUG_ALIASES).forEach((alias) => allSlugs.add(alias));
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

async function getTirthBySlug(slug: string) {
  const canonicalSlug = SLUG_ALIASES[slug] || slug;
  const local = (tirthsFallback as any[]).find((t) => t.slug === canonicalSlug || t.slug === slug);
  let customOverride: any = null;
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const customPath = path.join(process.cwd(), 'src', 'data', 'tirths-custom.json');
    const raw = await fs.readFile(customPath, 'utf8');
    const customData = JSON.parse(raw);
    customOverride = customData[canonicalSlug] || customData[slug];
  } catch {
    // ignore
  }

  // 1. Fetch live from Supabase (to prioritize up-to-date data like official_website & contact_phone)
  let result = local || null;
  try {
    const { data, error } = await supabase
      .from('tirths')
      .select('*')
      .eq('slug', canonicalSlug)
      .single();

    if (!error && data) {
      result = {
        ...local,
        ...data,
        cover_image_url: (data.cover_image_url || local?.cover_image_url || '').trim(),
      };
    }
  } catch {
    // ignore
  }

  // 2. Custom admin override has highest priority
  if (customOverride) {
    if (customOverride._deleted) return null;
    result = {
      ...(result || {}),
      ...customOverride,
    };
  }

  if (result && result.cover_image_url) {
    result.cover_image_url = result.cover_image_url.trim();
    if (result.cover_image_url.includes('Banda%20Munisuvratnath%20Mandir.png')) {
      result.cover_image_url = result.cover_image_url.replace(
        'Banda%20Munisuvratnath%20Mandir.png',
        'Banda%20Munisuvratnath%20Mandir.jpg'
      );
    }
  }

  return result;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tirth = await getTirthBySlug(slug);
  if (!tirth) return { title: 'Tirth Not Found — RealJainism' };
  return {
    title: `${tirth.name} — Sacred Digambar Tirth | RealJainism`,
    description: tirth.description,
  };
}

export default async function TirthDetailPage({ params }: Props) {
  const { slug } = await params;
  const tirth = await getTirthBySlug(slug);
  if (!tirth) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-background">
        <TirthDetailClient slug={slug} initialData={tirth} />
      </main>
      <Footer />
    </>
  );
}

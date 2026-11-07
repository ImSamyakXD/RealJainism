const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://rllagzfmqpkzjhxnzxpf.supabase.co';
const key = 'sb_publishable_udA4w_gpdSX7x9cfwUf83Q_gIqHLkpP';
const supabase = createClient(url, key);

async function filterNewOnly() {
  const { data: existingRows } = await supabase.from('tirths').select('slug, name, city');
  const allTirths = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'tirths-data.json'), 'utf8'));

  // Key distinctive keywords for each of the 24 existing records
  const existingKeyMatchers = [
    'palitana',
    'karkala',
    'gopachal',
    'shikharji',
    'girnar',
    'shravanabelagola',
    'gomateshwara',
    'padampura',
    'bawangaja',
    'mahavirji',
    'pawapuri',
    'pavapuri',
    'nakoda',
    'dronagiri',
    'nainagiri',
    'moodabidri',
    'gajpantha',
    'sonagiri',
    'papora',
    'mangi',
    'khajuraho',
    'tijara',
    'aharji',
    'kundalpur',
    'champapuri',
    'hastinapur'
  ];

  const excluded = [];
  const brandNew = [];

  allTirths.forEach(t => {
    const textToMatch = `${t.slug} ${t.name} ${t.city}`.toLowerCase();
    const isOld = existingKeyMatchers.some(k => textToMatch.includes(k));
    if (isOld) {
      excluded.push(t);
    } else {
      brandNew.push(t);
    }
  });

  console.log(`Excluded old already-updated temples: ${excluded.length}`);
  console.log('Excluded names:', excluded.map(e => e.name));
  console.log(`\nBrand new temples to insert: ${brandNew.length}`);

  let sql = `-- ==============================================================================
-- Real Jainism — Seed Data: ${brandNew.length} BRAND NEW Digambar Jain Temples Only
-- Excludes the 24 temples you already updated in Supabase.
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

INSERT INTO public.tirths (
    slug,
    name,
    hindi_name,
    alternate_names,
    tirth_type,
    tradition,
    state,
    district,
    city,
    pin_code,
    address,
    latitude,
    longitude,
    google_maps_url,
    description,
    history,
    religious_significance,
    moolnayak_details,
    darshan_timings,
    facilities,
    accessibility_notes,
    nearby_transport,
    contact_phone,
    official_website,
    cover_image_url,
    verification_status
) VALUES\n`;

  const esc = (s) => (s ? String(s).replace(/'/g, "''") : '');

  const rows = brandNew.map((item) => {
    const alt = 'ARRAY[' + (item.alternate_names || []).map((a) => `'${esc(a)}'`).join(', ') + ']::text[]';
    const fac = 'ARRAY[' + (item.facilities || []).map((f) => `'${esc(f)}'`).join(', ') + ']::text[]';
    const timings = `'${esc(JSON.stringify(item.darshan_timings || {}))}'::jsonb`;
    const transport = `'${esc(JSON.stringify(item.nearby_transport || {}))}'::jsonb`;

    return `(
    '${esc(item.slug)}',
    '${esc(item.name)}',
    '${esc(item.hindi_name)}',
    ${alt},
    '${esc(item.tirth_type)}',
    '${esc(item.tradition)}',
    '${esc(item.state)}',
    '${esc(item.district)}',
    '${esc(item.city)}',
    '${esc(item.pin_code)}',
    '${esc(item.address)}',
    ${item.latitude},
    ${item.longitude},
    '${esc(item.google_maps_url)}',
    '${esc(item.description)}',
    '${esc(item.history)}',
    '${esc(item.religious_significance)}',
    '${esc(item.moolnayak_details)}',
    ${timings},
    ${fac},
    '${esc(item.accessibility_notes)}',
    ${transport},
    '${esc(item.contact_phone)}',
    '${esc(item.official_website)}',
    '${esc(item.cover_image_url)}',
    'published'
)`;
  });

  sql += rows.join(',\n') + '\n';
  sql += 'ON CONFLICT (slug) DO NOTHING;\n';

  const outPath = path.join(__dirname, '..', 'supabase_new_tirths_only.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`\nGenerated ${outPath} with ${brandNew.length} NEW tirths.`);
}

filterNewOnly();

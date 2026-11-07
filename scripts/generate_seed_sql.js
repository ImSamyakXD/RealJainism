const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'tirths-data.json');
const outputPath = path.join(__dirname, '..', 'supabase_tirths_seed.sql');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let sql = `-- ==============================================================================
-- Real Jainism — Seed Data: 25 Verified Jain Tirths
-- Run this in your Supabase SQL Editor after running supabase_tirths_schema.sql
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

const rows = data.map((item) => {
  const esc = (s) => (s ? String(s).replace(/'/g, "''") : '');
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
sql += 'ON CONFLICT (slug) DO UPDATE SET updated_at = NOW();\n';

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated ${outputPath} with ${data.length} records.`);

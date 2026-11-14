import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import baseTirths from '@/data/tirths-data.json';

export const dynamic = 'force-dynamic';

const customFilePath = path.join(process.cwd(), 'src', 'data', 'tirths-custom.json');

async function readCustomTirths(): Promise<Record<string, any>> {
  try {
    const raw = await fs.readFile(customFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeCustomTirths(data: Record<string, any>) {
  try {
    await fs.writeFile(customFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // On serverless hosting (Netlify/AWS Lambda), filesystem is read-only
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const customOverrides = await readCustomTirths();

    const baseMap = new Map<string, any>();

    // 1. Live Supabase database is the primary authoritative source
    try {
      const { data: sbData, error } = await supabase
        .from('tirths')
        .select('*')
        .order('name', { ascending: true });

      if (!error && sbData && sbData.length > 0) {
        sbData.forEach((sbItem: any) => {
          let cover = (sbItem.cover_image_url || '').trim();
          if (cover.includes('Banda%20Munisuvratnath%20Mandir.png')) {
            cover = cover.replace('Banda%20Munisuvratnath%20Mandir.png', 'Banda%20Munisuvratnath%20Mandir.jpg');
          }
          baseMap.set(sbItem.slug, {
            ...sbItem,
            cover_image_url: cover,
          });
        });
      }
    } catch {
      // Supabase is optional / offline fallback
    }

    // 2. If Supabase had no records (e.g. offline/network issue), fallback to baseTirths
    if (baseMap.size === 0) {
      (baseTirths as any[]).forEach((t) => {
        baseMap.set(t.slug, {
          ...t,
          cover_image_url: (t.cover_image_url || '').trim(),
        });
      });
    }

    // Apply custom admin edits & new additions
    Object.entries(customOverrides).forEach(([slug, customItem]) => {
      if (customItem._deleted) {
        baseMap.delete(slug);
      } else if (customItem._isNew) {
        baseMap.set(slug, customItem);
      } else if (baseMap.has(slug)) {
        // Only override fields for tirths that still exist in the database!
        const existing = baseMap.get(slug);
        baseMap.set(slug, {
          ...existing,
          ...customItem,
        });
      }
    });

    let list = Array.from(baseMap.values());

    // Filtering
    if (q) {
      list = list.filter((t) => {
        const n = (t.name || '').toLowerCase();
        const hn = (t.hindi_name || '').toLowerCase();
        const c = (t.city || '').toLowerCase();
        const s = (t.state || '').toLowerCase();
        const d = (t.district || '').toLowerCase();
        return n.includes(q) || hn.includes(q) || c.includes(q) || s.includes(q) || d.includes(q);
      });
    }

    if (state && state !== 'all') {
      list = list.filter((t) => t.state === state);
    }

    if (type && type !== 'all') {
      list = list.filter((t) => t.tirth_type === type);
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      total,
      totalAll: baseMap.size,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tirths: paginated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.city || !body.state) {
      return NextResponse.json(
        { error: 'Name, City, and State are required' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const tirthId =
      body.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)
        ? body.id
        : crypto.randomUUID();

    const newTirth = {
      id: tirthId,
      slug,
      name: body.name.trim(),
      hindi_name: body.hindi_name?.trim() || '',
      tirth_type: body.tirth_type || 'atishay_kshetra',
      tradition: body.tradition || 'Digambara',
      state: body.state.trim(),
      district: body.district?.trim() || body.city?.trim() || body.state?.trim() || 'General',
      city: body.city.trim(),
      address: body.address?.trim() || '',
      pin_code: body.pin_code?.trim() || '',
      latitude: Number(body.latitude) || 23.0,
      longitude: Number(body.longitude) || 77.0,
      google_maps_url: body.google_maps_url || '',
      description: body.description?.trim() || 'Sacred Digambar Jain Tirth Kshetra.',
      history: body.history?.trim() || '',
      religious_significance: body.religious_significance?.trim() || '',
      moolnayak_details: body.moolnayak_details?.trim() || '',
      darshan_timings: body.darshan_timings || {
        morning: '6:00 AM - 11:30 AM',
        evening: '5:30 PM - 8:30 PM',
      },
      facilities: Array.isArray(body.facilities)
        ? body.facilities
        : ['Dharamshala', 'Bhojanshala', 'Drinking Water', 'Parking'],
      contact_phone: body.contact_phone?.trim() || '',
      contact_email: body.contact_email?.trim() || null,
      official_website: body.official_website?.trim() || '',
      cover_image_url: body.cover_image_url?.trim() || '',
      verification_status: body.verification_status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const customOverrides = await readCustomTirths();
    customOverrides[slug] = newTirth;
    await writeCustomTirths(customOverrides);

    // Try Supabase insert
    try {
      const { error: insErr } = await supabaseAdmin.from('tirths').insert([newTirth]);
      if (insErr) {
        console.error('Supabase tirth insert notice:', insErr);
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }

    return NextResponse.json({ success: true, item: newTirth });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const slug = body.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Tirth slug is required' }, { status: 400 });
    }

    const customOverrides = await readCustomTirths();
    const existingCustom = customOverrides[slug] || {};
    const baseItem = (baseTirths as any[]).find((t) => t.slug === slug) || {};

    const updatedTirth = {
      ...baseItem,
      ...existingCustom,
      ...body,
      updated_at: new Date().toISOString(),
    };

    customOverrides[slug] = updatedTirth;
    await writeCustomTirths(customOverrides);

    // Also update tirths-data.json so base cache is permanently in sync
    try {
      const dataFilePath = path.join(process.cwd(), 'src', 'data', 'tirths-data.json');
      const raw = await fs.readFile(dataFilePath, 'utf8');
      const allTirths = JSON.parse(raw);
      const idx = allTirths.findIndex((t: any) => t.slug === slug);
      if (idx !== -1) {
        allTirths[idx] = { ...allTirths[idx], ...updatedTirth };
        await fs.writeFile(dataFilePath, JSON.stringify(allTirths, null, 2), 'utf8');
      }
    } catch {
      // ignore
    }

    // Try Supabase update
    try {
      const updateData: any = {
        name: updatedTirth.name,
        hindi_name: updatedTirth.hindi_name,
        tirth_type: updatedTirth.tirth_type,
        tradition: updatedTirth.tradition,
        state: updatedTirth.state,
        district: updatedTirth.district || updatedTirth.city,
        city: updatedTirth.city,
        address: updatedTirth.address,
        pin_code: updatedTirth.pin_code,
        google_maps_url: updatedTirth.google_maps_url,
        description: updatedTirth.description,
        history: updatedTirth.history,
        religious_significance: updatedTirth.religious_significance,
        moolnayak_details: updatedTirth.moolnayak_details,
        contact_phone: updatedTirth.contact_phone,
        contact_email: updatedTirth.contact_email,
        official_website: updatedTirth.official_website,
        cover_image_url: updatedTirth.cover_image_url,
        darshan_timings: updatedTirth.darshan_timings,
        facilities: updatedTirth.facilities,
        verification_status: updatedTirth.verification_status || 'published',
        updated_at: new Date().toISOString(),
      };
      if (updatedTirth.latitude !== undefined) updateData.latitude = Number(updatedTirth.latitude);
      if (updatedTirth.longitude !== undefined) updateData.longitude = Number(updatedTirth.longitude);

      const { data: updatedRows, error: updErr } = await supabaseAdmin
        .from('tirths')
        .update(updateData)
        .eq('slug', slug)
        .select();

      if (updErr) {
        console.error('Supabase tirth update error:', updErr);
      } else if (!updatedRows || updatedRows.length === 0) {
        console.warn('Supabase tirth update matched 0 rows (check RLS permissions or slug):', slug);
      }
    } catch (err) {
      console.error('Supabase update exception:', err);
    }

    return NextResponse.json({ success: true, item: updatedTirth });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const customOverrides = await readCustomTirths();
    customOverrides[slug] = { _deleted: true, updated_at: new Date().toISOString() };
    await writeCustomTirths(customOverrides);

    try {
      await supabaseAdmin.from('tirths').delete().eq('slug', slug);
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'special-events.json');

async function readEvents() {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEvents(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // On serverless hosting (Netlify/AWS Lambda), filesystem is read-only
  }
}

export async function GET() {
  try {
    const local = await readEvents();

    try {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const sbSlugs = new Set(data.map((d: any) => d.slug));
        const merged = [
          ...data,
          ...local.filter((l: any) => !sbSlugs.has(l.slug)),
        ];
        return NextResponse.json(merged);
      }
    } catch {
      // ignore
    }

    return NextResponse.json(local);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newItem = {
      id: body.id || `event-${Date.now()}`,
      slug,
      title: body.title.trim(),
      hindi_title: body.hindi_title?.trim() || '',
      tithi_date: body.tithi_date?.trim() || '',
      upcoming_date: body.upcoming_date?.trim() || '',
      category: body.category?.trim() || 'Maha Parv',
      badge: body.badge?.trim() || 'Special Parv',
      description: body.description.trim(),
      rituals: body.rituals?.trim() || '',
      significance: body.significance?.trim() || '',
      image_url: body.image_url?.trim() || '',
      is_active: body.is_active !== false,
      display_order: Number(body.display_order) || 1,
      created_at: new Date().toISOString(),
    };

    const current = await readEvents();
    const updated = [newItem, ...current];
    await writeEvents(updated);

    try {
      await supabase.from('special_events').insert([
        {
          slug: newItem.slug,
          title: newItem.title,
          hindi_title: newItem.hindi_title,
          tithi_date: newItem.tithi_date,
          upcoming_date: newItem.upcoming_date,
          category: newItem.category,
          badge: newItem.badge,
          description: newItem.description,
          rituals: newItem.rituals,
          significance: newItem.significance,
          image_url: newItem.image_url,
          is_active: newItem.is_active,
          display_order: newItem.display_order,
        },
      ]);
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json({ error: 'Event ID or slug required' }, { status: 400 });
    }

    const current = await readEvents();
    const index = current.findIndex(
      (item: any) => item.id === body.id || item.slug === body.slug
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    current[index] = {
      ...current[index],
      ...body,
      updated_at: new Date().toISOString(),
    };

    await writeEvents(current);

    try {
      await supabase
        .from('special_events')
        .update({
          title: body.title,
          hindi_title: body.hindi_title,
          tithi_date: body.tithi_date,
          upcoming_date: body.upcoming_date,
          category: body.category,
          badge: body.badge,
          description: body.description,
          rituals: body.rituals,
          significance: body.significance,
          image_url: body.image_url,
          is_active: body.is_active,
        })
        .match(body.id ? { id: body.id } : { slug: body.slug });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, item: current[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'ID or slug is required' }, { status: 400 });
    }

    const current = await readEvents();
    const filtered = current.filter(
      (item: any) => item.id !== id && item.slug !== slug
    );
    await writeEvents(filtered);

    try {
      if (id) {
        await supabase.from('special_events').delete().eq('id', id);
      } else if (slug) {
        await supabase.from('special_events').delete().eq('slug', slug);
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, deleted: id || slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

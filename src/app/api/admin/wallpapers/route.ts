import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mediaSupabase, mediaSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'wallpapers.json');

async function readLocalWallpapers() {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocalWallpapers(data: any[]) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    // 1. Fetch live from Media Supabase (contains the 65 uploaded wallpapers)
    try {
      const { data, error } = await mediaSupabase
        .from('wallpapers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.title || 'Sacred Jain Wallpaper',
          url: (d.image_url || d.url || '').trim(),
          width: d.width || 1080,
          height: d.height || 1920,
          format: d.format || 'HD JPG',
          category: d.category || 'Temples',
          downloads: d.downloads || 0,
          created_at: d.created_at || new Date().toISOString(),
        }));

        // Keep local cache synced
        await writeLocalWallpapers(mapped);
        return NextResponse.json(mapped);
      }
    } catch (sbErr) {
      console.warn('Media Supabase fetch error, using local fallback:', sbErr);
    }

    // 2. Fallback to local
    const local = await readLocalWallpapers();
    return NextResponse.json(local);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const url = body.url.trim();
    const width = Number(body.width) || 1080;
    const height = Number(body.height) || 1920;
    const format = body.format || 'HD JPG';

    // 1. Insert or Update in Media Supabase project (deduplicate by image_url)
    let newItem: any = null;
    try {
      const { data: existing } = await mediaSupabaseAdmin
        .from('wallpapers')
        .select('*')
        .or(`image_url.eq.${url},url.eq.${url}`)
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing row (prevents duplicates when storage trigger already fired)
        const { data: updated, error: updateErr } = await mediaSupabaseAdmin
          .from('wallpapers')
          .update({
            title: title || existing.title,
            category: body.category || existing.category || 'Temples',
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (!updateErr && updated) {
          newItem = {
            id: updated.id,
            title: updated.title,
            url: (updated.image_url || updated.url || '').trim(),
            width: updated.width || 1080,
            height: updated.height || 1920,
            format: updated.format || 'HD JPG',
            category: updated.category || 'Temples',
            downloads: updated.downloads || 0,
            created_at: updated.created_at,
          };
        }
      } else {
        // Insert new row
        const { data, error } = await mediaSupabaseAdmin
          .from('wallpapers')
          .insert([
            {
              title,
              image_url: url,
              category: body.category || 'Temples',
              width,
              height,
              format,
              downloads: 0,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          newItem = {
            id: data.id,
            title: data.title,
            url: (data.image_url || data.url || '').trim(),
            width: data.width || 1080,
            height: data.height || 1920,
            format: data.format || 'HD JPG',
            category: data.category || 'Temples',
            downloads: data.downloads || 0,
            created_at: data.created_at,
          };
        }
      }
    } catch (insertErr) {
      console.warn('Supabase wallpaper insert/update failed, saving locally:', insertErr);
    }

    if (!newItem) {
      newItem = {
        id: body.id || `wp-${Date.now()}`,
        title,
        url,
        width,
        height,
        format,
        category: body.category || 'Temples',
        downloads: 0,
        created_at: new Date().toISOString(),
      };
    }

    // 2. Also save to local cache (deduplicated by url)
    const current = await readLocalWallpapers();
    const existingIndex = current.findIndex((w: any) => (w.url || '').trim() === url);
    if (existingIndex !== -1) {
      current[existingIndex] = { ...current[existingIndex], ...newItem };
      await writeLocalWallpapers(current);
    } else {
      await writeLocalWallpapers([newItem, ...current]);
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Wallpaper ID required' }, { status: 400 });
    }

    try {
      await mediaSupabaseAdmin
        .from('wallpapers')
        .update({
          title: body.title,
          image_url: body.url || body.image_url,
        })
        .eq('id', body.id);
    } catch (err) {
      // ignore
    }

    const current = await readLocalWallpapers();
    const index = current.findIndex((item: any) => item.id === body.id);
    if (index !== -1) {
      current[index] = { ...current[index], ...body, updated_at: new Date().toISOString() };
      await writeLocalWallpapers(current);
    }

    return NextResponse.json({ success: true, item: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Delete in Media Supabase
    try {
      await mediaSupabaseAdmin.from('wallpapers').delete().eq('id', id);
    } catch {
      // ignore
    }

    const current = await readLocalWallpapers();
    const filtered = current.filter((item: any) => item.id !== id);
    await writeLocalWallpapers(filtered);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

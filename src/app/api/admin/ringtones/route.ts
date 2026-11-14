import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mediaSupabase, mediaSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'ringtones.json');

async function readLocalRingtones() {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocalRingtones(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // On serverless hosting (Netlify/AWS Lambda), filesystem is read-only
  }
}

export async function GET() {
  try {
    // 1. Fetch live from Media Supabase (contains the 9 real ringtones)
    try {
      const { data, error } = await mediaSupabase
        .from('ringtones')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: (d.name || 'Jain Ringtone').replace(/^\n/, ''),
          artist: d.artist || 'Devotional Chants',
          duration: d.duration || '1:00',
          audioUrl: (d.audio_url || d.audioUrl || '').trim(),
          downloads: d.downloads || 0,
          created_at: d.created_at || new Date().toISOString(),
        }));

        await writeLocalRingtones(mapped);
        return NextResponse.json(mapped);
      }
    } catch (sbErr) {
      console.warn('Media Supabase ringtones fetch error, using local fallback:', sbErr);
    }

    // 2. Fallback to local
    const local = await readLocalRingtones();
    return NextResponse.json(local);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.audioUrl) {
      return NextResponse.json(
        { error: 'Name and audio URL are required' },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const artist = body.artist?.trim() || 'Devotional Chants';
    const duration = body.duration?.trim() || '1:00';
    const audioUrl = body.audioUrl.trim();

    // 1. Insert or Update in Media Supabase project (deduplicate by audio_url)
    let newItem: any = null;
    try {
      const { data: existing } = await mediaSupabaseAdmin
        .from('ringtones')
        .select('*')
        .eq('audio_url', audioUrl)
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { data: updated, error: updateErr } = await mediaSupabaseAdmin
          .from('ringtones')
          .update({
            name: name || existing.name,
            artist: artist || existing.artist,
            duration: duration || existing.duration,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (!updateErr && updated) {
          newItem = {
            id: updated.id,
            name: updated.name,
            artist: updated.artist,
            duration: updated.duration,
            audioUrl: (updated.audio_url || '').trim(),
            downloads: updated.downloads || 0,
            created_at: updated.created_at,
          };
        }
      } else {
        const { data, error } = await mediaSupabaseAdmin
          .from('ringtones')
          .insert([
            {
              name,
              artist,
              duration,
              audio_url: audioUrl,
              downloads: 0,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          newItem = {
            id: data.id,
            name: data.name,
            artist: data.artist,
            duration: data.duration,
            audioUrl: (data.audio_url || '').trim(),
            downloads: data.downloads || 0,
            created_at: data.created_at,
          };
        }
      }
    } catch (insertErr) {
      console.warn('Supabase ringtone insert/update failed, saving locally:', insertErr);
    }

    if (!newItem) {
      newItem = {
        id: body.id || `rt-${Date.now()}`,
        name,
        artist,
        duration,
        audioUrl,
        downloads: 0,
        created_at: new Date().toISOString(),
      };
    }

    // Update local cache (deduplicated by audioUrl)
    const current = await readLocalRingtones();
    const existingIndex = current.findIndex((r: any) => (r.audioUrl || r.audio_url || '').trim() === audioUrl);
    if (existingIndex !== -1) {
      current[existingIndex] = { ...current[existingIndex], ...newItem };
      await writeLocalRingtones(current);
    } else {
      await writeLocalRingtones([newItem, ...current]);
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
      return NextResponse.json({ error: 'Ringtone ID required' }, { status: 400 });
    }

    try {
      const { error: updErr } = await mediaSupabaseAdmin
        .from('ringtones')
        .update({
          name: body.name,
          artist: body.artist,
          duration: body.duration,
          audio_url: body.audioUrl || body.audio_url,
        })
        .eq('id', body.id);
      if (updErr) {
        console.error('Supabase ringtone update error:', updErr);
      }
    } catch (err) {
      console.error('Supabase ringtone update exception:', err);
    }

    const current = await readLocalRingtones();
    const index = current.findIndex((item: any) => item.id === body.id);
    if (index !== -1) {
      current[index] = { ...current[index], ...body, updated_at: new Date().toISOString() };
      await writeLocalRingtones(current);
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

    try {
      const { error: delErr } = await mediaSupabaseAdmin.from('ringtones').delete().eq('id', id);
      if (delErr) {
        console.error('Supabase ringtone delete error:', delErr);
      }
    } catch (err) {
      console.error('Supabase ringtone delete exception:', err);
    }

    const current = await readLocalRingtones();
    const filtered = current.filter((item: any) => item.id !== id);
    await writeLocalRingtones(filtered);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

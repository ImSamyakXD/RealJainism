import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { supabase } from '@/lib/supabase';
import defaultEvents from '@/data/special-events.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'special-events.json');
    let localData: any[] = defaultEvents;

    try {
      const raw = await fs.readFile(filePath, 'utf8');
      localData = JSON.parse(raw);
    } catch {
      // use defaultEvents
    }

    // Try Supabase
    try {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const sbSlugs = new Set(data.map((d: any) => d.slug));
        const merged = [
          ...data,
          ...localData.filter((l: any) => l.is_active && !sbSlugs.has(l.slug)),
        ];
        return NextResponse.json(merged);
      }
    } catch {
      // ignore
    }

    const activeLocal = localData.filter((item: any) => item.is_active !== false);
    return NextResponse.json(activeLocal);
  } catch (err: any) {
    return NextResponse.json(defaultEvents);
  }
}

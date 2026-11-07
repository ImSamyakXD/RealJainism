import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mediaSupabaseAdmin, supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Clean unique filename
    const origName = file.name || 'file';
    const cleanName = origName
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .toLowerCase();
    const ext = path.extname(cleanName) || '';
    const baseName = path.basename(cleanName, ext).slice(0, 40);
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. If uploading wallpapers or ringtones, upload directly to the Media Supabase Bucket!
    if (folder === 'wallpapers') {
      try {
        const { data: uploadData, error: uploadErr } = await mediaSupabaseAdmin.storage
          .from('Wallpapers')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = mediaSupabaseAdmin.storage
            .from('Wallpapers')
            .getPublicUrl(uniqueFileName);

          if (pubData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: pubData.publicUrl,
              fileName: uniqueFileName,
              size: file.size,
              mimeType: file.type,
              storage: 'supabase-bucket',
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase Wallpapers bucket upload failed, using local fallback:', sbErr);
      }
    } else if (folder === 'ringtones') {
      try {
        const { data: uploadData, error: uploadErr } = await mediaSupabaseAdmin.storage
          .from('Ringtones')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'audio/mpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = mediaSupabaseAdmin.storage
            .from('Ringtones')
            .getPublicUrl(uniqueFileName);

          if (pubData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: pubData.publicUrl,
              fileName: uniqueFileName,
              size: file.size,
              mimeType: file.type,
              storage: 'supabase-bucket',
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase Ringtones bucket upload failed, using local fallback:', sbErr);
      }
    } else if (folder === 'tirths') {
      // Tirths bucket in Supabase (using mediaSupabaseAdmin which has secret key access!)
      try {
        const { data: uploadData, error: uploadErr } = await mediaSupabaseAdmin.storage
          .from('tirth-photos')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = mediaSupabaseAdmin.storage
            .from('tirth-photos')
            .getPublicUrl(uniqueFileName);

          if (pubData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: pubData.publicUrl,
              fileName: uniqueFileName,
              size: file.size,
              mimeType: file.type,
              storage: 'supabase-bucket',
            });
          }
        } else if (uploadErr) {
          console.warn('Media Supabase tirth-photos upload error:', uploadErr);
        }
      } catch (tirthErr) {
        console.warn('Tirth bucket upload failed, fallback to local:', tirthErr);
      }
    }

    // Local file storage fallback
    const safeFolder = ['wallpapers', 'ringtones', 'tirths', 'events'].includes(folder)
      ? folder
      : 'general';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      mimeType: file.type,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

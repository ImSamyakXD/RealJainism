import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mediaSupabaseAdmin } from '@/lib/supabase';

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
    let lastUploadError: string | null = null;

    // 1. Upload to Supabase Storage Bucket based on folder
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
        } else if (uploadErr) {
          lastUploadError = uploadErr.message || 'Wallpapers bucket upload error';
          console.error('Supabase Wallpapers bucket upload error:', uploadErr);
        }
      } catch (sbErr: any) {
        lastUploadError = sbErr?.message || 'Wallpapers upload exception';
        console.error('Supabase Wallpapers bucket exception:', sbErr);
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
        } else if (uploadErr) {
          lastUploadError = uploadErr.message || 'Ringtones bucket upload error';
          console.error('Supabase Ringtones bucket upload error:', uploadErr);
        }
      } catch (sbErr: any) {
        lastUploadError = sbErr?.message || 'Ringtones upload exception';
        console.error('Supabase Ringtones bucket exception:', sbErr);
      }
    } else if (folder === 'tirths') {
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
          lastUploadError = uploadErr.message || 'tirth-photos bucket upload error';
          console.error('Supabase tirth-photos bucket upload error:', uploadErr);
        }
      } catch (tirthErr: any) {
        lastUploadError = tirthErr?.message || 'tirth-photos upload exception';
        console.error('Supabase tirth-photos exception:', tirthErr);
      }
    }

    // 2. In Serverless hosting (Netlify / Vercel / AWS Lambda), the filesystem is read-only
    const isServerless =
      process.env.NETLIFY ||
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NODE_ENV === 'production';

    if (isServerless && lastUploadError) {
      return NextResponse.json(
        {
          success: false,
          message: `Storage upload failed: ${lastUploadError}. Please check MEDIA_SUPABASE_SECRET_KEY in Netlify settings or allow bucket uploads in Supabase.`,
        },
        { status: 500 }
      );
    }

    // 3. Local development file storage fallback
    try {
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
    } catch (fsErr: any) {
      return NextResponse.json(
        {
          success: false,
          message: lastUploadError
            ? `Supabase upload failed (${lastUploadError}) and serverless filesystem is read-only. Please add MEDIA_SUPABASE_SECRET_KEY to your Netlify Environment Variables.`
            : `File storage error: ${fsErr.message}`,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

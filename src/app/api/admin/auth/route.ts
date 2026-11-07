import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jain2026';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin password. Please try again.' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`admin:${Date.now()}:${ADMIN_PASSWORD}`).toString('base64');

    const res = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      token,
    });

    res.cookies.set('rj_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const hasToken = cookieHeader.includes('rj_admin_token=');
  return NextResponse.json({ authenticated: hasToken });
}

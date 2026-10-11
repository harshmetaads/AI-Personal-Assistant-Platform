import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('aria_session');
  if (!cookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const parsed = JSON.parse(cookie.value || '{}');
    return NextResponse.json({ authenticated: !!parsed.email, user: parsed });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('aria_session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0
  });
  return response;
}

import { NextRequest, NextResponse } from 'next/server';

const DEMO_USERS = {
  'harsh@aria.local': 'aria123',
  'admin@aria.local': 'admin123'
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const validPassword = DEMO_USERS[email as keyof typeof DEMO_USERS];
    if (!validPassword || validPassword !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    const session = {
      email,
      name: email.split('@')[0],
      authenticated: true,
      timestamp: new Date().toISOString()
    };

    const response = NextResponse.json({ success: true, user: session });
    response.cookies.set('aria_session', JSON.stringify(session), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Login failed.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    note: 'Demo auth is enabled only for local personal use. Production use requires a real auth provider and secure secret management.'
  });
}

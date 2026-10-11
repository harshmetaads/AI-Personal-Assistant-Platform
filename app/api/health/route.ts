import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'ARIA Personal AI Workspace',
    status: 'healthy'
  });
}

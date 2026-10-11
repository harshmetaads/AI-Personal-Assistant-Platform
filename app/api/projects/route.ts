import { NextRequest, NextResponse } from 'next/server';
import { readProjectStore, writeProjectStore } from '@/lib/persistence';

export async function GET() {
  const items = await readProjectStore();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = body?.project;

    if (!project || !project.title) {
      return NextResponse.json({ error: 'Project is invalid.' }, { status: 400 });
    }

    const existing = await readProjectStore();
    const next = [
      {
        ...project,
        id: project.id || crypto.randomUUID(),
        status: project.status || 'active',
        updatedAt: new Date().toISOString()
      },
      ...existing
    ];

    const saved = await writeProjectStore(next);
    return NextResponse.json({ success: true, items: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save project.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required.' }, { status: 400 });

    const existing = await readProjectStore();
    const filtered = existing.filter((item: any) => item.id !== id);
    const saved = await writeProjectStore(filtered);
    return NextResponse.json({ success: true, items: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete project.' }, { status: 500 });
  }
}

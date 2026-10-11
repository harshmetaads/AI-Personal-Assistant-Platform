import { NextRequest, NextResponse } from 'next/server';
import { readMemoryStore, writeMemoryStore } from '@/lib/persistence';

export async function GET() {
  const items = await readMemoryStore();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = body?.item;

    if (!item || !item.content || !item.title) {
      return NextResponse.json({ error: 'Memory item is invalid.' }, { status: 400 });
    }

    const existing = await readMemoryStore();
    const next = [
      {
        ...item,
        id: item.id || crypto.randomUUID(),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...existing
    ];

    const saved = await writeMemoryStore(next);
    return NextResponse.json({ success: true, items: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save memory.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required.' }, { status: 400 });

    const existing = await readMemoryStore();
    const filtered = existing.filter((entry: any) => entry.id !== id);
    const saved = await writeMemoryStore(filtered);
    return NextResponse.json({ success: true, items: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete memory.' }, { status: 500 });
  }
}

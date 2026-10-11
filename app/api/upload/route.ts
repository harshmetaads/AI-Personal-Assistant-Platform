export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const purpose = (formData.get('purpose') as string) || 'general';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');

    await mkdir(UPLOAD_DIR, { recursive: true });
    const targetPath = path.join(UPLOAD_DIR, `${Date.now()}-${safeName}`);
    await writeFile(targetPath, fileBuffer);

    const summary = `File uploaded successfully.\n\nName: ${safeName}\nPurpose: ${purpose}\nSaved to: ${targetPath}\n\nThis is a local personal workspace upload and is not a live provider response.\nUse this to store, analyze, or summarize documents locally.`;

    return NextResponse.json({
      success: true,
      fileName: safeName,
      purpose,
      path: targetPath,
      summary
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Upload failed.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    supported: ['txt', 'pdf', 'md', 'docx', 'csv'],
    note: 'File upload is local-first and intended for personal workspace use.'
  });
}

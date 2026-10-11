import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'memory.json');
const PROJECT_FILE = path.join(DATA_DIR, 'projects.json');

async function ensureDataFile(filePath: string, defaultValue: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

export async function readMemoryStore() {
  await ensureDataFile(MEMORY_FILE, [
    {
      id: 'default-memory-1',
      title: 'Primary objective',
      content: 'Build a useful personal AI system that saves time and improves clarity.',
      category: 'preference',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const raw = await fs.readFile(MEMORY_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeMemoryStore(items: unknown[]) {
  await ensureDataFile(MEMORY_FILE, []);
  await fs.writeFile(MEMORY_FILE, JSON.stringify(items, null, 2), 'utf8');
  return items;
}

export async function readProjectStore() {
  await ensureDataFile(PROJECT_FILE, [
    {
      id: 'default-project-1',
      title: 'AI Personal OS',
      description: 'Build a unified personal productivity system.',
      status: 'active',
      updatedAt: new Date().toISOString()
    }
  ]);

  const raw = await fs.readFile(PROJECT_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeProjectStore(items: unknown[]) {
  await ensureDataFile(PROJECT_FILE, []);
  await fs.writeFile(PROJECT_FILE, JSON.stringify(items, null, 2), 'utf8');
  return items;
}

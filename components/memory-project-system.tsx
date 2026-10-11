'use client';

import { useEffect, useState } from 'react';

type MemoryEntry = {
  id: string;
  title: string;
  content: string;
  category: 'preference' | 'note' | 'project' | 'document';
  createdAt?: string;
  updatedAt?: string;
};

type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'done';
  updatedAt?: string;
};

export function MemoryProjectSystem() {
  const [memoryItems, setMemoryItems] = useState<MemoryEntry[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectEntry[]>([]);
  const [draft, setDraft] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemoryEntry['category']>('note');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [memoryRes, projectRes] = await Promise.all([
      fetch('/api/memory'),
      fetch('/api/projects')
    ]);

    const memoryData = await memoryRes.json();
    const projectData = await projectRes.json();

    setMemoryItems(memoryData.items || []);
    setProjectItems(projectData.items || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const saveMemory = async () => {
    if (!draft.trim() || !title.trim()) return;

    const payload = {
      item: {
        title,
        content: draft,
        category
      }
    };

    await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setTitle('');
    setDraft('');
    await loadData();
  };

  const saveProject = async () => {
    if (!title.trim()) return;

    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: {
          title,
          description: draft || 'New project created from the ARIA workspace.',
          status: 'active'
        }
      })
    });

    setTitle('');
    setDraft('');
    await loadData();
  };

  const toggleProjectStatus = async (project: ProjectEntry) => {
    const nextStatus = project.status === 'done' ? 'active' : 'done';
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: {
          ...project,
          status: nextStatus
        }
      })
    });
    await loadData();
  };

  const removeMemory = async (id: string) => {
    await fetch(`/api/memory?id=${id}`, { method: 'DELETE' });
    await loadData();
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 50px', color: '#edf2ff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 18 }}>
        <section style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Memory + Notes</div>

          <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }} />
            <select value={category} onChange={(e) => setCategory(e.target.value as MemoryEntry['category'])} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }}>
              <option value="note">Note</option>
              <option value="preference">Preference</option>
              <option value="project">Project</option>
              <option value="document">Document</option>
            </select>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} placeholder="Write the saved memory entry..." style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '12px 14px', resize: 'vertical' }} />
            <button onClick={saveMemory} style={{ background: 'linear-gradient(135deg, #7c3aed, #22c55e)', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Save memory
            </button>
          </div>

          {loading ? (
            <div style={{ color: '#94a3b8' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {memoryItems.map((item) => (
                <div key={item.id} style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{item.category}</div>
                    </div>
                    <button onClick={() => removeMemory(item.id)} style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                  <div style={{ color: '#dfe7f5', marginTop: 8, lineHeight: 1.7 }}>{item.content}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Projects</div>

            <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }} />
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Project description" style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '12px 14px', resize: 'vertical' }} />
              <button onClick={saveProject} style={{ background: 'linear-gradient(135deg, #0ea5e9, #22c55e)', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
                Add project
              </button>
            </div>

            {projectItems.map((project) => (
              <div key={project.id} style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{project.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{project.status}</div>
                  </div>
                  <button onClick={() => toggleProjectStatus(project)} style={{ background: project.status === 'done' ? '#22c55e' : '#f59e0b', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                    {project.status === 'done' ? 'Done' : 'Toggle'}
                  </button>
                </div>
                <div style={{ color: '#dfe7f5', marginTop: 8, lineHeight: 1.7 }}>{project.description}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

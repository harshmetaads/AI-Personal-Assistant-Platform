'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MemoryEntry, ProjectItem, ProviderModel, UserPreferences } from '@/lib/domain';

const STORAGE_KEY = 'aria-memory-state';

const defaultMemory: MemoryEntry[] = [
  { id: 'm1', title: 'Primary objective', content: 'Build a useful personal AI system that saves time and increases clarity.', category: 'preference', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm2', title: 'Daily workflow', content: 'Focus on the most important outcome first, then handle urgent issues with minimal distraction.', category: 'note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const defaultProjects: ProjectItem[] = [
  { id: 'p1', title: 'AI Personal OS', description: 'Build a unified assistant for planning and execution.', status: 'active', updatedAt: new Date().toISOString() },
  { id: 'p2', title: 'Productivity System', description: 'Create personal workflows and note organization.', status: 'active', updatedAt: new Date().toISOString() }
];

const defaultProviders: ProviderModel[] = [
  { provider: 'demo', model: 'demo-mode', enabled: true },
  { provider: 'ollama', model: 'llama3.1', enabled: false },
  { provider: 'openai', model: 'gpt-4o-mini', enabled: false },
  { provider: 'gemini', model: 'gemini-1.5-flash', enabled: false },
  { provider: 'claude', model: 'claude-3-haiku-20240307', enabled: false }
];

const defaultPrefs: UserPreferences = {
  language: 'both',
  theme: 'dark',
  notifications: true
};

export function MemoryProjectSystem() {
  const [memory, setMemory] = useState<MemoryEntry[]>(defaultMemory);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [providers, setProviders] = useState<ProviderModel[]>(defaultProviders);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPrefs);
  const [draft, setDraft] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MemoryEntry['category']>('note');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.memory) setMemory(parsed.memory);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.providers) setProviders(parsed.providers);
        if (parsed.preferences) setPreferences(parsed.preferences);
      } catch {
        // ignore malformed local data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ memory, projects, providers, preferences }));
  }, [memory, projects, providers, preferences]);

  const saveMemory = () => {
    const value = draft.trim();
    if (!value) return;

    const entry: MemoryEntry = {
      id: crypto.randomUUID(),
      title: `New ${selectedCategory}`,
      content: value,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMemory((prev) => [entry, ...prev]);
    setDraft('');
  };

  const toggleProvider = (provider: ProviderModel['provider']) => {
    setProviders((prev) =>
      prev.map((item) =>
        item.provider === provider ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const memorySummary = useMemo(() => ({
    total: memory.length,
    preferences: memory.filter((item) => item.category === 'preference').length,
    notes: memory.filter((item) => item.category === 'note').length,
    projects: projects.length
  }), [memory, projects.length]);

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 50px', color: '#edf2ff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 18 }}>
        <section style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Memory & Knowledge</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'Total', value: memorySummary.total },
              { label: 'Preferences', value: memorySummary.preferences },
              { label: 'Notes', value: memorySummary.notes },
              { label: 'Projects', value: memorySummary.projects }
            ].map((item) => (
              <div key={item.label} style={{ background: '#0f172a', borderRadius: 12, padding: 12, border: '1px solid rgba(148,163,184,0.12)' }}>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as MemoryEntry['category'])} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '9px 12px' }}>
              <option value="note">Note</option>
              <option value="preference">Preference</option>
              <option value="project">Project</option>
              <option value="document">Document</option>
            </select>
            <button onClick={saveMemory} style={{ background: 'linear-gradient(135deg, #7c3aed, #22c55e)', border: 'none', borderRadius: 10, color: '#fff', padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Save memory
            </button>
          </div>

          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} placeholder="Write what the assistant should remember..." style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(148,163,184,0.12)', background: '#0f172a', color: '#edf2ff', padding: '12px 14px', resize: 'vertical' }} />

          <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
            {memory.map((entry) => (
              <div key={entry.id} style={{ background: '#0f172a', borderRadius: 12, padding: 12, border: '1px solid rgba(148,163,184,0.12)' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{entry.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{entry.category}</div>
                <div style={{ lineHeight: 1.7 }}>{entry.content}</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Projects</div>
            {projects.map((project) => (
              <div key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(148,163,184,0.12)', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{project.title}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{project.status}</div>
                </div>
                <button onClick={() => setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, status: p.status === 'done' ? 'active' : 'done' } : p))} style={{ background: project.status === 'done' ? '#22c55e' : '#0ea5e9', border: 'none', color: '#fff', borderRadius: 9, padding: '8px 10px', cursor: 'pointer' }}>
                  {project.status === 'done' ? 'Done' : 'Mark'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Providers</div>
            {providers.map((provider) => (
              <div key={provider.provider} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', borderRadius: 10, padding: '10px 12px', marginBottom: 8, border: '1px solid rgba(148,163,184,0.12)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{provider.provider.toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{provider.model}</div>
                </div>
                <button onClick={() => toggleProvider(provider.provider)} style={{ background: provider.enabled ? '#22c55e' : '#64748b', border: 'none', color: '#fff', borderRadius: 9, padding: '8px 10px', cursor: 'pointer' }}>
                  {provider.enabled ? 'On' : 'Off'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Preferences</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <select value={preferences.language} onChange={(e) => setPreferences((prev) => ({ ...prev, language: e.target.value as UserPreferences['language'] }))} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }}>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="both">Both</option>
              </select>
              <select value={preferences.theme} onChange={(e) => setPreferences((prev) => ({ ...prev, theme: e.target.value as UserPreferences['theme'] }))} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Notifications</span>
                <input type="checkbox" checked={preferences.notifications} onChange={(e) => setPreferences((prev) => ({ ...prev, notifications: e.target.checked }))} />
              </label>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

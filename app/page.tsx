import AppShell from '@/components/app-shell';

export default function Home() {
  return (
    <AppShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 18px 50px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {[
            { title: 'Workspace', description: 'Main AI chat and personal command center', accent: '#7c3aed' },
            { title: 'Memory', description: 'Saved preferences, notes, and knowledge', accent: '#22c55e' },
            { title: 'Add-ons', description: 'Uploads, agents, automation', accent: '#38bdf8' },
            { title: 'Security', description: 'Session and auth controls', accent: '#f97316' }
          ].map((card) => (
            <div key={card.title} style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: card.accent, marginBottom: 10 }} />
              <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{card.title}</div>
              <div style={{ color: '#94a3b8', lineHeight: 1.7 }}>{card.description}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

import Link from 'next/link';

const navigation = [
  { href: '/', label: 'Workspace' },
  { href: '/memory', label: 'Memory' },
  { href: '/addons', label: 'Add-ons' },
  { href: '/security', label: 'Security' },
  { href: '/agents', label: 'Agents' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#07111d', color: '#edf2ff' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)', background: 'rgba(7,17,29,0.8)', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 16, height: 16, borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #22c55e)' }} />
            <div style={{ fontWeight: 800, fontSize: 20 }}>ARIA</div>
          </div>

          <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} style={{ color: '#e2e8f0', textDecoration: 'none', padding: '8px 12px', borderRadius: 10, background: item.href === '/' ? 'rgba(124,58,237,0.16)' : 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.12)' }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

export function SecureAuthPanel() {
  const [email, setEmail] = useState('harsh@aria.local');
  const [password, setPassword] = useState('aria123');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const login = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      setStatus('Login successful. Secure local session active.');
    } else {
      setStatus(data.error || 'Login failed.');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
    setStatus('Logged out.');
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Secure Setup</div>

      {user ? (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Logged in as {user.name}</div>
          <div style={{ color: '#cbd5e1', marginBottom: 12 }}>{user.email}</div>
          <button onClick={logout} style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 16px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '10px 12px' }} />
          <button onClick={login} style={{ background: 'linear-gradient(135deg, #7c3aed, #22c55e)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
            Login
          </button>
        </div>
      )}

      <div style={{ marginTop: 12, color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{status || 'This is demo-only authentication for local personal use. Production requires real auth, DB, and secret management.'}</div>
    </div>
  );
}

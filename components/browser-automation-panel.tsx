'use client';

import { useState } from 'react';

export function BrowserAutomationPanel() {
  const [url, setUrl] = useState('https://example.com');
  const [status, setStatus] = useState('Ready for automation tasks.');

  const runAutomation = () => {
    setStatus(`Automation request prepared for: ${url}.\n\nThis is a local-first workspace demonstration. Real browser automation would require explicit permission, sandboxing, and a tool integration layer.`);
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Browser Automation</div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#0f172a', color: '#edf2ff', border: '1px solid rgba(148,163,184,0.12)', marginBottom: 12 }} />
      <button onClick={runAutomation} style={{ background: 'linear-gradient(135deg, #f97316, #fb7185)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 16px', fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
        Run automation
      </button>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#cbd5e1' }}>{status}</div>
    </div>
  );
}

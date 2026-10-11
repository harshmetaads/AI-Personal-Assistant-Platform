'use client';

import { useRef, useState } from 'react';

export function DocumentUploadPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'document-analysis');

    setIsUploading(true);
    setStatus('Uploading file...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setStatus(data.summary || data.error || 'Unknown upload result');
    } catch (error) {
      setStatus('Upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>File Upload + Document Analysis</div>
      <input ref={fileInputRef} type="file" onChange={handleUpload} style={{ width: '100%', marginBottom: 12, color: '#edf2ff' }} />
      <div style={{ color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{isUploading ? 'Uploading...' : status}</div>
    </div>
  );
}

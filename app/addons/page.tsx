import AppShell from '@/components/app-shell';
import { BrowserAutomationPanel } from '@/components/browser-automation-panel';
import { DocumentUploadPanel } from '@/components/document-upload-panel';

export default function AddonsPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '26px 18px 50px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <DocumentUploadPanel />
          <BrowserAutomationPanel />
        </div>
      </div>
    </AppShell>
  );
}

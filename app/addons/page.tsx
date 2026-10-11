import { AgentWorkflowPanel } from '@/components/agent-workflow-panel';
import { BrowserAutomationPanel } from '@/components/browser-automation-panel';
import { DocumentUploadPanel } from '@/components/document-upload-panel';

export default function WorkspaceAddons() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 18px 50px', color: '#edf2ff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <DocumentUploadPanel />
        <AgentWorkflowPanel />
        <BrowserAutomationPanel />
      </div>
    </main>
  );
}

import { AgentWorkflowPanel } from '@/components/agent-workflow-panel';
import AppShell from '@/components/app-shell';

export default function AgentsPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '26px 18px 50px' }}>
        <AgentWorkflowPanel />
      </div>
    </AppShell>
  );
}

'use client';

import { useState } from 'react';

type Agent = {
  name: string;
  role: string;
  description: string;
  enabled: boolean;
};

const initialAgents: Agent[] = [
  { name: 'Research Agent', role: 'Research', description: 'Collects facts and summary data', enabled: true },
  { name: 'Coding Agent', role: 'Development', description: 'Helps with implementation and debugging', enabled: true },
  { name: 'Writing Agent', role: 'Content', description: 'Drafts emails, documents, and ideas', enabled: true },
  { name: 'Ops Agent', role: 'Automation', description: 'Handles workflows and operational support', enabled: false }
];

export function AgentWorkflowPanel() {
  const [agents, setAgents] = useState(initialAgents);

  const toggle = (name: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.name === name ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Agent Workflows</div>
      {agents.map((agent) => (
        <div key={agent.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(148,163,184,0.12)' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{agent.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{agent.role}</div>
            <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>{agent.description}</div>
          </div>
          <button onClick={() => toggle(agent.name)} style={{ background: agent.enabled ? '#22c55e' : '#64748b', border: 'none', color: '#fff', borderRadius: 9, padding: '8px 12px', cursor: 'pointer' }}>
            {agent.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      ))}
    </div>
  );
}

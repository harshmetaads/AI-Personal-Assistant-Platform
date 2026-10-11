'use client';

import { useEffect, useMemo, useState } from 'react';
import { QUICK_ACTIONS, PROVIDER_LABELS, type Message, type ProviderOption } from '@/lib/types';

const STORAGE_KEY = 'personal-ai-assistant-chat';

export function AssistantDashboard() {
  const [provider, setProvider] = useState<ProviderOption>('ollama');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! I am your personal AI assistant. Ask in Hindi, English, or any language you prefer. For a free setup, use Ollama locally.',
      provider: 'ollama'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        if (parsed?.length) setMessages(parsed);
      } catch {
        // ignore malformed local storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const providerSummary = useMemo(() => {
    return `${PROVIDER_LABELS[provider]} • ${messages.length} messages`;
  }, [messages.length, provider]);

  const sendPrompt = async (promptText?: string) => {
    const finalInput = (promptText ?? input).trim();
    if (!finalInput || isLoading) return;

    const nextUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: finalInput,
      provider
    };

    const conversation = [...messages, nextUserMessage];
    setMessages(conversation);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          messages: conversation.map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await response.json();
      const answer = data.answer || 'No answer generated.';

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer,
        provider
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong while contacting the AI service. Please check your free local setup or API keys.',
          provider
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: 24 }}>
        <aside style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 24, padding: 20, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #22c55e)' }} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>AI Assistant</div>
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: 13 }}>AI Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ProviderOption)}
            style={{ width: '100%', borderRadius: 12, padding: '12px 14px', background: '#0f172a', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div style={{ marginTop: 22, marginBottom: 16, color: 'var(--muted)', fontSize: 13 }}>Quick actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => sendPrompt(action)}
                style={{
                  textAlign: 'left',
                  background: 'rgba(15, 23, 42, 0.82)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  cursor: 'pointer'
                }}
              >
                {action}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 16, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Free option</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              Run <strong>Ollama</strong> locally for a free personal AI experience.
            </div>
          </div>
        </aside>

        <section style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 24, padding: 20, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>Personal AI Workspace</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 999, padding: '8px 12px' }}>
              {providerSummary}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 500, maxHeight: 640, overflowY: 'auto', paddingRight: 6 }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: message.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(15,23,42,0.88)',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: 18,
                  padding: '14px 16px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 18, padding: '12px 16px', color: 'var(--muted)' }}>
                Thinking…
              </div>
            )}
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in Hindi, English, or another language…"
              style={{
                flex: 1,
                resize: 'vertical',
                minHeight: 52,
                maxHeight: 180,
                borderRadius: 16,
                border: '1px solid var(--border)',
                background: '#0f172a',
                color: 'var(--text)',
                padding: '14px 16px',
                outline: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt();
                }
              }}
            />
            <button
              onClick={() => sendPrompt()}
              disabled={isLoading || !input.trim()}
              style={{
                border: 'none',
                background: isLoading || !input.trim() ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #22c55e)',
                color: '#fff',
                borderRadius: 16,
                padding: '14px 18px',
                fontWeight: 700,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

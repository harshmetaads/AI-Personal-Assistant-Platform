'use client';

import { useEffect, useMemo, useState } from 'react';
import { QUICK_ACTIONS, PROVIDER_LABELS, type Message, type ProviderOption } from '@/lib/types';

const STORAGE_KEY = 'personal-ai-secretary-state';

type TabKey = 'dashboard' | 'chat' | 'tasks' | 'planner' | 'notes' | 'automation';

type TaskItem = {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  due: string;
};

type NoteItem = {
  id: string;
  title: string;
  text: string;
};

const defaultTasks: TaskItem[] = [
  { id: '1', title: 'Review weekly goals', status: 'todo', priority: 'high', due: 'Today' },
  { id: '2', title: 'Prepare project update', status: 'doing', priority: 'medium', due: 'Tomorrow' },
  { id: '3', title: 'Follow up on important emails', status: 'done', priority: 'low', due: 'Done' }
];

const defaultNotes: NoteItem[] = [
  { id: '1', title: 'Daily focus', text: 'Prioritize one high-impact task in the morning and protect time for deep work.' },
  { id: '2', title: 'Learning idea', text: 'Build one useful automation per day and save working prompts in a personal template library.' }
];

export function AssistantDashboard() {
  const [provider, setProvider] = useState<ProviderOption>('ollama');
  const [input, setInput] = useState('');
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [tasks, setTasks] = useState<TaskItem[]>(defaultTasks);
  const [notes, setNotes] = useState<NoteItem[]>(defaultNotes);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! I am your personal AI secretary. I can help with planning, tasks, notes, summaries, email drafting, and daily productivity in Hindi or English.',
      provider: 'ollama'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { tasks?: TaskItem[]; notes?: NoteItem[]; messages?: Message[] };
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.messages?.length) setMessages(parsed.messages);
      } catch {
        // ignore malformed local storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks,
        notes,
        messages
      })
    );
  }, [tasks, notes, messages]);

  const providerSummary = useMemo(() => `${PROVIDER_LABELS[provider]} • ${messages.length} messages`, [messages.length, provider]);

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
    setTab('chat');
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

      const lower = finalInput.toLowerCase();
      if (lower.includes('task') || lower.includes('plan') || lower.includes('schedule')) {
        const newTask: TaskItem = {
          id: crypto.randomUUID(),
          title: finalInput.length > 30 ? finalInput.slice(0, 30) + '…' : finalInput,
          status: 'todo',
          priority: 'medium',
          due: 'Soon'
        };
        setTasks((prev) => [newTask, ...prev]);
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong while contacting the AI service. Please check your free local setup or API key configuration.',
          provider
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = () => {
    const title = input.trim();
    if (!title) return;
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      priority: 'medium',
      due: 'Today'
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput('');
    setTab('tasks');
  };

  const addNote = () => {
    const title = input.trim();
    if (!title) return;
    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      title,
      text: 'Personal note created from your assistant.'
    };
    setNotes((prev) => [newNote, ...prev]);
    setInput('');
    setTab('notes');
  };

  const toastSuggestions = useMemo(() => {
    const doneCount = tasks.filter((task) => task.status === 'done').length;
    const pending = tasks.length - doneCount;
    return [
      `${pending} tasks pending`,
      `${notes.length} notes saved`,
      doneCount >= 1 ? 'Nice pace today' : 'You can start with one important task'
    ];
  }, [notes.length, tasks]);

  const navItems: { key: TabKey; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'chat', label: 'Chat' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'planner', label: 'Planner' },
    { key: 'notes', label: 'Notes' },
    { key: 'automation', label: 'Automation' }
  ];

  const renderDashboard = () => (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        {[
          { label: 'Open tasks', value: tasks.filter((t) => t.status !== 'done').length.toString(), accent: '#7c3aed' },
          { label: 'Completed', value: tasks.filter((t) => t.status === 'done').length.toString(), accent: '#22c55e' },
          { label: 'Saved notes', value: notes.length.toString(), accent: '#0ea5e9' }
        ].map((card) => (
          <div key={card.label} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: card.accent }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 18 }}>
        <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Today’s focus</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Prioritize one meaningful outcome and protect your deep work window.</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text)', lineHeight: 1.8 }}>
            {toastSuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 18, padding: 18 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Quick automation ideas</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text)', lineHeight: 1.9 }}>
            <li>Auto-summarize daily meeting notes</li>
            <li>Draft personalized emails</li>
            <li>Turn ideas into daily plans</li>
            <li>Collect all important notes in one place</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 480 }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            background: message.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(15,23,42,0.88)',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: 18,
            padding: '12px 14px',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7
          }}
        >
          {message.content}
        </div>
      ))}

      {isLoading && (
        <div style={{ alignSelf: 'flex-start', background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 18, padding: '10px 14px', color: 'var(--muted)' }}>
          Thinking…
        </div>
      )}
    </div>
  );

  const renderTasks = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {tasks.map((task) => (
        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(15,23,42,0.8)', borderRadius: 16, border: '1px solid rgba(148,163,184,0.17)' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{task.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{task.due} • {task.priority} priority</div>
          </div>
          <button
            onClick={() =>
              setTasks((prev) =>
                prev.map((item) =>
                  item.id === task.id
                    ? {
                        ...item,
                        status: item.status === 'done' ? 'todo' : 'done'
                      }
                    : item
                )
              )
            }
            style={{ border: 'none', borderRadius: 999, background: task.status === 'done' ? '#22c55e' : '#0ea5e9', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}
          >
            {task.status === 'done' ? 'Done' : 'Mark done'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderPlanner = () => (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ padding: 18, background: 'rgba(15,23,42,0.8)', borderRadius: 18, border: '1px solid rgba(148,163,184,0.18)' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Suggested daily flow</div>
        <div style={{ lineHeight: 1.9 }}>
          1. 08:00 – Review priorities and set the one meaningful outcome.<br />
          2. 09:00 – Focus block for the most important task.<br />
          3. 11:00 – Handle quick admin tasks and correspondence.<br />
          4. 14:00 – Deep work or project execution.<br />
          5. 17:00 – Review progress and prepare tomorrow’s plan.
        </div>
      </div>
      <div style={{ padding: 18, background: 'rgba(15,23,42,0.8)', borderRadius: 18, border: '1px solid rgba(148,163,184,0.18)' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>AI planning prompt</div>
        <div style={{ color: 'var(--text)', lineHeight: 1.8 }}>
          “Create a realistic plan for my day using my top 3 priorities, time blocks, and quick tasks. Keep it efficient and minimal.”
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {notes.map((note) => (
        <div key={note.id} style={{ background: 'rgba(15,23,42,0.8)', borderRadius: 18, border: '1px solid rgba(148,163,184,0.18)', padding: 18 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{note.title}</div>
          <div style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{note.text}</div>
        </div>
      ))}
    </div>
  );

  const renderAutomation = () => (
    <div style={{ display: 'grid', gap: 14 }}>
      {[
        'Auto-generate a daily summary from notes and tasks',
        'Draft personal emails with a professional tone',
        'Summarize long content into short actions',
        'Turn raw ideas into a weekly plan',
        'Collect and organize important reminders'
      ].map((item) => (
        <div key={item} style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.8)' }}>
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <main style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 18px 50px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 24 }}>
        <aside style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 24, padding: 20, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #22c55e)' }} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal</div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>AI Secretary</div>
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

          <div style={{ marginTop: 22, marginBottom: 12, color: 'var(--muted)', fontSize: 13 }}>Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{
                  textAlign: 'left',
                  background: tab === item.key ? 'rgba(124,58,237,0.18)' : 'rgba(15,23,42,0.7)',
                  border: tab === item.key ? '1px solid rgba(124,58,237,0.38)' : '1px solid rgba(148,163,184,0.15)',
                  padding: '10px 12px',
                  borderRadius: 12,
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 26, marginBottom: 10, color: 'var(--muted)', fontSize: 13 }}>Quick actions</div>
          <div style={{ display: 'grid', gap: 8 }}>
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
                  padding: '10px 12px',
                  cursor: 'pointer'
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </aside>

        <section style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 24, padding: 20, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workspace</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>Personal AI Command Center</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 999, padding: '8px 12px' }}>
              {providerSummary}
            </div>
          </div>

          {tab === 'dashboard' && renderDashboard()}
          {tab === 'chat' && renderChat()}
          {tab === 'tasks' && renderTasks()}
          {tab === 'planner' && renderPlanner()}
          {tab === 'notes' && renderNotes()}
          {tab === 'automation' && renderAutomation()}

          <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Ask for plans, notes, emails, summaries, or personal productivity support…"
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
                  if (tab === 'tasks') addTask();
                  else if (tab === 'notes') addNote();
                  else sendPrompt();
                }
              }}
            />
            <button
              onClick={() => {
                if (tab === 'tasks') addTask();
                else if (tab === 'notes') addNote();
                else sendPrompt();
              }}
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
              {tab === 'tasks' ? 'Add task' : tab === 'notes' ? 'Save note' : 'Send'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

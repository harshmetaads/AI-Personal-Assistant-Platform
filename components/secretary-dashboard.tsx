'use client';

import { useEffect, useMemo, useState } from 'react';
import { QUICK_ACTIONS, PROVIDER_LABELS, SAMPLE_AUTOMATIONS, type Message, type NoteItem, type ProviderOption, type TaskItem } from '@/lib/types';

const STORAGE_KEY = 'personal-ai-secretary-master';

type TabKey = 'dashboard' | 'chat' | 'tasks' | 'planner' | 'notes' | 'automation' | 'settings';

const DEFAULT_TASKS: TaskItem[] = [
  { id: '1', title: 'Review weekly goals', description: 'Check progress on main objectives', status: 'todo', priority: 'high', due: 'Today', tags: ['priority'] },
  { id: '2', title: 'Prepare project update', status: 'doing', priority: 'high', due: 'Today', tags: ['work'] },
  { id: '3', title: 'Follow up on emails', status: 'done', priority: 'medium', due: 'Done', tags: ['admin'] }
];

const DEFAULT_NOTES: NoteItem[] = [
  { id: '1', title: '🎯 Personal Mission', text: 'Build one meaningful thing per day. Protect deep work time. Learn from every task.' },
  { id: '2', title: '💡 Productivity Insight', text: 'The most productive hour is when you are most focused and least interrupted.' }
];

export function SecretaryDashboard() {
  const [provider, setProvider] = useState<ProviderOption>('ollama');
  const [input, setInput] = useState('');
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS);
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `🎉 Namaste! I'm your Personal AI Secretary. I can help you with:

📋 Planning: Daily schedules, weekly goals, project management
📧 Writing: Professional emails, documents, summaries
🎯 Organization: Tasks, notes, ideas, reminders
📚 Research: Deep dives, information gathering, learning
🤖 Automation: Save time with smart workflows
💭 Thinking: Brainstorming, decision-making, problem-solving

I work best in Hindi, English, or any language you prefer.
Ask me anything or use quick actions below!`,
      provider: 'ollama'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState({ language: 'english', theme: 'dark', notificationsEnabled: true });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.tasks?.length) setTasks(data.tasks);
        if (data.notes?.length) setNotes(data.notes);
        if (data.messages?.length) setMessages(data.messages);
        if (data.userPrefs) setUserPrefs(data.userPrefs);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, notes, messages, userPrefs }));
  }, [tasks, notes, messages, userPrefs]);

  const stats = useMemo(() => {
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'done').length,
      pendingTasks: tasks.filter((t) => t.status !== 'done').length,
      totalNotes: notes.length,
      totalMessages: messages.length
    };
  }, [tasks, notes, messages]);

  const sendMessage = async (promptText?: string) => {
    const finalInput = (promptText ?? input).trim();
    if (!finalInput || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: finalInput,
      provider,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setTab('chat');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          messages: updatedMessages.map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || 'No response generated.',
        provider,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-detect and create tasks from chat
      const lower = finalInput.toLowerCase();
      if (lower.includes('task') || lower.includes('todo') || lower.includes('remember')) {
        const newTask: TaskItem = {
          id: crypto.randomUUID(),
          title: finalInput.slice(0, 50),
          status: 'todo',
          priority: 'medium',
          due: 'Today'
        };
        setTasks((prev) => [newTask, ...prev]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '❌ Service unavailable. Check your Ollama setup or API keys.',
          provider: 'error'
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
      text: 'Your note content here...'
    };
    setNotes((prev) => [newNote, ...prev]);
    setInput('');
    setTab('notes');
  };

  const renderDashboard = () => (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
        {[
          { label: '📋 Open Tasks', value: stats.pendingTasks, color: '#7c3aed' },
          { label: '✅ Completed', value: stats.completedTasks, color: '#22c55e' },
          { label: '📝 Notes', value: stats.totalNotes, color: '#0ea5e9' },
          { label: '💬 Messages', value: stats.totalMessages, color: '#f97316' }
        ].map((card) => (
          <div key={card.label} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{card.label.split(' ')[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{card.label.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 16 }}>
        <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>📌 Today's Focus</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, lineHeight: 1.5 }}>Choose one meaningful outcome and protect your deep work time.</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text)', lineHeight: 1.9, fontSize: 14 }}>
            <li>Start with your highest priority task</li>
            <li>Minimize interruptions for 90 minutes</li>
            <li>Review progress at day-end</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>💪 Productivity Tip</div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)' }}>
            One task done well beats five done poorly.
            <br />
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Focus on impact, not volume.</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 16, padding: 18 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>🚀 You can also:</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {['📊 Analytics', '🔔 Reminders', '⚙️ Settings', '📤 Export Data', '🌐 Integrations', '💾 Backup'].map((item) => (
            <button key={item} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.7)', color: 'var(--text)', cursor: 'pointer' }}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 500, maxHeight: 620, overflowY: 'auto' }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
          <div
            style={{
              background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(15,23,42,0.88)',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: 18,
              padding: '12px 16px',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              wordBreak: 'break-word'
            }}
          >
            {msg.content}
          </div>
          {msg.timestamp && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>}
        </div>
      ))}

      {isLoading && (
        <div style={{ alignSelf: 'flex-start', background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 18, padding: '10px 14px', color: 'var(--muted)' }}>
          ⏳ Thinking...
        </div>
      )}
    </div>
  );

  const renderTasks = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {tasks.map((task) => (
        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(15,23,42,0.8)', borderRadius: 14, border: '1px solid rgba(148,163,184,0.17)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{task.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              📅 {task.due} • Priority: {task.priority}
            </div>
            {task.description && <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 4 }}>{task.description}</div>}
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
            style={{ border: 'none', borderRadius: 10, background: task.status === 'done' ? '#22c55e' : '#0ea5e9', color: '#fff', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}
          >
            {task.status === 'done' ? '✅ Done' : '◯ Mark Done'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderPlanner = () => (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ padding: 18, background: 'rgba(15,23,42,0.8)', borderRadius: 14, border: '1px solid rgba(148,163,184,0.18)' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>⏰ Optimal Daily Schedule</div>
        {[
          { time: '08:00', task: 'Plan day + review goals', dur: '30m' },
          { time: '09:00', task: 'Deep work on priority #1', dur: '90m' },
          { time: '10:30', task: 'Quick admin tasks', dur: '30m' },
          { time: '14:00', task: 'Focus block: priority #2', dur: '90m' },
          { time: '16:00', task: 'Emails + communication', dur: '45m' },
          { time: '17:00', task: 'Review day + plan tomorrow', dur: '30m' }
        ].map((item) => (
          <div key={item.time} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.1)', lineHeight: 1.6 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.time}</div>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{item.task}</div>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{item.dur}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {notes.map((note) => (
        <div key={note.id} style={{ background: 'rgba(15,23,42,0.8)', borderRadius: 14, border: '1px solid rgba(148,163,184,0.18)', padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{note.title}</div>
          <div style={{ color: 'var(--text)', lineHeight: 1.8 }}>{note.text}</div>
        </div>
      ))}
    </div>
  );

  const renderAutomation = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {SAMPLE_AUTOMATIONS.map((auto) => (
        <div key={auto.title} style={{ padding: 16, borderRadius: 14, border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.8)' }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{auto.title}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{auto.desc}</div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ padding: 18, background: 'rgba(15,23,42,0.8)', borderRadius: 14, border: '1px solid rgba(148,163,184,0.18)' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>⚙️ Preferences</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { label: 'Language', value: userPrefs.language, options: ['english', 'hindi', 'both'] },
            { label: 'Theme', value: userPrefs.theme, options: ['dark', 'light'] }
          ].map((pref) => (
            <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ color: 'var(--text)' }}>{pref.label}</label>
              <select value={pref.value} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.16)', background: '#0f172a', color: 'var(--text)' }}>
                {pref.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const navItems = [
    { key: 'dashboard' as TabKey, label: '📊 Dashboard' },
    { key: 'chat' as TabKey, label: '💬 Chat' },
    { key: 'tasks' as TabKey, label: '📋 Tasks' },
    { key: 'planner' as TabKey, label: '📅 Planner' },
    { key: 'notes' as TabKey, label: '📝 Notes' },
    { key: 'automation' as TabKey, label: '🤖 Automation' },
    { key: 'settings' as TabKey, label: '⚙️ Settings' }
  ];

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px 50px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 22 }}>
        {/* SIDEBAR */}
        <aside style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 22, padding: 18, boxShadow: 'var(--shadow)', height: 'fit-content', position: 'sticky', top: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 16, height: 16, borderRadius: 9999, background: 'linear-gradient(135deg, #7c3aed, #22c55e)' }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Secretary</div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>Assistant</div>
            </div>
          </div>

          <div style={{ marginBottom: 6, color: 'var(--muted)', fontSize: 12 }}>AI Provider</div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ProviderOption)}
            style={{ width: '100%', borderRadius: 10, padding: '10px 12px', background: '#0f172a', color: 'var(--text)', border: '1px solid var(--border)', marginBottom: 16, cursor: 'pointer' }}
          >
            {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div style={{ marginBottom: 10, color: 'var(--muted)', fontSize: 12 }}>Navigation</div>
          <div style={{ display: 'grid', gap: 6, marginBottom: 18 }}>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{
                  textAlign: 'left',
                  background: tab === item.key ? 'rgba(124,58,237,0.16)' : 'rgba(15,23,42,0.7)',
                  border: tab === item.key ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(148,163,184,0.13)',
                  padding: '10px 12px',
                  borderRadius: 10,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 10, color: 'var(--muted)', fontSize: 12 }}>Quick Actions</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {QUICK_ACTIONS.slice(0, 5).map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                style={{
                  textAlign: 'left',
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(148,163,184,0.13)',
                  color: 'var(--text)',
                  borderRadius: 10,
                  padding: '9px 11px',
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 22, padding: 20, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal Workspace</div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>AI Command Center</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 999, padding: '10px 14px' }}>
              {PROVIDER_LABELS[provider]} • {messages.length} messages
            </div>
          </div>

          <div style={{ minHeight: 500, marginBottom: 20 }}>
            {tab === 'dashboard' && renderDashboard()}
            {tab === 'chat' && renderChat()}
            {tab === 'tasks' && renderTasks()}
            {tab === 'planner' && renderPlanner()}
            {tab === 'notes' && renderNotes()}
            {tab === 'automation' && renderAutomation()}
            {tab === 'settings' && renderSettings()}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder={`Ask for help, add a task, take a note, or request automation...`}
              style={{
                flex: 1,
                resize: 'vertical',
                minHeight: 52,
                maxHeight: 160,
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: '#0f172a',
                color: 'var(--text)',
                padding: '13px 15px',
                outline: 'none',
                fontSize: 14
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (tab === 'tasks') addTask();
                  else if (tab === 'notes') addNote();
                  else sendMessage();
                }
              }}
            />
            <button
              onClick={() => {
                if (tab === 'tasks') addTask();
                else if (tab === 'notes') addNote();
                else sendMessage();
              }}
              disabled={isLoading || !input.trim()}
              style={{
                border: 'none',
                background: isLoading || !input.trim() ? 'rgba(124,58,237,0.35)' : 'linear-gradient(135deg, #7c3aed, #22c55e)',
                color: '#fff',
                borderRadius: 14,
                padding: '13px 20px',
                fontWeight: 700,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'tasks' ? '➕ Add' : tab === 'notes' ? '💾 Save' : '✉️ Send'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  timestamp?: string;
};

export type ProviderOption = 'ollama' | 'openai' | 'gemini' | 'claude';

export const PROVIDER_LABELS: Record<ProviderOption, string> = {
  ollama: '🎯 Local Free',
  openai: '⚡ OpenAI',
  gemini: '🌟 Gemini',
  claude: '🔮 Claude'
};

export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due: string;
  tags?: string[];
};

export type NoteItem = {
  id: string;
  title: string;
  text: string;
  tags?: string[];
  createdAt?: string;
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  duration: string;
  priority: Priority;
};

export const QUICK_ACTIONS = [
  '📋 Plan my day',
  '📧 Draft a professional email',
  '📝 Summarize in Hindi',
  '⏰ Create a study schedule',
  '🎯 Help me prioritize',
  '💡 Automation ideas',
  '📚 Research this topic',
  '✨ Generate daily affirmation'
];

export const SAMPLE_AUTOMATIONS = [
  { title: 'Daily Summary', desc: 'Auto-summarize your day from notes & tasks' },
  { title: 'Email Draft', desc: 'Turn ideas into professional emails' },
  { title: 'Task Planner', desc: 'Convert ideas into actionable tasks' },
  { title: 'Meeting Recap', desc: 'Auto-transcribe and summarize meetings' },
  { title: 'Research Mode', desc: 'Deep dive research on any topic' },
  { title: 'Personal Journal', desc: 'Auto-organize daily reflections' },
  { title: 'Document Writer', desc: 'Generate reports and documentation' },
  { title: 'Knowledge Base', desc: 'Store and retrieve personal knowledge' }
];

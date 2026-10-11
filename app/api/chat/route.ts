export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
};

export type ProviderOption = 'ollama' | 'openai' | 'gemini' | 'claude';

export const PROVIDER_LABELS: Record<ProviderOption, string> = {
  ollama: 'Local Free (Ollama)',
  openai: 'OpenAI',
  gemini: 'Gemini',
  claude: 'Claude'
};

export const QUICK_ACTIONS = [
  'Plan my day and keep it realistic',
  'Write a professional email for me',
  'Summarize my goals in Hindi',
  'Create a study schedule',
  'Help me manage my tasks better'
];

export type AssistantTask = {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  due: string;
};

export type AssistantNote = {
  id: string;
  title: string;
  text: string;
};

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
  'Help me make a daily plan',
  'Create a study schedule',
  'Summarize this idea in Hindi',
  'Write a professional email',
  'Plan my personal productivity workflow'
];

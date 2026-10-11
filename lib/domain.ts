export type MemoryEntry = {
  id: string;
  title: string;
  content: string;
  category: 'preference' | 'project' | 'note' | 'document';
  createdAt: string;
  updatedAt: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'done';
  updatedAt: string;
};

export type ProviderModel = {
  provider: 'demo' | 'ollama' | 'openai' | 'gemini' | 'claude';
  model: string;
  enabled: boolean;
};

export type UserPreferences = {
  language: 'english' | 'hindi' | 'both';
  theme: 'dark' | 'light';
  notifications: boolean;
};

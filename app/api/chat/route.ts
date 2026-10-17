export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SYSTEM_PROMPT = `You are a personal AI assistant for one user. Be helpful, practical, and multilingual. Prefer concise but useful answers. Respond in English or Hindi unless user clearly asks for another language. Keep tone friendly, efficient, and trustworthy.`;

function getProviderConfig(provider: string) {
  const isLocal = provider === 'ollama';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';

  return {
    name: provider,
    model,
    isLocal,
    apiKey: process.env[`${provider.toUpperCase()}_API_KEY`] || ''
  };
}

async function callOllama(messages: Array<{ role: string; content: string }>) {
  const model = process.env.OLLAMA_MODEL || 'llama3.1';

  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama setup issue: ${text}`);
  }

  const data = await response.json();
  const content = data.message?.content || 'No response from local model.';
  return content;
}

async function callOpenAI(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it in .env.local');
  }

  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7
  });

  return completion.choices[0]?.message?.content || 'No response';
}

async function callGemini(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add it in .env.local');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

  const prompt = `${DEFAULT_SYSTEM_PROMPT}\n\n${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function callClaude(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is missing. Add it in .env.local');
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: DEFAULT_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  });

  const textBlocks = response.content.filter((item) => item.type === 'text');
  return textBlocks.map((item) => item.text).join('\n');
}

async function callProvider(provider: string, messages: Array<{ role: string; content: string }>) {
  const config = getProviderConfig(provider);

  if (config.isLocal) {
    return await callOllama(messages);
  }

  switch (provider) {
    case 'openai':
      return await callOpenAI(messages);
    case 'gemini':
      return await callGemini(messages);
    case 'claude':
      return await callClaude(messages);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, provider = 'ollama' } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    const answer = await callProvider(provider, messages);

    return NextResponse.json({
      answer,
      provider,
      success: true
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    const message = error?.message || 'Unknown error';

    return NextResponse.json({
      answer: `I could not connect to the selected AI provider.\n\nReason: ${message}\n\nUse one of these options:\n- Install Ollama and run: ollama pull llama3.1\n- Or set OPENAI_API_KEY / GEMINI_API_KEY / ANTHROPIC_API_KEY in .env.local`,
      provider: 'error',
      success: false,
      error: message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    providers: ['ollama', 'openai', 'gemini', 'claude'],
    note: 'Use Ollama for a free local model. API providers require keys.'
  });
}

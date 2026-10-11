# Personal AI Assistant

A personal AI assistant project designed for personal use. It supports:

- Local free mode with Ollama
- OpenAI, Gemini, and Claude providers
- Multilingual chat experience
- Easy setup for daily personal productivity

## Features

- Chat interface with provider selector
- Quick actions such as planning, email writing, schedules
- Clear support for Hindi/English and flexible language use
- Works locally with a free model via Ollama
- Optional cloud provider connection with API keys

## Recommended free setup

Install Ollama and pull a local model:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1
```

Then run the app:

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Optional providers

Create a `.env.local` file:

```env
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.1

# Optional cloud providers
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

## Project structure

- `app/page.tsx` – main UI
- `app/api/chat/route.ts` – AI request handler
- `components/assistant-dashboard.tsx` – chat UI logic
- `lib/types.ts` – type definitions

## Notes

This app is designed for personal use and local testing. It is not a SaaS product and does not guarantee commercial-scale availability from free endpoints. For the strongest results, use a local model with Ollama or add your own API keys.

## Launch commands

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

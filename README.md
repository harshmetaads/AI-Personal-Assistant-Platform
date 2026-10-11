# 🎯 Personal AI Secretary Platform

**Your all-in-one AI assistant for productivity, planning, writing, and automation.**

A full-featured personal AI workspace combining chat, task management, note-taking, daily planning, and automation suggestions — powered by free local AI (Ollama) or optional cloud providers.

## ✨ Features

### 📊 Dashboard
- Real-time stats: open tasks, completed tasks, saved notes
- Daily focus guidance
- Productivity insights and tips
- Quick access to all features

### 💬 Chat
- Natural conversation with your AI assistant
- Support for multiple languages (Hindi, English, etc.)
- Multilingual providers: Ollama, OpenAI, Gemini, Claude
- Message history with timestamps

### 📋 Tasks
- Create and manage personal tasks
- Priority levels: low, medium, high
- Status tracking: todo, doing, done
- Due dates and descriptions
- Auto-detect tasks from chat

### 📅 Planner
- Optimal daily schedule template
- Time blocking recommendations
- Focus block scheduling
- Productivity workflow guidance

### 📝 Notes
- Quick note capture
- Organize thoughts and ideas
- Personal reminders and insights
- Auto-save to browser storage

### 🤖 Automation
- Daily summaries
- Email drafting
- Task planning from ideas
- Meeting recaps
- Research mode
- Personal journal
- Document generation
- Knowledge base building

### ⚙️ Settings
- Language preferences (English, Hindi, both)
- Theme selection
- Notification settings
- Provider configuration

## 🚀 Quick Start

### Free Local Setup (Recommended)

**Install Ollama:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1
```

**Setup Project:**
```bash
npm install
npm run dev
```

**Open in browser:**
```
http://localhost:3000
```

### Optional Cloud Providers

Create `.env.local`:
```env
# Ollama (Free, Local)
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.1

# OpenAI (Optional)
OPENAI_API_KEY=sk_...
OPENAI_MODEL=gpt-4o-mini

# Google Gemini (Optional)
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash

# Anthropic Claude (Optional)
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Main page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── chat/route.ts        # AI chat API endpoint
├── components/
│   └── secretary-dashboard.tsx  # Main UI component
├── lib/
│   └── types.ts                 # TypeScript types
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes
- **AI Models:** Ollama (local), OpenAI, Gemini, Claude
- **Storage:** Browser localStorage
- **Styling:** Inline CSS with CSS variables

## 💡 Usage Tips

1. **Start with local Ollama** for completely free, private AI
2. **Use quick actions** on the sidebar for common tasks
3. **Switch providers** anytime from the dropdown
4. **Auto-detect tasks** by mentioning "task", "todo", or "remember"
5. **Multilingual support** — ask in Hindi or English
6. **Data persists** in your browser automatically

## 🔐 Privacy

- Local Ollama mode: All data stays on your machine
- Cloud providers: Data sent to respective AI services
- No server-side storage of conversations
- Browser localStorage for local state

## 📚 Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

## 🎯 Roadmap

- [ ] Voice input/output
- [ ] Email integration
- [ ] Calendar sync
- [ ] File uploads
- [ ] Browser extensions
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Advanced analytics

## ❓ FAQ

**Q: Do I need an API key?**
A: No! Ollama is completely free and local. API keys are optional for cloud providers.

**Q: What happens to my data?**
A: With Ollama, everything stays on your computer. With cloud providers, check their privacy policies.

**Q: Can I use this offline?**
A: Yes, with Ollama running locally.

**Q: What languages does it support?**
A: Hindi, English, and any language your AI model supports.

## 📝 License

Personal use only. Free to use and modify for yourself.

## 🤝 Support

For issues:
1. Check Ollama is running: `ollama serve`
2. Verify API keys in `.env.local`
3. Check browser console for errors
4. Restart dev server: `npm run dev`

---

**Made with ❤️ for personal productivity and AI-powered automation.**

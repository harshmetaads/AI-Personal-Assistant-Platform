# Working in this repo (Base44 sandbox)

Personal AI Assistant — Next.js 14 (app router, TypeScript) chat UI with a provider
selector (`ollama` | `openai` | `gemini` | `claude`).

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Web UI on http://localhost:3000. `web` is `node:22` running the cloned source with
`next dev` (live reload), so edits appear without a rebuild.

## Non-obvious setup facts

- **Local model, no keys needed.** The default provider is `ollama`, backed by the
  `ollama` compose service. `ollama-pull` is a one-shot service that pulls
  `llama3.2:1b` (small/CPU-friendly; the sandbox has no GPU). Change the model in
  `.env.base44-defaults` (`OLLAMA_MODEL`) — the pull service must be updated to match.
- `app/api/chat/route.ts` reads `OLLAMA_BASE_URL` (falls back to
  `http://localhost:11434`). Compose sets it to `http://ollama:11434`; that is why the
  app can talk to the Ollama container instead of "localhost".
- Dependencies are **not** baked into an image: `node_modules` and `.next` are Docker
  volumes and `npm install` runs on every container start. The repo has no lockfile, so
  installs resolve fresh.
- Secrets: `/run/base44/app.env` (platform-managed, outside the repo) is listed LAST in
  `env_file`, after the committed `.env.base44-defaults` placeholders, so real keys win.
  Cloud providers are optional — without a key the API returns a friendly error string.
- `WATCHPACK_POLLING=true` is required for hot reload over the bind mount.
- `BASE44_PREVIEW_MODE` is passed through as a bare compose variable; nothing in shared
  app config is gated on it (no app-code overrides are needed here).

## Verify it works

```bash
curl -s http://localhost:3000/api/health                       # {"status":"ok",...}
curl -s -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' \
  -d '{"provider":"ollama","messages":[{"role":"user","content":"hi"}]}'   # {"answer":...,"success":true}
```

The compose healthcheck for `web` probes `/api/health`; `ollama` is probe by its own CLI
(`ollama list`) because the image ships without curl/wget.

## Known pre-existing issue

The chat layout uses a fixed 320px sidebar column, so at phone widths the page scrolls
sideways (~157px overflow at 375px). Not caused by the sandbox setup and not fixed here.

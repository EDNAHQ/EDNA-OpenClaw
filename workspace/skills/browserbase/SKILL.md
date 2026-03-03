---
name: browserbase
description: Browse websites using BrowserBase cloud headless browsers. Use for any task requiring a real browser — web scraping, form filling, login automation, site testing, screenshots, PDF generation, monitoring pages, or extracting content from JS-rendered sites. Handles anti-bot detection, captchas, and stealth mode automatically. NOT for simple URL fetching where web_fetch suffices.
---

# BrowserBase Cloud Browser

Run headless Chrome in the cloud via BrowserBase. Sessions include stealth mode, captcha solving, and residential proxies.

## Prerequisites

- `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` in env vars (config)
- `playwright-core` installed in skill dir (`npm install --prefix <skill-dir> playwright-core` if missing)

## Quick Usage

### 1. Simple browse + screenshot

Create an actions JSON file, then run:

```bash
cat > /tmp/actions.json << 'EOF'
[
  { "action": "goto", "url": "https://example.com" },
  { "action": "screenshot", "path": "/tmp/screenshot.png", "fullPage": true }
]
EOF
node scripts/bb-browse.mjs /tmp/actions.json
```

### 2. Login flow with persistent context

First create a context to save cookies:
```bash
scripts/bb-context.sh create
# Returns: {"id": "<context-id>", ...}
```

Then browse with that context:
```bash
cat > /tmp/actions.json << 'EOF'
[
  { "action": "goto", "url": "https://app.example.com/login" },
  { "action": "fill", "selector": "#email", "value": "user@example.com" },
  { "action": "fill", "selector": "#password", "value": "secret" },
  { "action": "click", "selector": "#login-btn" },
  { "action": "wait", "ms": 3000 },
  { "action": "screenshot", "path": "/tmp/logged-in.png" }
]
EOF
node scripts/bb-browse.mjs /tmp/actions.json --context <context-id> --persist
```

Future sessions with `--context <id>` reuse saved cookies (no re-login needed).

### 3. Extract page content

```json
[
  { "action": "goto", "url": "https://example.com" },
  { "action": "text", "selector": "body" },
  { "action": "evaluate", "script": "document.title" }
]
```

Results include extracted text and evaluated values in the output JSON.

## Available Actions

| Action | Key params | Description |
|---|---|---|
| `goto` | `url`, `waitUntil?`, `timeout?` | Navigate to URL |
| `wait` | `ms` | Wait fixed duration |
| `screenshot` | `path?`, `fullPage?` | Capture screenshot |
| `fill` | `selector`, `value` | Clear + fill input field |
| `click` | `selector`, `timeout?` | Click element |
| `type` | `selector`, `text`, `delay?` | Type text (keystroke sim) |
| `wait_for` | `selector`, `timeout?`, `state?` | Wait for element |
| `text` | `selector?` | Extract innerText |
| `html` | `selector?` | Extract innerHTML |
| `evaluate` | `script` | Run JS, return result |
| `pdf` | `path?` | Save page as PDF |
| `select` | `selector`, `value` | Select dropdown option |
| `hover` | `selector` | Hover element |
| `keyboard` | `key` | Press keyboard key |
| `scroll` | `x?`, `y?` | Scroll page |

## Helper Scripts

- **`scripts/bb-browse.mjs`** — Main automation script. Creates session, connects Playwright, runs action steps, returns JSON results.
  - `--context <id>` — Use persistent context
  - `--persist` — Save context after session
  - `--screenshot <path>` — Auto-screenshot at end
  - `--keep-alive` — Don't stop session after script ends
- **`scripts/bb-session.sh`** — Session management: `create`, `stop`, `status`, `list`
- **`scripts/bb-context.sh`** — Context management: `create`, `list`, `delete`

## Output Format

`bb-browse.mjs` prints JSON to stdout:
```json
{
  "sessionId": "...",
  "inspectorUrl": "https://www.browserbase.com/sessions/...",
  "results": [
    { "action": "goto", "ok": true, "url": "...", "title": "..." },
    { "action": "text", "ok": true, "text": "..." }
  ]
}
```

Errors per-step include `"ok": false, "error": "..."` — script continues through failures.

## Cron / Scheduled Use

For recurring tasks (e.g., daily site check), create a cron job that runs `bb-browse.mjs` with a saved context. Store context IDs in workspace files for reuse.

## Parallel Sessions — Use By Default

**When exploring or scraping multiple pages/sections, always use parallel sessions.** BrowserBase supports concurrent browser instances — don't run them sequentially unless there's a dependency between steps.

### When to parallelise
- Mapping multiple pages of a site (e.g. homepage, pricing, about, docs)
- Scraping data from several URLs
- Comparing multiple sites side-by-side
- Any task touching 2+ independent URLs

### How
Spawn multiple `bb-browse.mjs` processes in the background, each with its own actions file:

```bash
# Create separate action files for each target
cat > /tmp/actions-homepage.json << 'EOF'
[{"action":"goto","url":"https://example.com"},{"action":"text","selector":"body"}]
EOF
cat > /tmp/actions-pricing.json << 'EOF'
[{"action":"goto","url":"https://example.com/pricing"},{"action":"text","selector":"body"}]
EOF
cat > /tmp/actions-docs.json << 'EOF'
[{"action":"goto","url":"https://example.com/docs"},{"action":"text","selector":"body"}]
EOF

# Run all in parallel
node scripts/bb-browse.mjs /tmp/actions-homepage.json > /tmp/result-homepage.json &
node scripts/bb-browse.mjs /tmp/actions-pricing.json > /tmp/result-pricing.json &
node scripts/bb-browse.mjs /tmp/actions-docs.json > /tmp/result-docs.json &
wait
```

### Limits
- Keep to 3-4 concurrent sessions to stay within BrowserBase plan limits
- If sessions share a context (logged-in state), create the context first, then pass `--context <id>` to each parallel session
- Each parallel session is independent — no shared state between them unless using the same context

## Tips

- Use `wait` after login clicks — pages need time to redirect
- Use `wait_for` for dynamic content instead of fixed waits
- Screenshots go to the sandbox filesystem — use `read` tool to view them
- Session recordings available at the inspector URL for debugging
- Each session has a 5-min connection timeout — sessions auto-terminate if unused
- `text` action on `body` gives full page text — good for content extraction
- For complex multi-page flows, chain multiple `goto` + interaction steps

# OpenClaw Instance Setup Guide — From Zero to Running in 30 Minutes

_Based on EDNA Claw setup on 2026-02-24. Use this as the exact playbook for new instances._

---

## Prerequisites (have these ready BEFORE starting)

- [ ] Digital Ocean account
- [ ] Domain or IP for access
- [ ] API keys ready:
  - Anthropic API key (powers the agent + Claude Code)
  - OpenAI API key (for app features)
  - OpenRouter API key(s) (optional, for model variety)
  - Brave Search API key (for web search)
  - GitHub Personal Access Token (repo access)
  - Telegram Bot Token (if using Telegram channel)
- [ ] GitHub repo forked/cloned: `EDNAHQ/EDNA-OpenClaw` (or equivalent)

---

## Step 1: Create Digital Ocean Droplet (5 min)

1. Create droplet:
   - **Region:** Choose closest (EDNA used Sydney syd1)
   - **Image:** Ubuntu 24.04 LTS
   - **Size:** 2 vCPU, 4GB RAM, 120GB disk (s-2vcpu-4gb-120gb-intel)
   - **Auth:** SSH key (recommended) or password
   
2. SSH in:
   ```bash
   ssh root@<DROPLET_IP>
   ```

3. Create a non-root user (OpenClaw runs as non-root):
   ```bash
   adduser sam
   usermod -aG sudo sam
   ```

4. Install Docker:
   ```bash
   apt update && apt upgrade -y
   apt install -y docker.io docker-compose-plugin
   systemctl enable docker
   systemctl start docker
   ```

5. Switch to your user:
   ```bash
   su - sam
   ```

---

## Step 2: Set Up OpenClaw (10 min)

1. **Clone the OpenClaw repo** (as root, since /root is where it lives):
   ```bash
   sudo git clone https://github.com/EDNAHQ/EDNA-OpenClaw.git /root/openclaw
   ```
   _(Replace with your fork's URL for a new instance)_

2. **Create the host .env file** at `/root/openclaw/.env`:
   ```bash
   sudo tee /root/openclaw/.env << 'EOF'
   OPENCLAW_IMAGE=openclaw:local
   OPENCLAW_GATEWAY_TOKEN=<GENERATE_A_RANDOM_TOKEN_HERE>
   OPENCLAW_CONFIG_DIR=/root/.openclaw
   OPENCLAW_WORKSPACE_DIR=/root/.openclaw/workspace
   OPENCLAW_GATEWAY_PORT=18789
   OPENCLAW_BRIDGE_PORT=18790
   OPENCLAW_GATEWAY_BIND=lan
   ANTHROPIC_API_KEY=<YOUR_ANTHROPIC_KEY>
   OPENAI_API_KEY=<YOUR_OPENAI_KEY>
   BRAVE_API_KEY=<YOUR_BRAVE_KEY>
   TELEGRAM_BOT_TOKEN=<YOUR_TELEGRAM_BOT_TOKEN>
   EOF
   ```
   
   Generate a random token:
   ```bash
   openssl rand -hex 24
   ```

3. **Create config directory:**
   ```bash
   sudo mkdir -p /root/.openclaw/workspace
   ```

4. **Create the docker-compose.yml** at `/root/openclaw/docker-compose.yml`:
   ```yaml
   services:
     openclaw-gateway:
       image: ${OPENCLAW_IMAGE:-openclaw:local}
       environment:
         HOME: /home/node
         TERM: xterm-256color
         OPENCLAW_GATEWAY_TOKEN: ${OPENCLAW_GATEWAY_TOKEN}
         CLAUDE_AI_SESSION_KEY: ${CLAUDE_AI_SESSION_KEY}
         CLAUDE_WEB_SESSION_KEY: ${CLAUDE_WEB_SESSION_KEY}
         CLAUDE_WEB_COOKIE: ${CLAUDE_WEB_COOKIE}
       volumes:
         - ${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw
         - ${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace
       ports:
         - "${OPENCLAW_GATEWAY_PORT:-18789}:18789"
         - "${OPENCLAW_BRIDGE_PORT:-18790}:18790"
       init: true
       restart: unless-stopped
       command:
         [
           "node",
           "dist/index.js",
           "gateway",
           "--bind",
           "${OPENCLAW_GATEWAY_BIND:-lan}",
           "--port",
           "18789",
         ]
   
     openclaw-cli:
       image: ${OPENCLAW_IMAGE:-openclaw:local}
       environment:
         HOME: /home/node
         TERM: xterm-256color
         OPENCLAW_GATEWAY_TOKEN: ${OPENCLAW_GATEWAY_TOKEN}
         BROWSER: echo
         CLAUDE_AI_SESSION_KEY: ${CLAUDE_AI_SESSION_KEY}
         CLAUDE_WEB_SESSION_KEY: ${CLAUDE_WEB_SESSION_KEY}
         CLAUDE_WEB_COOKIE: ${CLAUDE_WEB_COOKIE}
       volumes:
         - ${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw
         - ${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace
       stdin_open: true
       tty: true
       init: true
       entrypoint: ["node", "dist/index.js"]
   ```

5. **Build or pull the image:**
   ```bash
   sudo bash -c "cd /root/openclaw && docker compose pull"
   ```
   _(If using a local build: `sudo bash -c "cd /root/openclaw && docker compose build"`)_

6. **Start it:**
   ```bash
   sudo bash -c "cd /root/openclaw && docker compose up -d"
   ```

7. **Check it's running:**
   ```bash
   sudo docker ps
   ```
   Should show: `openclaw-openclaw-gateway-1` running on ports 18789-18790.

---

## Step 3: Configure OpenClaw (5 min)

1. **Create the gateway config** at `/root/.openclaw/openclaw.json`:
   ```bash
   sudo tee /root/.openclaw/openclaw.json << 'EOF'
   {
     "agents": {
       "defaults": {
         "workspace": "/home/node/.openclaw/workspace",
         "compaction": {
           "mode": "safeguard"
         }
       }
     },
     "commands": {
       "native": "auto",
       "nativeSkills": "auto",
       "restart": true
     },
     "channels": {
       "telegram": {
         "dmPolicy": "pairing",
         "groups": {
           "*": {
             "requireMention": false,
             "groupPolicy": "open"
           }
         },
         "groupPolicy": "open",
         "streamMode": "partial"
       }
     },
     "gateway": {
       "mode": "local",
       "controlUi": {
         "allowInsecureAuth": true
       },
       "auth": {
         "mode": "token",
         "token": "<SAME_TOKEN_FROM_ENV_FILE>"
       }
     },
     "plugins": {
       "entries": {
         "telegram": {
           "enabled": true
         }
       }
     }
   }
   EOF
   ```

2. **Restart to pick up config:**
   ```bash
   sudo bash -c "cd /root/openclaw && docker compose down && docker compose up -d"
   ```

3. **Access the Web UI:**
   Open `http://<DROPLET_IP>:18789` in browser.

---

## Step 4: Create the Workspace Files (5 min)

These files go in `/root/.openclaw/workspace/` on the host (mapped to `/home/node/.openclaw/workspace` inside the container).

### Required Files
- **AGENTS.md** — Agent behavior rules (copy from template)
- **SOUL.md** — Personality and tone
- **USER.md** — About the user/team
- **IDENTITY.md** — Name, creature type, vibe
- **TOOLS.md** — Local tool notes
- **HEARTBEAT.md** — Periodic check tasks

### API Keys File
Create `/root/.openclaw/workspace/.env`:
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_DB_URL=postgresql://xxx
BRAVE_API_KEY=xxx
OPENROUTER_API_KEY=xxx
GITHUB_TOKEN=xxx
ANTHROPIC_API_KEY=xxx
OPENAI_API_KEY=xxx
```

### App-level env
Create/edit `/root/openclaw/.env` for Docker env vars (see Step 2).
The `/app/.env` inside the container is separate — it's baked into the image or mounted.

To add keys to `/app/.env` inside the running container:
```bash
sudo docker exec openclaw-openclaw-gateway-1 sh -c 'echo "KEY=value" >> /app/.env'
```
But better: put everything in the host `.env` and docker-compose environment block.

---

## Step 5: Install Claude Code CLI (2 min)

From inside the container (or via the workspace):
```bash
sudo docker exec openclaw-openclaw-gateway-1 npm install -g @anthropic-ai/claude-code --prefix /home/node/.local
```

Verify:
```bash
sudo docker exec openclaw-openclaw-gateway-1 /home/node/.local/bin/claude --version
```

---

## Step 6: Set Up Agent Structure (5 min)

Create directory structure for your business agents:
```
agents/
├── CRM.md                    (shared CRM reference)
├── business-1/
│   ├── sales/
│   ├── engineering/
│   │   └── maps/
│   ├── marketing/
│   └── strategy/
└── business-2/
    ├── sales/
    ├── engineering/
    │   └── maps/
    ├── marketing/
    └── strategy/
```

Copy agent spec templates from the EDNA instance or create new ones.

---

## Key Architecture

```
Host (Ubuntu droplet)
├── /root/openclaw/
│   ├── docker-compose.yml      ← Docker services definition
│   └── .env                    ← Docker env vars (tokens, keys)
├── /root/.openclaw/
│   ├── openclaw.json           ← Gateway config (auth, channels, plugins)
│   ├── identity/               ← Device keys (auto-generated)
│   └── workspace/              ← Agent workspace
│       ├── .env                ← Agent API keys (GitHub, Supabase, etc.)
│       ├── AGENTS.md           ← Behavior rules
│       ├── SOUL.md             ← Personality
│       ├── USER.md             ← About the user
│       ├── IDENTITY.md         ← Agent identity
│       ├── TOOLS.md            ← Tool notes
│       ├── HEARTBEAT.md        ← Periodic tasks
│       ├── memory/             ← Daily notes + long-term memory
│       └── agents/             ← Agent specs by business/team
│
Docker containers:
├── openclaw-openclaw-gateway-1  ← Main gateway (port 18789/18790)
└── openclaw-openclaw-cli-1      ← CLI container (not always running)
```

---

## Common Commands (ALL need sudo)

```bash
# Check containers
sudo docker ps

# View logs
sudo docker logs openclaw-openclaw-gateway-1 --tail 50

# Live logs
sudo docker logs -f openclaw-openclaw-gateway-1

# Restart gateway only
sudo docker restart openclaw-openclaw-gateway-1

# Full stack restart (fixes most issues)
sudo bash -c "cd /root/openclaw && docker compose down && docker compose up -d"

# Update OpenClaw
sudo bash -c "cd /root/openclaw && docker compose pull && docker compose down && docker compose up -d"

# Shell into container
sudo docker exec -it openclaw-openclaw-gateway-1 bash

# Run CLI commands inside container
sudo docker exec -it openclaw-openclaw-gateway-1 node dist/index.js devices list --url ws://127.0.0.1:18789 --token <GATEWAY_TOKEN>
```

---

## Gotchas & Lessons Learned

1. **`openclaw` CLI is NOT installed on the host** — everything is Docker. Don't tell the user to run `openclaw gateway restart`.

2. **Sam's user can't `cd /root/`** — always use `sudo bash -c "cd /root/openclaw && ..."` pattern.

3. **Docker requires sudo** — every docker command needs `sudo`.

4. **Two .env files:**
   - `/root/openclaw/.env` — Docker Compose env vars (gateway token, image, keys passed to containers)
   - `/root/.openclaw/workspace/.env` — Agent workspace keys (GitHub, Supabase, Brave, etc.)
   - These are SEPARATE. Keys needed by the gateway go in the first. Keys needed by agents go in the second.

5. **CLAUDE_AI_SESSION_KEY / CLAUDE_WEB_SESSION_KEY / CLAUDE_WEB_COOKIE warnings** — these are optional, ignore the warnings.

6. **Sub-agent spawning may have device token mismatch bug** — known issue in Docker setups (GitHub #21445). May need newer OpenClaw version.

7. **Container names:** `openclaw-openclaw-gateway-1` and `openclaw-openclaw-cli-1` (the double "openclaw" is from the directory name + service name).

8. **Gateway binds to LAN** by default (`OPENCLAW_GATEWAY_BIND=lan`). Web UI accessible at `http://<IP>:18789`.

9. **Telegram setup:** Just need bot token in host `.env` and `telegram: { enabled: true }` in openclaw.json plugins.

10. **Config changes require restart:** After editing openclaw.json or .env, always: `sudo bash -c "cd /root/openclaw && docker compose down && docker compose up -d"`

---

## Checklist for New Instance

- [ ] Droplet created (Ubuntu, 2vCPU/4GB minimum)
- [ ] Docker installed
- [ ] Non-root user created with sudo
- [ ] OpenClaw repo cloned to `/root/openclaw`
- [ ] `/root/openclaw/.env` created with all tokens
- [ ] `/root/.openclaw/openclaw.json` created with gateway config
- [ ] Docker compose up — gateway running
- [ ] Web UI accessible at `http://<IP>:18789`
- [ ] Workspace files created (AGENTS.md, SOUL.md, USER.md, IDENTITY.md)
- [ ] Workspace `.env` created with agent API keys
- [ ] Claude Code CLI installed inside container
- [ ] Telegram bot connected (if using)
- [ ] Agent directory structure created
- [ ] Test message sent and received

# Droplet Reference

## Server
- **Provider:** Digital Ocean
- **Name:** ubuntu-s-2vcpu-4gb-120gb-intel-syd1-01
- **Region:** Sydney (syd1)
- **Specs:** 2 vCPU, 4GB RAM, 120GB disk
- **OS:** Ubuntu (needs system restart for pending updates)
- **User:** sam (requires sudo for docker)
- **Last known login IP:** 162.243.190.66

## OpenClaw Setup
- **Runs via Docker Compose** (NOT native openclaw CLI)
- `openclaw` command is NOT installed — don't tell Sam to use it
- Docker requires `sudo`
- Container name: `openclaw-openclaw-gateway-1`
- Container image: `openclaw:local`
- Ports: 18789-18790 mapped
- Config dir: `/root/.openclaw`
- Workspace dir: `/root/.openclaw/workspace`

## Docker Compose Location
- **`/root/openclaw/docker-compose.yml`**

## Key Commands (all need sudo)
```bash
# Check running containers
sudo docker ps

# Restart gateway only
sudo docker restart openclaw-openclaw-gateway-1

# Full stack restart (FIXES device token mismatch)
sudo bash -c "cd /root/openclaw && docker compose down && docker compose up -d"

# View logs
sudo docker logs openclaw-openclaw-gateway-1 --tail 50

# View logs live
sudo docker logs -f openclaw-openclaw-gateway-1
```

## Notes
- Sam can't `cd /root/openclaw` directly — need `sudo bash -c "cd ... && ..."`
- CLAUDE_AI_SESSION_KEY / CLAUDE_WEB_SESSION_KEY / CLAUDE_WEB_COOKIE warnings are harmless (optional vars)
- Two containers run: openclaw-openclaw-gateway-1 + openclaw-openclaw-cli-1

## Known Issues
- **Sub-agent spawning broken** — device token mismatch error. Known bug in Docker setups (GitHub #21445, Discord reports). Token rotation and compose restarts don't fix it. May need OpenClaw version update.
- Current version: 2026.2.20
- Sam's user needs sudo for all docker commands
- `openclaw` CLI not available on host
- To update: `sudo bash -c "cd /root/openclaw && docker compose pull && docker compose down && docker compose up -d"`

## Docker Compose Config
Two services:
- **openclaw-gateway** — the main service (gateway mode, port 18789/18790)
- **openclaw-cli** — interactive CLI container

Both share:
- Same image: `${OPENCLAW_IMAGE:-openclaw:local}`
- Same volumes: `${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw` + `${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace`
- Same env vars from `/root/openclaw/.env`: OPENCLAW_GATEWAY_TOKEN, CLAUDE_AI_SESSION_KEY, CLAUDE_WEB_SESSION_KEY, CLAUDE_WEB_COOKIE

Gateway binds to: `${OPENCLAW_GATEWAY_BIND:-lan}`
Gateway restart policy: `unless-stopped`

Env vars are loaded from `/root/openclaw/.env` (the host .env, NOT /app/.env inside container).
The `/app/.env` inside the container is a SEPARATE file at the image level.

## Sandbox (where I run)
- Host: 9bee6e2fc46b (the container)
- Workspace: /home/node/.openclaw/workspace
- Config: /home/node/.openclaw/openclaw.json
- App env: /app/.env
- Cannot run `openclaw` commands from inside sandbox
- Cannot access /root/.openclaw directly

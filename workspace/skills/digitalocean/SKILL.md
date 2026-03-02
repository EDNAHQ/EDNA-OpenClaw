---
name: digitalocean
description: "Manage DigitalOcean droplets and infrastructure. Use for server management, droplet operations, and infrastructure queries."
---

# DigitalOcean Skill

## Overview
Manage the EDNA Claw droplet and infrastructure on DigitalOcean.

## Configuration
- **API Token (PAT):** `***REDACTED***`
- **Env var:** `DO_PAT` (⚠️ env var has a stale token — use the PAT above directly)
- **Droplet name:** ubuntu-s-2vcpu-4gb-120gb-intel-syd1-01 (may have changed with rebuild)

## Current Droplet
- **Status:** Active but details need confirming with Sam
- **Region:** TBD (previously syd1)
- **Previous droplet was rebuilt** — old IP/ID no longer valid

## API Usage
DigitalOcean API v2: `https://api.digitalocean.com/v2/`

### Common Operations
```bash
# List droplets
curl -s -H "Authorization: Bearer $DO_PAT" "https://api.digitalocean.com/v2/droplets" | jq

# Get specific droplet
curl -s -H "Authorization: Bearer $DO_PAT" "https://api.digitalocean.com/v2/droplets/{id}" | jq

# Power actions
curl -s -X POST -H "Authorization: Bearer $DO_PAT" -H "Content-Type: application/json" \
  -d '{"type":"reboot"}' "https://api.digitalocean.com/v2/droplets/{id}/actions"
```

## TODO
- [ ] Confirm current droplet details (IP, ID, region, size) with Sam
- [ ] Update `DO_PAT` env var in openclaw.json with valid token
- [ ] Document SSH access details
- [ ] Document deployment/update procedures for OpenClaw on the droplet

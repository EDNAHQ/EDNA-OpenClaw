---
name: helpgenie
description: "Help Genie voice AI platform. Manage voice agents (genies), knowledge bases, conversations, leads, and marketplace templates."
---

# Help Genie Skill — Voice AI Platform

## What It Is
Help Genie is a voice AI platform built on ElevenLabs. Manages voice agents (genies), knowledge bases, conversations, leads, voices, and marketplace templates.

## Auth
- **Token:** `HELPGENIE_API_KEY` env var
- **Auth method:** Bearer token
- **Base URL:** `https://api.helpgenie.ai/v1`

## API Architecture
Single endpoint — all requests are `POST https://api.helpgenie.ai/v1` with `resource` and `action` in the body.

```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "resource": "genies",
    "action": "list"
  }'
```

## Resources & Actions

| Resource | Actions |
|----------|---------|
| `genies` | `list` `all` `get` `create` `update` `delete` `reorder` |
| `knowledge-base` | `list` `get` `create` `update` `delete` `sync-with-agents` `attach` `detach` `replace` |
| `document-folders` | `all` `list` `get` `create` `update` `delete` `reorder` `counts` |
| `genie-groups` | `list` `get` `create` `update` `delete` `reorder` `counts` `sync` |
| `conversations` | `list` `get` `sync` `analyze` `update` `delete` |
| `voices` | `favorites` `popular` `recent` `add-favorite` `remove-favorite` `track-usage` |
| `voice-collections` | `all` `get` `create` `update` `delete` |
| `leads` | `stats` `all` `list` `get` `create` `update` `delete` |
| `lead-notes` | `list` `get` `create` `update` `delete` `togglePin` `pinned` |
| `marketplace` | `list` `all` `get` `create` `update` `delete` `categories` `stats` |
| `profiles` | `all` `list` `get` `create` `update` `delete` |
| `teams` | `get` `create` `update` `delete` `members` `invite` `invitations` `cancel-invite` `remove-member` |
| `activities` | `all` `get` `create` |

## Common Operations

### List all genies
```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resource":"genies","action":"list","data":{"limit":30,"offset":0}}'
```

### Get a specific genie
```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resource":"genies","action":"get","id":"GENIE_UUID"}'
```

### List conversations
```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resource":"conversations","action":"list","data":{"limit":30,"offset":0}}'
```

### Get lead stats
```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resource":"leads","action":"stats"}'
```

### Sync conversations from ElevenLabs
```bash
curl -s -X POST https://api.helpgenie.ai/v1 \
  -H "Authorization: Bearer $HELPGENIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resource":"conversations","action":"sync","id":"GENIE_UUID"}'
```

## Response Format
All responses follow:
```json
{
  "success": true,
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "status": 404
  }
}
```

## Docs
Full API docs: https://docs.helpgenie.ai

## Future: Voice Integration with OpenClaw
Goal: Use a Help Genie voice agent as a voice frontend for EDNA Claw.
- Configure a genie with a custom ElevenLabs tool that calls OpenClaw's webhook
- Genie handles voice in/out, OpenClaw handles the brain
- Status: Planned — need to set up OpenClaw webhook endpoint first

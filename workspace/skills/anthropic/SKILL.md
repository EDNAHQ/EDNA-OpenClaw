---
name: anthropic
description: "Core LLM powering EDNA Claw. Claude API configuration, model options, and usage notes."
---

# Anthropic (Claude) Skill

## Overview
Claude is the core LLM powering EDNA Claw. All reasoning, conversation, and decision-making runs through Anthropic's API.

## Configuration
- **Env var:** `ANTHROPIC_API_KEY`
- **Current model:** `claude-opus-4-6` (set in OpenClaw config)
- **Thinking:** Available, currently set to low

## Usage
This is the brain — no manual invocation needed. OpenClaw handles all API calls automatically.

## Model Options
- `claude-opus-4-6` — most capable, higher cost
- `claude-sonnet-4-20250514` — fast and capable, lower cost
- Model can be changed per-session via `/model` or in config

## Notes
- API key is set in `openclaw.json` or environment variables on the droplet
- Monitor usage via `session_status` tool

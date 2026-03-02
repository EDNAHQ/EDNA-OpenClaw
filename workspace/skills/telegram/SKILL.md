---
name: telegram
description: "Telegram messaging channel for EDNA Claw. Configuration, access control, and usage notes for Telegram bot integration."
---

# Telegram Skill

## Overview
Telegram messaging channel for EDNA Claw. Used for direct communication with Sam.

## Configuration
- **Allowed user ID:** 8747238183 (Sam)
- **Group policy:** Open (no mention required)
- **Config:** Set in `openclaw.json` under `telegram` section
- **Bot token:** Stored in OpenClaw config (env var `TELEGRAM_BOT_TOKEN`)

## Usage
Messages from Telegram arrive in the same session as other channels. Reply normally — OpenClaw routes to the correct channel automatically.

## Notes
- Currently only Sam has access
- Group chats are open (no @mention needed to trigger)

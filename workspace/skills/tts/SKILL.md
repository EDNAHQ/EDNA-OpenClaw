---
name: tts
description: "Convert text to speech audio. Use for voice messages, storytelling, and audio content delivery."
---

# Text-to-Speech (TTS) Skill

## Overview
Convert text to speech audio. Used for voice messages, storytelling, and audio content.

## Configuration
- **Tool:** `tts` (built into OpenClaw)
- No additional API key needed — uses OpenClaw's built-in TTS

## Usage
```
tts(text="Hello, this is EDNA Claw speaking.")
```

### Parameters
- `text` — the text to convert to speech
- `channel` — optional, channel id to pick output format

## Notes
- Audio is delivered automatically from the tool result
- After a successful TTS call, reply with `NO_REPLY` to avoid duplicate messages
- Good for: summaries, stories, announcements, accessibility

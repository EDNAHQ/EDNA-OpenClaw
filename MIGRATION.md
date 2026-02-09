# Workspace Migration

## Date
2026-02-09

## Source
OpenClaw runtime at `/root/.openclaw/` (Linux VM)

## What was migrated

### workspace/ (from workspace-export.tar.gz)
- **Identity files:** SOUL.md, IDENTITY.md, USER.md, TOOLS.md, HEARTBEAT.md, MEMORY.md, PRIORITIES.md, AGENTS.md
- **16 custom skills:** ai-pulse, article-writer, builders-post, content-ideas, email-writer, idea-capture, linkedin-image, meeting-notes, morning-briefing, replicate, smart-prioritization, social-post, strategy-session, video-script, voice-memo-inbox, weekly-review
- **Memory logs:** 13 files in memory/ (2026-02-02 through 2026-02-05, plus ideas.md, sam-brand.md)
- **VoiceDNA:** PIPELINE.md, CLIENTS.md, CONTENT-QUEUE.md, website-copy.md
- **Content Lead:** IDEAS.md, README.md, ROADMAP.md + 5 strategy docs at workspace root
- **Assets:** logo.png, edna-logo.jpg, edna-icon.png, custom-brand.js, custom-theme.css, THEME-README.md
- **Other:** VoiceDNA-Marketing-Document.txt, hyrox-races-2026.md

### .openclaw/ (from openclaw-config.tar.gz)
- openclaw.json (main config)
- agents/ (main, content-lead, help-genie, edna)
- workspaces/ (content-lead, help-genie, edna)
- credentials/, identity/, browser/, canvas/, cron/, devices/, logs/, media/, memory/, telegram/

## Path changes
All `/root/.openclaw/` references in openclaw.json updated to `c:/Users/GGPC/CascadeProjects/EDNA-OpenClaw/.openclaw/` or `c:/Users/GGPC/CascadeProjects/EDNA-OpenClaw/workspace/`.

Skill file paths (morning-briefing/SKILL.md) changed from absolute `/root/.openclaw/workspace/` to relative `workspace/`.

Memory log files left unchanged (contain historical references only).

## Secrets handling
- `.openclaw/` added to .gitignore (contains credentials, API keys, bot tokens)
- `workspace/` added to .gitignore (contains personal identity data)
- `*.tar.gz` added to .gitignore

## Files intentionally excluded
- None. Full export of both `/root/.openclaw/workspace` and `/root/.openclaw` (minus workspace) was imported.

## Future syncs
To re-sync from the remote runtime:
1. On remote: `tar -czf workspace-export.tar.gz -C /root/.openclaw workspace`
2. Copy to repo root
3. Extract with `tar -xzf workspace-export.tar.gz`
4. Delete tarball

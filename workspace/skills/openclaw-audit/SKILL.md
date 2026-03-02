---
name: openclaw-audit
description: "Audit and review the entire OpenClaw instance setup for best practices, completeness, and health. Use when: checking setup quality, reviewing configuration, doing a health check of the OpenClaw instance, verifying best practices across workspace files, openclaw.json, skills, agents, sub-agents, cron jobs, channels, memory, and environment. Also use for periodic self-audits or when asked how is our setup, audit our config, best practice check."
---

# OpenClaw Audit

Run a comprehensive audit of the OpenClaw instance. Read `references/checklist.md` for the full checklist, then execute each section systematically.

## How to Run

1. Read `references/checklist.md`
2. Work through each section, reading the relevant files and configs
3. Score each section: ✅ Good | ⚠️ Needs attention | ❌ Missing/broken
4. Output a summary report with findings and recommendations
5. Optionally save the report to `memory/audit-YYYY-MM-DD.md`

## Output Format

Use a clear summary table followed by details on any ⚠️ or ❌ items. Keep it actionable — say what to fix, not just what's wrong.

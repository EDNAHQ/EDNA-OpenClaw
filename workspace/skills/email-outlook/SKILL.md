---
name: email-outlook
description: "Outlook/M365 email integration for Enterprise DNA team. Draft customer support emails. Status: not yet connected."
---

# Email / Outlook Skill

## Overview
Email drafting and management for Enterprise DNA team, primarily for customer support communications.

## Status: 🔜 Not Yet Connected

## What We Need
- [ ] Determine approach — Microsoft Graph API vs IMAP/SMTP vs himalaya CLI
- [ ] Outlook/M365 credentials or app registration
- [ ] Define permissions scope (read, draft, send?)
- [ ] Set up credentials in openclaw.json

## Planned Use Cases
- **Draft support emails** (Anilyn) — draft customer responses for review, DO NOT send automatically
- **Email lookups** — check inbox for urgent messages
- **Template responses** — standard replies for common customer queries

## Team Access
- **Anilyn** — primary user for customer email drafts
- **Angie** — oversight

## Safety Rules
- ⚠️ **DRAFT ONLY** — never send emails automatically without human review
- All drafts should be clearly marked as drafts pending approval

## Notes
- OpenClaw has a `himalaya` skill for CLI-based email — could be an option
- Microsoft Graph API is more robust for M365/Outlook integration

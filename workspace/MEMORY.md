# MEMORY.md — Long-Term Memory

## Key Facts
- **Enterprise DNA** — online training platform for data skills + AI (enterprisedna.co)
- **ContentLead** (contentlead.ai) — Sam's other business, AI-powered marketing tool
- **Droplet:** 209.38.29.185 (DigitalOcean Sydney), Docker-based OpenClaw deployment
- **Repo:** EDNAHQ/EDNA-OpenClaw on GitHub, auto-deploys on push

## Team
- **Sam** — CEO, NZ (NZDT/UTC+13), set up this instance 2026-02-24
- **Angie** — Operations Lead, Philippines (GMT+8), handles billing/Stripe/Xero/hiring/onboarding
- **Anilyn** — Customer Support, Philippines (GMT+8), front-line support, Laravel Admin, Xero invoicing

## Infrastructure
- CRM in Supabase with 8,824 Stripe customers synced (2026-02-28)
- Drip email marketing: Enterprise DNA (account 1621557, ~50k subscribers) + ContentLead (account 7910490)
- Stripe: live key, full access, NZD primary / USD secondary
- Gmail connected (sam.mckay@ednahq.com), Outlook pending

## Lessons
- **Always validate openclaw.json** before AND after editing — bad edit cost Sam 40 minutes
- **Always verify which server** before making changes — mixed up Help Genie and EDNA droplets once
- **Sub-agents can't reliably run long scripts** — better to run scripts directly in background
- **Sam wants full files** when he asks to see them — don't summarize, don't add commentary
- **Docker restart command:** `docker restart openclaw-openclaw-gateway-1` or `cd /root/openclaw && docker compose down && docker compose up -d`

## Strategic Direction
- Building toward replacing Drip with cheaper email sending (SES/Resend) + Supabase leads table + me handling automation logic
- Goal: maximize agentic automation for the team
- Building incrementally — don't try to do everything at once

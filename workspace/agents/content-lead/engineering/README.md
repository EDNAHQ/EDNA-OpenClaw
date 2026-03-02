# Content Lead — Engineering Agent Team

## Business Context
Content Lead (contentlead.ai) — AI-powered content creation and multi-platform social media management. Built for marketers, agencies, and content teams. Freemium model.

## Repos Owned
| Repo | Purpose |
|------|---------|
| EDNAHQ/Content-Lead | Main Content Lead app — content creation, scheduling, publishing |
| EDNAHQ/Help-Genie-Voice | AI customer support SaaS (voice agents, analytics, knowledge base) |

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| CL Code Reviewer | cl-code-reviewer.md | PR reviews, code quality | Sonnet 4.6 |
| CL Feature Builder | cl-feature-builder.md | Build features via Claude Code | Sonnet 4.6 / Opus 4.6 |
| CL QA & Testing | cl-qa-tester.md | Tests, coverage, verification | Sonnet 4.6 |
| CL Performance | cl-performance.md | DB queries, bundle, rendering | Sonnet 4.6 |
| CL Security Auditor | cl-security-auditor.md | RLS, secrets, auth, deps | Sonnet 4.6 |
| CL Tech Debt Tracker | cl-tech-debt.md | TODOs, deps, code health | MiniMax M2.5 |
| CL Repo Scout | cl-repo-scout.md | Codebase exploration, architecture maps | Qwen 3.5 Plus |

## How to Run

```
sessions_spawn: "Read agents/content-lead/engineering/cl-{agent}.md. [Task description]. Only work on Content Lead repos."
```

## Key Tech Details
- **Content-Lead:** Vercel AI SDK, Stripe, Konva (image editor), Zustand, Uppy (uploads), MCP server
- **Help-Genie-Voice:** ElevenLabs, Stripe, Twilio, OpenAI Agents SDK, Pusher (realtime), TipTap (rich text)
- Both apps: React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase

## Supabase
- Content Lead has its own Supabase project (check repo's `supabase/` dir)
- Help-Genie-Voice has its own Supabase project
- CRM data uses `business = 'content_lead'` filter

## Rules
- These agents ONLY touch Content Lead repos — never Enterprise DNA
- All branches, never push to main
- Sam approves all PRs
- Log work to `memory/YYYY-MM-DD.md`

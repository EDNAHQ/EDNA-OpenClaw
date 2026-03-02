# Enterprise DNA — Engineering Agent Team

## Business Context
Enterprise DNA (enterprisedna.co) — online training platform for data skills + AI. Products include courses, learning paths, assessments, community forum, and AI tools (Mentor, Code Runner, Report Builder, Capture).

## Repos Owned
| Repo | Purpose |
|------|---------|
| EDNAHQ/EDNA-HQ-Main | Main Enterprise DNA website/platform |
| EDNAHQ/Builder-Community | Developer/AI social community platform |
| EDNAHQ/LearnFlow | AI learning companion — personalized paths |
| EDNAHQ/Power-Vibes | Power BI analytics tool |
| EDNAHQ/docs | Mintlify documentation |
| EDNAHQ/EDNA-OpenClaw | OpenClaw fork (this instance) |
| EDNAHQ/Command-Center | TBD |
| EnterpriseDNA/analysthub2.0 | Power BI BIM analyzer (Python desktop) |
| Omni-Intelligence/model-bim | Power BI BIM analyzer (Python desktop) |
| Omni-Intelligence/extract-metadata | PBIX metadata extractor (Python, Windows) |
| Omni-Intelligence/Echo-Assist | Desktop AI voice assistant |
| Omni-Intelligence/echo-assistant | Desktop voice assistant (simpler) |
| Omni-Intelligence/simple-assistant | Basic voice assistant |
| Omni-Intelligence/excel-helper | Excel formula assistant |
| Omni-Intelligence/App-Idea-Engine | App idea generation tool |

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| EDNA Code Reviewer | edna-code-reviewer.md | PR reviews, code quality | Sonnet 4.6 |
| EDNA Feature Builder | edna-feature-builder.md | Build features via Claude Code | Sonnet 4.6 / Opus 4.6 |
| EDNA QA & Testing | edna-qa-tester.md | Tests, coverage, verification | Sonnet 4.6 |
| EDNA Performance | edna-performance.md | DB queries, bundle, rendering | Sonnet 4.6 |
| EDNA Security Auditor | edna-security-auditor.md | RLS, secrets, auth, deps | Sonnet 4.6 |
| EDNA Tech Debt Tracker | edna-tech-debt.md | TODOs, deps, code health | MiniMax M2.5 |
| EDNA Repo Scout | edna-repo-scout.md | Codebase exploration, architecture maps | Qwen 3.5 Plus |

## How to Run

```
sessions_spawn: "Read agents/enterprise-dna/engineering/edna-{agent}.md. [Task description]. Only work on Enterprise DNA repos."
```

## Supabase
- Enterprise DNA apps likely have their own Supabase project(s)
- Filter by `business = 'enterprise_dna'` where applicable
- Check each repo's `supabase/` directory for schema

## Rules
- These agents ONLY touch Enterprise DNA repos — never Content Lead
- All branches, never push to main
- Sam approves all PRs
- Log work to `memory/YYYY-MM-DD.md`

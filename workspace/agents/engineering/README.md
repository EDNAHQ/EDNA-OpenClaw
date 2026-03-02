# Engineering Agent Team

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| Code Reviewer | code-reviewer.md | PR reviews, code quality, catch bugs | Sonnet 4.6 (needs precision) |
| Feature Builder | feature-builder.md | Build features, fix bugs via Claude Code | Sonnet 4.6 / Opus 4.6 (complex) |
| QA & Testing | qa-tester.md | Write tests, verify deployments, find regressions | Sonnet 4.6 |
| Performance | performance.md | Query optimization, latency, bundle size | Sonnet 4.6 |
| Security Auditor | security-auditor.md | RLS policies, secrets scanning, auth review | Sonnet 4.6 |
| Tech Debt Tracker | tech-debt.md | TODOs, dep health, upgrade tracking | MiniMax M2.5 (routine) |
| Repo Scout | repo-scout.md | Codebase exploration, documentation, onboarding | Qwen 3.5 Plus (big context, cheap) |

## Architecture

```
EDNA Claw (orchestrator)
│
├── Engineering Lead (coordinated by EDNA Claw directly)
│   ├── Code Reviewer — PR reviews, quality gate
│   ├── Feature Builder — builds features via Claude Code
│   ├── QA & Testing — tests, deployment verification
│   ├── Performance — latency, queries, bundle optimization
│   ├── Security Auditor — RLS, secrets, auth
│   ├── Tech Debt Tracker — TODOs, deps, upgrades
│   └── Repo Scout — codebase exploration, docs
```

## How to Run

All agents are spawned as sub-agents from EDNA Claw main session.

### Review code
```
sessions_spawn: "Read agents/engineering/code-reviewer.md. Review the latest PR on EDNAHQ/Content-Lead."
```

### Build a feature
```
sessions_spawn: "Read agents/engineering/feature-builder.md. In EDNAHQ/Content-Lead, add [feature description]."
```

### Run tests / QA
```
sessions_spawn: "Read agents/engineering/qa-tester.md. Check EDNAHQ/Help-Genie-Voice for test coverage gaps."
```

### Security audit
```
sessions_spawn: "Read agents/engineering/security-auditor.md. Audit RLS policies on EDNAHQ/Content-Lead supabase."
```

### Explore a repo
```
sessions_spawn: "Read agents/engineering/repo-scout.md. Map the full architecture of EDNAHQ/Help-Genie-Voice and write a summary."
```

## Shared Context

All engineering agents have access to:
- `INFRASTRUCTURE.md` — full repo/tech/hosting map
- `MODELS.md` — model reference for cost/quality decisions
- `.env` — API keys (GitHub, Supabase, Anthropic, OpenAI)
- Claude Code CLI at `/home/node/.local/bin/claude`

## Git Access

All agents use the GitHub token for reads. For writes (commits/pushes):
```bash
export GH="$(cat .env | grep GITHUB_TOKEN | cut -d= -f2)"
git clone https://$GH@github.com/EDNAHQ/repo-name.git
```

## Rules

- **Never push directly to main** — always create feature branches
- **All PRs need Sam's approval** before merge
- Log all work to `memory/YYYY-MM-DD.md`
- Read INFRASTRUCTURE.md before touching any repo
- When in doubt about scope, ask — don't assume

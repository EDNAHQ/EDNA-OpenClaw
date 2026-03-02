# OpenClaw Audit Checklist

Work through each section. For each item, check the relevant file/config and score it.

---

## 1. Core Workspace Files

| File | Check |
|------|-------|
| `SOUL.md` | Exists, has personality/tone defined, not default boilerplate |
| `USER.md` | Exists, has team members with roles/timezones, up to date |
| `IDENTITY.md` | Exists, name/emoji/avatar defined |
| `AGENTS.md` | Exists, has meaningful customizations beyond defaults |
| `TOOLS.md` | Exists, lists all active capabilities, statuses current |
| `MEMORY.md` | Exists, has curated long-term entries (not empty/stale) |
| `HEARTBEAT.md` | Exists, has active tasks OR explicitly says nothing pending |
| `BOOTSTRAP.md` | Should NOT exist (should be deleted after first run) |

## 2. openclaw.json Configuration

Read `~/.openclaw/openclaw.json` and check:

| Area | Check |
|------|-------|
| **Env vars** | All referenced API keys present and non-empty |
| **Duplicate keys** | No env vars duplicated at both `env.vars.X` and `env.X` level |
| **Agent defaults** | `workspace`, `compaction`, `subagents` configured |
| **Sub-agent model** | Explicitly set (not defaulting to expensive main model) |
| **Sub-agent limits** | `maxConcurrent`, `maxSpawnDepth`, `runTimeoutSeconds` set to reasonable values |
| **Channels** | Each enabled channel has required tokens/config |
| **Gateway auth** | Auth mode set, not using dangerous defaults in production |
| **Trusted proxies** | Configured appropriately for deployment |
| **Plugins** | Match enabled channels |

## 3. Skills Inventory

List all skills in `~/.openclaw/workspace/skills/`. For each:

| Check | Detail |
|-------|--------|
| Has `SKILL.md` | Every skill folder must have one |
| Frontmatter valid | `name` and `description` present |
| Referenced in TOOLS.md | Skill should be listed in TOOLS.md for discoverability |
| Status accurate | TOOLS.md status matches reality (active vs planned) |

Flag any TOOLS.md entries marked "Active" that have no corresponding skill folder, and vice versa.

## 4. Memory Health

| Check | Detail |
|-------|--------|
| `memory/` directory exists | Should have daily files |
| Recent daily files | Files for last 7 days (or at least recent activity) |
| `MEMORY.md` freshness | Last updated within past week |
| No secrets in memory | Scan for API keys, passwords, tokens in memory files |
| `heartbeat-state.json` | Exists if heartbeats are active |

## 5. Channels & Integrations

For each configured channel in openclaw.json:

| Check | Detail |
|-------|--------|
| Token present | Bot token / app token not empty |
| Policy set | `dmPolicy`, `groupPolicy` configured |
| `allowFrom` | Not wildcard `*` unless intentional (security) |
| Streaming | Configured if supported |

Cross-check: Are any channels configured in openclaw.json but missing from TOOLS.md?

## 6. Cron Jobs & Scheduled Tasks

Run `openclaw cron list` (or check config) and verify:

| Check | Detail |
|-------|--------|
| Cron jobs listed | Any active scheduled tasks |
| Model routing | Cron jobs using cheap models (not Opus) |
| No orphaned jobs | All cron jobs still relevant |
| Heartbeat interval | Configured and reasonable (15-60 min) |

## 7. Sub-Agent Configuration

| Check | Detail |
|-------|--------|
| Default model set | Should be a cost-effective model, not the main model |
| `maxConcurrent` | Set and reasonable (4-10) |
| `runTimeoutSeconds` | Set (recommend 600-900) |
| `allowAgents` | Configured per agent |
| Model routing table | Documented in AGENTS.md or a reference file |

## 8. Security & Hygiene

| Check | Detail |
|-------|--------|
| Gateway auth | Not using default/weak passwords |
| API keys | Not committed to git / not in plain text memory files |
| `controlUi.allowInsecureAuth` | Should be `false` in production |
| `dangerouslyAllowHostHeaderOriginFallback` | Should be `false` in production |
| File permissions | Workspace not world-readable |

## 9. Documentation & Onboarding

| Check | Detail |
|-------|--------|
| New team member can onboard | USER.md has enough context |
| TOOLS.md is current | All active tools listed with correct status |
| Skill descriptions | Clear enough for auto-triggering |
| AGENTS.md lessons learned | Being maintained and updated |

## 10. Cost & Performance

| Check | Detail |
|-------|--------|
| Model routing documented | Cheap models for cheap tasks |
| Sub-agents not using Opus | Verify default sub-agent model |
| Cron jobs using cheap models | Not burning frontier tokens on checks |
| Compaction mode | Set appropriately (`safeguard` recommended) |

---

## Scoring

After completing all sections, produce a summary:

```
## Audit Summary — YYYY-MM-DD

| Section | Score | Notes |
|---------|-------|-------|
| Core Files | ✅/⚠️/❌ | ... |
| openclaw.json | ✅/⚠️/❌ | ... |
| Skills | ✅/⚠️/❌ | ... |
| Memory | ✅/⚠️/❌ | ... |
| Channels | ✅/⚠️/❌ | ... |
| Cron Jobs | ✅/⚠️/❌ | ... |
| Sub-Agents | ✅/⚠️/❌ | ... |
| Security | ✅/⚠️/❌ | ... |
| Documentation | ✅/⚠️/❌ | ... |
| Cost & Perf | ✅/⚠️/❌ | ... |

**Overall: X/10 sections healthy**
```

Follow with actionable recommendations prioritized by impact.

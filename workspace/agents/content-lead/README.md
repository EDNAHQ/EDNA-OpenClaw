# Content Lead Sales Team

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| CL Prospector | cl-prospector.md | Find potential customers | Sonnet (web search heavy) |
| CL Researcher | cl-researcher.md | Deep dive on prospects, find contacts | Sonnet (analysis heavy) |
| CL Outreach Writer | cl-outreach-writer.md | Write personalised outreach drafts | Sonnet (creative writing) |
| CL Pipeline Tracker | cl-pipeline-tracker.md | Track pipeline, daily briefs, alerts | Haiku (routine queries) |

## Workflow

```
Prospector → finds companies → writes to CRM
    ↓
Researcher → enriches company data + finds contacts → updates CRM
    ↓
Outreach Writer → drafts personalised messages → stores in CRM as interactions
    ↓
Sam reviews + approves outreach
    ↓
Pipeline Tracker → monitors everything, daily briefs, flags stale leads
```

## How to Run

From EDNA Claw main session, spawn agents as sub-agents:

### Find new prospects
```
sessions_spawn: "Read agents/content-lead/cl-prospector.md. Find 10 new prospects for Content Lead. Use Brave search. Return results as JSON."
```

### Research a prospect
```
sessions_spawn: "Read agents/content-lead/cl-researcher.md. Research [COMPANY] from the CRM. Enrich their record and find contacts."
```

### Draft outreach
```
sessions_spawn: "Read agents/content-lead/cl-outreach-writer.md. Write outreach for [CONTACT] at [COMPANY] using their research data from the CRM."
```

### Daily brief
```
sessions_spawn: "Read agents/content-lead/cl-pipeline-tracker.md. Query the CRM and produce today's Content Lead pipeline brief."
```

## CRM Access

All agents use the same Supabase instance:
- REST API for reads/writes (service role key)
- All queries filter by `business = 'content_lead'`
- Credentials in workspace `.env`

## Rules

- **No outreach is sent without Sam's approval**
- Agents don't cross over to Enterprise DNA data
- All activity is logged in the `interactions` table
- Agents write to memory files when they complete runs

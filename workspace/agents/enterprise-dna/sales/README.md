# Enterprise DNA — Sales Agent Team

## Business Context
Enterprise DNA's revenue isn't just individual course sales — there are B2B opportunities:
- **Corporate L&D:** Companies buying bulk access for their data teams
- **Partnerships:** Training providers, consultancies, data agencies
- **Enterprise plans:** Large organizations needing custom training paths
- **Licensing:** Syndicate content to other platforms

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| EDNA Prospector | edna-prospector.md | Find companies that need data training | Sonnet 4.6 |
| EDNA Researcher | edna-researcher.md | Deep dive on prospects, find L&D contacts | Sonnet 4.6 |
| EDNA Outreach Writer | edna-outreach-writer.md | Write B2B outreach for training partnerships | Sonnet 4.6 |
| EDNA Pipeline Tracker | edna-pipeline-tracker.md | Track B2B deals, daily briefs | MiniMax M2.5 |

## Workflow

```
EDNA Prospector → finds companies needing data training → writes to CRM
    ↓
EDNA Researcher → enriches data + finds L&D/training contacts → updates CRM
    ↓
EDNA Outreach Writer → drafts B2B outreach → stores in CRM
    ↓
Sam reviews + approves outreach
    ↓
EDNA Pipeline Tracker → monitors deals, daily briefs, flags stale leads
```

## CRM
**Read `agents/CRM.md` for full reference.**
- All records: `business = 'enterprise_dna'`
- Never cross into Content Lead data

## Rules
- **No outreach sent without Sam's approval**
- Focus on English-speaking markets initially
- Corporate training deals are high-value, long-cycle — patience and quality over volume

# Enterprise DNA — Marketing Agent Team

## Business Context
Enterprise DNA (enterprisedna.co) — online training platform for data skills + AI. Products: courses, learning paths, assessments, community forum, AI tools (Mentor, Code Runner, Report Builder, Capture). Established brand with existing audience.

**Target market:** Data professionals, Power BI users, business analysts, aspiring data analysts, corporate L&D teams.

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| EDNA Content Writer | edna-content-writer.md | Blog, tutorials, course marketing copy | Sonnet 4.6 |
| EDNA Social | edna-social.md | Social strategy, posts, community engagement | Sonnet 4.6 |
| EDNA SEO | edna-seo.md | Keyword research, organic optimization | Qwen 3.5 Plus |
| EDNA Email | edna-email.md | Newsletters, course launches, nurture sequences | Sonnet 4.6 |
| EDNA YouTube | edna-youtube.md | Video strategy, scripts, thumbnails, SEO | Sonnet 4.6 |
| EDNA Community | edna-community.md | Forum engagement, member retention, ambassador program | MiniMax M2.5 |
| EDNA Analytics | edna-analytics.md | Performance tracking, attribution, reporting | MiniMax M2.5 |

## Architecture

```
EDNA Claw (orchestrator)
│
├── EDNA Marketing Lead (coordinated by EDNA Claw)
│   ├── EDNA Content Writer — blog, tutorials, marketing copy
│   ├── EDNA Social — LinkedIn, Twitter, community
│   ├── EDNA SEO — organic search growth
│   ├── EDNA Email — newsletters, launches, nurture
│   ├── EDNA YouTube — video content strategy
│   ├── EDNA Community — forum, retention, ambassadors
│   └── EDNA Analytics — performance tracking
```

## How to Run

```
sessions_spawn: "Read agents/enterprise-dna/marketing/edna-{agent}.md. [Task description]."
```

## Key Assets
- Website: enterprisedna.co
- YouTube channel (existing, established)
- Community forum (Builder Community)
- Existing course catalog
- Sam's personal brand in data/AI space

## Rules
- All external-facing content needs Sam's approval before publishing
- Brand voice: Educational, authoritative, approachable — expert friend, not lecturer
- Content should always drive toward courses, community, or AI tools
- Leverage Sam's expertise and brand as a key differentiator

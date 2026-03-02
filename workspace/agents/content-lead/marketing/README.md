# Content Lead — Marketing Agent Team

## Business Context
Content Lead (contentlead.ai) — AI-powered content creation and multi-platform social media management. Freemium model. Competing with Buffer, Hootsuite, Later, Sprout Social. Key differentiator: cheaper, AI-native.

**Target market:** Marketers, agencies, solopreneurs, SMBs doing content at any scale.

## Agents

| Agent | File | Role | Suggested Model |
|-------|------|------|-----------------|
| CL Content Writer | cl-content-writer.md | Blog posts, case studies, landing page copy | Sonnet 4.6 |
| CL Social | cl-social.md | Social media strategy, posts, engagement | Sonnet 4.6 |
| CL SEO | cl-seo.md | Keyword research, on-page optimization, backlinks | Qwen 3.5 Plus |
| CL Email | cl-email.md | Email sequences, newsletters, nurture campaigns | Sonnet 4.6 |
| CL Competitor Watch | cl-competitor-watch.md | Track Buffer/Hootsuite/Later/Sprout Social moves | Qwen 3.5 Plus |
| CL Analytics | cl-analytics.md | Performance tracking, reporting, attribution | MiniMax M2.5 |
| CL Distribution | cl-distribution.md | Listings, directories, syndication, PR | Qwen 3.5 Plus |

## Architecture

```
EDNA Claw (orchestrator)
│
├── CL Marketing Lead (coordinated by EDNA Claw)
│   ├── CL Content Writer — blog, case studies, copy
│   ├── CL Social — social strategy + posts
│   ├── CL SEO — organic search optimization
│   ├── CL Email — sequences, newsletters
│   ├── CL Competitor Watch — competitive intelligence
│   ├── CL Analytics — performance tracking
│   └── CL Distribution — listings, directories, syndication
```

## How to Run

```
sessions_spawn: "Read agents/content-lead/marketing/cl-{agent}.md. [Task description]."
```

## Key Assets
- Website: contentlead.ai
- Product: AI content creation + multi-platform social scheduling
- Pricing: Freemium (free to start, pay for seats/AI credits)
- Key competitors: Buffer, Hootsuite, Later, Sprout Social
- Differentiator: AI-native, cheaper, content creation (not just scheduling)

## Rules
- All external-facing content needs Sam's approval before publishing
- Brand voice: Modern, sharp, no-BS, practical
- Focus on English-speaking markets (US, UK, AU, NZ, CA)
- Always lead with value/pain points, not features

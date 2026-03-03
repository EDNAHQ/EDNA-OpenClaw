---
name: morning-intel
description: "Daily morning intelligence brief. Searches multiple sources for OpenClaw news, strategies, business opportunities, and community insights. Synthesizes into a single briefing."
---

# Morning Intel Brief — Skill

## Purpose
Produce a daily intelligence briefing on OpenClaw — what people are doing, building, and selling with it. Delivered to Slack each morning.

## Topics
- OpenClaw news, updates, releases
- Business opportunities — services people are offering, agencies, monetisation
- Creative workflows — automations, integrations, novel setups
- Tips, tricks, tutorials, best practices
- Community pulse — discussions, feature requests, pain points

## Sources & Methods

### 1. Web Search (Brave)
Run 5 targeted searches using the `web_search` tool:
- `"openclaw" latest updates features` (freshness: last 48h)
- `"openclaw" business agency services` (freshness: last week)
- `"openclaw" workflow automation integration` (freshness: last week)
- `"openclaw" tips tricks tutorial` (freshness: last week)
- `"openclaw" site:reddit.com OR site:news.ycombinator.com` (freshness: last week)

### 2. YouTube Transcripts
Search YouTube for recent OpenClaw videos:
- `web_search` for `"openclaw" site:youtube.com` (freshness: last week)
- For any new videos found, pull transcripts using the `youtube-transcript` skill
- Extract key insights from transcripts (don't include full transcript — just the interesting bits)

### 3. Reddit Deep Dive
For any Reddit threads found in web search:
- Use `web_fetch` to pull the thread content
- Extract top comments and key discussion points

## Output Format
Format for Slack (mrkdwn, not markdown):
- Bold: `*bold*` (not `**bold**`)
- Italic: `_italic_` (not `*italic*`)
- No `#` headers — use *bold text* on its own line
- Links: `<url|text>`
- No markdown tables — use bullet lists

Structure:

```
*🔍 OpenClaw Daily Intel Brief*
_[date]_

*Key Developments*
[Anything new from the OpenClaw team, releases, major community news]

*Business Opportunities*
[How people are making money, services offered, market gaps]

*Clever Workflows*
[Interesting automations, setups, integrations people are building]

*Tips & Tricks*
[Useful discoveries, configurations, best practices]

*Community Pulse*
[What people are talking about, requesting, struggling with]

*Notable Videos*
[Any new YouTube content with key takeaways from transcripts]

---
_Sources: [count] web results, [count] videos, [count] threads analysed_
```

## Error Handling & Resilience
- If a web search fails, retry once. If it fails again, skip that source and note it in the output.
- If YouTube transcript fetch fails, include the video title/URL anyway with a note that transcript was unavailable.
- If web_fetch fails on a Reddit thread, skip it and move on — don't block the whole report.
- Never fail silently. If something went wrong, include a brief _"⚠️ [source] was unavailable"_ note at the bottom.
- The goal is: always deliver something useful, even if some sources are down.

## Guidelines
- Aim for a 2-minute read — concise, not exhaustive
- Include source URLs for everything
- Skip anything stale or uninteresting — quality over quantity
- If a section has nothing new, say "Nothing notable today" — don't pad
- Prioritise actionable insights over generic news
- Compare findings to what Enterprise DNA is already doing — note opportunities

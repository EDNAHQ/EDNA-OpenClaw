---
name: web-search
description: "Web search via Brave Search API. Use for research, fact-checking, and finding current information. Supports region and language filtering."
---

# Brave Search Skill

## What It Is
Web search via Brave Search API. Returns titles, URLs, and snippets. Used for quick research, fact-checking, finding current information.

## Auth
- **Token:** `BRAVE_API_KEY` env var
- **Access:** Via built-in `web_search` tool (no manual API calls needed)

## Usage

This skill is accessed through the native `web_search` tool — no curl required.

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query (required) |
| `count` | number | Results to return, 1-10 (default 5) |
| `country` | string | 2-letter country code for regional results, e.g. `NZ`, `US`, `ALL` |
| `search_lang` | string | 2-letter language code, e.g. `en`, `de` |
| `freshness` | string | Filter by time: `pd` (past day), `pw` (past week), `pm` (past month), `py` (past year), or `YYYY-MM-DDtoYYYY-MM-DD` |

### Examples

**General search:**
- query: "best project management tools 2026"

**Regional search (NZ-specific):**
- query: "enterprise data training", country: "NZ"

**Recent results only:**
- query: "OpenAI announcements", freshness: "pw"

**Date range:**
- query: "AI industry news", freshness: "2026-02-01to2026-02-28"

## When to Use
- Quick fact lookups
- Current events and news
- Finding documentation or API references
- Price comparisons or product research
- Verifying claims or checking info freshness

## When NOT to Use
- Deep page content extraction → use `web_fetch` instead
- Interactive web pages / JS-rendered sites → use `browserbase`
- Internal/private data → search won't find it

## Tips
- Use `count: 3` for quick lookups, `count: 10` for research
- Combine with `web_fetch` to get full page content after finding the right URL
- Use `freshness: "pd"` or `"pw"` when you need current information
- Set `country: "NZ"` for Sam's local context when relevant

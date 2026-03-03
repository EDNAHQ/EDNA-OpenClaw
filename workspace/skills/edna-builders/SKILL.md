# EDNA Builders Skill

Community platform for Enterprise DNA subscribers. Browser-based automation via BrowserBase.

## Platform Overview

EDNA Builders (builders.enterprisedna.co) is a premium community for AI builders — post articles, engage with members, manage users.

## Authentication

- URL: `https://builders.enterprisedna.co`
- Email: `sam.mckay@enterprisedna.co.nz`
- Password: `Pompallier2332`
- Login: Fill email + password on the landing page, press Enter

### Login Action Sequence
```json
[
  { "action": "goto", "url": "https://builders.enterprisedna.co", "timeout": 30000 },
  { "action": "wait", "ms": 3000 },
  { "action": "fill", "selector": "input[type='email']", "value": "sam.mckay@enterprisedna.co.nz" },
  { "action": "fill", "selector": "input[type='password']", "value": "Pompallier2332" },
  { "action": "keyboard", "key": "Enter" },
  { "action": "wait", "ms": 5000 }
]
```

### Welcome Modal Dismissal
After first login, a welcome modal appears. Dismiss with:
```json
{ "action": "evaluate", "script": "document.querySelector('.fixed.inset-0')?.remove(); 'cleared'" }
```

## Site Map

| Section | URL | Purpose |
|---------|-----|---------|
| Feed | `/` | Main feed, 3-column masonry layout of posts |
| Bookmarks | `/favorites` | Saved posts |
| Search | `/search` | Search content |
| Notifications | `/notifications` | Activity notifications |
| Messages | `/messages` | Direct messages |
| Profile | `/profile` | User profile |
| Admin Dashboard | `/admin` | Platform analytics, user growth, engagement |
| Admin Users | `/admin/users` | User management |
| Admin Roles | `/admin/roles` | Role management |
| Admin Mailing | `/admin/mailing` | Email broadcasts |
| Admin Test | `/admin/test` | Testing tools |

## Content Model

Posts have:
- Text body (long-form articles, markdown-like formatting)
- Category tags (Technology, Business, Other, etc.)
- Author + timestamp
- Like count + comment count
- Images (optional)

## Current State (as of 2026-03-02)

### Platform Stats (from Admin Dashboard)
- *1 active user* in last 24 hours
- *4.82% user growth* (weekly)
- *2.43 posts/day* content velocity
- *1.64x engagement rate* per post
- *615 total posts* all time
- *1,007 total engagements*
- *Platform health score:* 34
- *~38 new users* recently

### Recent Members (last 10)
- tmontgomery, kbetts, ryanewright, CjacobsEdnaBuilders, amitshetty, fahkhan13, BettySam, JairoSierra, DonFrancis27, kl1m3k (all joined 3-4 days ago)

### Top Posters
- Sam (dominant — almost all recent content)
- The Analytic Mind, Jean, Frezia, Shrikesh, Agape, Olga, Angie, nickc, Matt

### Post Categories Observed
- Technology, Business, Other

### Content Themes (Sam's posts)
Mostly long-form thought leadership about AI:
- "The Rise of the Full-Stack AI Professional"
- "Why the Internet Feels So Hostile About AI"
- "The Real OS War Has Already Started"
- "The Web Is Splitting, Not Dying"
- "People Are Working More, Not Less"
- "The Quiet Way Companies Are Actually Adopting AI"
- "The Operating System Is Being Replaced by Intent"
- "How to Protect Your Focus During the AI Noise Era"

## Key Workflows

### 1. Create a Post
- Click the purple FAB (floating action button) in the bottom-right corner
- FAB selector: `button[class*="fixed"][class*="bottom"]`
- Note: Must dismiss welcome modal overlay first (see above)
- Post creation form opens (TODO: document form fields after first successful test)

### 2. Read the Feed
- Navigate to `/` after login
- Posts displayed in 3-column masonry grid
- Click "Load More" to see older posts
- Each post shows: author, timestamp, category, preview text, like/comment count

### 3. Admin Dashboard
- Navigate to `/admin`
- View: active users, user growth, content velocity, engagement rate, user retention
- Charts: Post Performance (30 day), User Growth
- Lists: Most Active Users, Last 10 New Members

### 4. Admin Mailing
- Navigate to `/admin/mailing`
- Broadcast emails to all members (TODO: explore and document)

### 5. Search
- Navigate to `/search`
- Search across all community content

## Connected Ecosystem (EDNA Apps)
The platform has a bottom widget showing the EDNA app ecosystem:
- EDNA Learn — courses, certifications
- MENTOR — AI copilot
- EDNA Builders — this platform
- KnowCode — code generation
- Learn Flow — guided pathways
- Power Vibes — metadata insights
- Prompt Array — AI prompts
- App Idea Engine — app specs
- Capture — error monitoring

## BrowserBase Notes
- Wide viewport (2545px) — FAB is at far right
- Welcome modal covers the page on first visit — must dismiss via JS
- Login is on the landing page (no separate /sign-in route)
- Category assignment during post creation (need to explore)

## Image Generation

### Model & Prompt
- **Model:** `google/imagen-4-ultra` on Replicate
- **Prompt template:** `A modern Nike type ad style with "{HEADLINE_TEXT}". The visuals around the words should be relevant to the words. Nothing representing Nike. Use relevant imagery in simple and unique ways, white background, image in the middle with text overlay. Make the text large and stand out.`
- Replace `{HEADLINE_TEXT}` with an attention-grabbing line that captures the essence of the post content

### Quality Gate
Before attaching an image to a post, score it (via vision model) on:
1. **Text readability** — is the headline text clear, large, and legible?
2. **Visual relevance** — do the visuals match the words?
3. **Style match** — white background, Nike-ad aesthetic, clean and bold?
4. **Overall quality** — professional, not cluttered, would you post it?

Score each 1-5, total out of 20. Threshold: **14/20** to pass.

### Rules
- Generate up to **3 images max** per post
- If image 1 scores ≥14, use it immediately
- If not, generate image 2 with a slightly refined prompt
- If image 2 scores ≥14, use it
- If not, generate image 3 (final attempt) — use the highest-scoring of the 3
- Never generate more than 3

## Growth Strategy Context
- Currently Sam-dominated content — need more member engagement
- 38 new users recently but only 1 active in 24h — retention is the challenge
- Engagement rate low — need to trigger discussion, not just publish articles
- Admin mailing tool available for re-engagement campaigns

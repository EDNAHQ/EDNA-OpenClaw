# ContentLead Skill

Social media content creation and publishing platform. Browser-based automation via BrowserBase.

## Platform Overview

ContentLead (contentlead.ai) is an all-in-one content creation, scheduling, and publishing tool. No API — all interaction via browser automation.

## Authentication

- URL: `https://contentlead.ai/sign-in`
- Email: `sam.mckay@enterprisedna.co.nz`
- Password: `Pompallier2332`
- Login method: Fill `#email` and `#password`, press Enter (keyboard submit — do NOT click buttons, the Google sign-in button intercepts)

### Login Action Sequence
```json
[
  { "action": "goto", "url": "https://contentlead.ai/sign-in", "timeout": 30000 },
  { "action": "wait", "ms": 3000 },
  { "action": "fill", "selector": "#email", "value": "sam.mckay@enterprisedna.co.nz" },
  { "action": "fill", "selector": "#password", "value": "Pompallier2332" },
  { "action": "keyboard", "key": "Enter" },
  { "action": "wait", "ms": 5000 }
]
```

## Brands (4 configured)

| Brand | Social Accounts Connected |
|-------|--------------------------|
| ContentLead | Bluesky, Facebook, Instagram, LinkedIn, Pinterest, Reddit, Threads, TikTok, Twitter |
| Sam - Personal | Bluesky, LinkedIn, Twitter, YouTube |
| Enterprise DNA | LinkedIn, Pinterest, Reddit, TikTok, Twitter, YouTube |
| Help Genie | Instagram, LinkedIn |

## Site Map

| Section | URL | Purpose |
|---------|-----|---------|
| Dashboard | `/dashboard` | Home, quick actions |
| Brand Studio | `/brand-studio` | Define brand voice, mission, target audience, guidelines |
| Content Creator | `/content-chat` | AI chat interface — describe what you want, get content |
| Create Posts | `/content-maker` | Create cross-platform posts for a selected brand |
| Media Creator | `/image-playground` | Generate images from text prompts |
| Notes Library | `/content-playground` | Research hub — YouTube transcripts, web content, docs (301 notes) |
| Scheduler | `/scheduler` | Visual calendar (day/week/month), schedule & manage posts |
| Media Assets | `/assets` | Image/video/document library (28 images, retention: 1 month unless saved) |
| Content History | `/history` | Review past content |
| Social Accounts | `/social-accounts` | Manage connected platforms |
| Manage Users | `/admins/users` | User management (admin) |
| AI Models | `/admins/models` | AI model configuration (admin) |
| Pricing | `/admins/pricing` | Plan management (admin) |
| Agent Chat | `/agent-chat` | Chat interface |

## Key Workflows

### 1. Create Content via Content Creator (AI Chat)

This is the primary content creation flow.

1. Navigate to `/content-chat`
2. Select a brand (click brand name in the sidebar list)
3. The interface shows:
   - Platform toggles: twitter, instagram, linkedin, tiktok, facebook, reddit, threads, bluesky, pinterest, None
   - Hashtags toggle: On/Off
   - Template categories: Content Planning, Quick Content, Strategy & Analysis
   - Free-text textarea for custom requests
4. Type a content request in the textarea (selector: `textarea`)
5. Press Enter to send
6. AI generates content based on brand voice and selected platforms

**Templates available:**
- *Content Planning:* Weekly calendar, Monthly strategy, Campaign series
- *Quick Content:* Single post, Educational post, Promotional content, Chain posted content
- *Strategy & Analysis:* Strategy review, Trending ideas, Competitor analysis, Content gap analysis, Niche trend research, Social media research

### 2. Create Posts via Content Maker (PRIMARY POSTING WORKFLOW)

This is the main page for creating and publishing posts. Understand it thoroughly.

#### Full Flow: Select Brand → Add Items → Configure → Continue → Edit → Add Platforms → Add Media → Publish

**Step 1: Select Brand**
1. Navigate to `/content-maker`
2. Select a brand from the grid (ContentLead, Sam - Personal, Enterprise DNA, Help Genie)
3. Brand shows in top bar after selection; can switch via brand selector dropdown

**Step 2: Add Content Items**
1. Click "ADD ITEM" button (bottom center)
2. Each item has:
   - *Textarea* — "Your idea or prompt" (selector: `textarea`, placeholder: "Describe what you want to create...")
   - *Voice input* — mic button for voice recording (top-right of textarea)
   - *Processing dropdown* (selector: `button[role='combobox']`) — options:
     - "Publish with no changes" (default — posts the prompt text as-is)
     - *Saved image/design prompt templates* (reusable creative prompts)
     - *Tone styles:* Humorous & Playful, Data-Driven & Analytical, Warm & Community-Focused, Bold & Provocative, Casual & Conversational, Professional & Authoritative, Inspiring & Motivational, Educational & Informative, Engaging & Story-Driven, Direct & Action-Oriented
   - *Continue* button — processes the item
   - *Delete* button (trash icon)
3. Can add multiple items for *bulk posting* — each gets its own prompt + settings
4. "RESET CONTENT" button (top right) clears all items
5. "Assign [Brand] to all items" — bulk-assigns brand when items are unassigned

**Step 3: After Continue — Content Card**
After clicking Continue, each item becomes a content card with:

*Tabs:*
- *Original* — the base content text
- *Platform tabs* — added via "Add Platform" (each platform gets its own optimized version)

*Content Editing:*
- Click "EDIT" to enter edit mode
- Editable textarea with the content text
- "RICH TEXT" toggle for formatted editing
- "SAVE" button (with dropdown for additional save options)
- "CANCEL" to discard edits

*Add Platforms (selector: `button:has-text('Add Platform')`):*
- Opens platform selector popup with checkboxes:
  - Twitter, Instagram, LinkedIn, TikTok, Facebook, Reddit, Threads, Bluesky, Pinterest
  - "Select All" option
  - "Generate (9)" button — generates platform-optimized versions for all selected
- Each platform gets its own tab with tailored content
- Content is auto-synced across platforms (configurable via Settings gear)

*Media Section:*
- *Upload button* (+) — add images, videos, or documents from device/library
- *AI Generate button* (sparkles ✨) — generate images with AI
- Supports drag & drop reordering

*First Comment:*
- Optional "First Comment" field — adds a follow-up comment when posting (useful for LinkedIn engagement, hashtag dumps, etc.)

*Publishing:*
- "PUBLISH" button (disabled until at least one platform is added)
- Clock icon suggests scheduling capability
- Publish sends to all added platforms simultaneously

*Settings Gear (top right):*
- "Auto-sync platform content" toggle — when enabled, platform content syncs automatically when the original is edited

#### Bulk Posting Flow
1. Click "ADD ITEM" multiple times to create several content items
2. Configure each with different prompts/tones
3. Click Continue on each
4. Add platforms and media to each
5. Publish all — each item posts independently to its configured platforms

#### Automation Selectors Reference
| Element | Selector |
|---------|----------|
| Brand buttons | `button:has-text('ContentLead')` etc. |
| Add Item | `button:has-text('Add Item')` |
| Prompt textarea | `textarea` |
| Processing dropdown | `button[role='combobox']` |
| Continue | `button:has-text('Continue'):not([disabled])` |
| Edit | `button:has-text('Edit')` |
| Add Platform | `button:has-text('Add Platform')` |
| Publish | `button:has-text('Publish')` |
| Save (in edit mode) | `button:has-text('Save')` |
| Reset Content | `button:has-text('Reset Content')` |
| Rich Text toggle | `button:has-text('Rich Text')` |

### 3. Generate Images

1. Navigate to `/image-playground`
2. Enter image prompt in the text field
3. Configure: count (default 1), quality (Standard), aspect ratio (1:1), format (JPG), style (Creative)
4. Click GENERATE
5. Save to media library for permanent retention (auto-deletes after 1 month otherwise)

### 4. Schedule Content

1. Navigate to `/scheduler`
2. Views: List, Day, Week, Month
3. Filters: Brand, Type, Platform, Status
4. Click "ADD CONTENT" to schedule new posts
5. Tabs: Calendar, Published Posts, Analytics, History, Pending Approval

### 5. Add Research/Notes

1. Navigate to `/content-playground`
2. Tabs: Notes Library, Research Collection, Your Notes
3. Can extract YouTube transcripts, pull website content, upload documents
4. Notes are tagged and searchable (301 notes currently)

## BrowserBase Usage Notes

- Sessions have ~5 min timeout — keep action sequences focused
- Always login fresh each session (no persistent context needed)
- Use `keyboard: Enter` for form submission, not button clicks
- After login, navigate directly to target URL via `goto`
- Use `text` action on `body` to read page content
- Use `evaluate` for JS interactions when selectors are tricky

## Current State (as of 2026-03-02)

- 80+ posts scheduled for the current week (mostly ContentLead and Help Genie brands)
- 20+ social accounts connected across 4 brands
- 301 research notes in the library
- 28 media assets
- Active content publishing for ContentLead and Help Genie brands
- Enterprise DNA and Sam Personal brands have social accounts but fewer scheduled posts

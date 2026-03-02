# Infrastructure Map

_Last updated: 2026-02-24_

## Overview

Enterprise DNA runs **17 repos across 3 GitHub orgs** (EDNAHQ, Omni-Intelligence, EnterpriseDNA). The ecosystem is primarily **React + TypeScript + Supabase + Vite** web apps, plus a handful of **Python desktop tools** and the **OpenClaw fork**.

**Common stack across most web apps:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Supabase, Tanstack Query, React Router, Zod, React Hook Form.

**Hosting:** Netlify (Content-Lead, Builder-Community, Power-Vibes), Fly.io/DO (EDNA-OpenClaw). Apps originally scaffolded on Lovable but all development now happens via **Claude Code, Cursor, and Codex**.

---

## Web Applications (TypeScript/React)

### EDNAHQ/Help-Genie-Voice ⭐ (private)
- **Purpose:** AI-powered customer support SaaS — voice agents ("Genies"), conversational intelligence, knowledge base management
- **URL:** TBD
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase
- **Key integrations:** Stripe (payments), ElevenLabs (voice), OpenAI Agents SDK, Pusher (realtime), Twilio (phone), TipTap (rich text), ExcelJS/XLSX
- **Hosting:** Netlify (has netlify.toml)
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** Has `edna-capture` package, custom scripts for image/logo generation

### EDNAHQ/Content-Lead ⭐ (private)
- **Purpose:** AI-powered content creation & multi-platform social media management
- **URL:** contentlead.ai
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase, Zustand (state)
- **Key integrations:** Stripe, OpenAI (via Vercel AI SDK `@ai-sdk/openai`), Uppy (file uploads), Konva (canvas/image editing), PDF.js
- **Hosting:** Netlify
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** Has MCP server (`/mcp-server`, `/cl-apps-mcp`), GPT apps (`/gpt-apps`), extensive docs (ARCHITECTURE, SETUP, CLAUDE context files)

### EDNAHQ/EDNA-HQ-Main ⭐ (private)
- **Purpose:** Main Enterprise DNA website/platform
- **URL:** enterprisedna.co (likely)
- **Stack:** React, TypeScript (originally JS), Vite, Tailwind, shadcn/ui, Supabase
- **Key integrations:** Three.js + React Three Fiber (3D), Framer Motion, Swiper, QR codes, Lenis (smooth scroll)
- **Hosting:** TBD (originally Lovable, now developed via Claude Code/Cursor/Codex)
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** Has brand style guide, video/image optimization scripts

### EDNAHQ/Builder-Community (private)
- **Purpose:** Social platform for developers and AI enthusiasts — posts, comments, reactions, messaging, AI-powered daily summaries
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase, Framer Motion
- **Key integrations:** `edna-capture`, markdown (react-markdown + remark-gfm)
- **Hosting:** Netlify
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** Community-driven, GPT-4 daily summaries, voice recordings

### EDNAHQ/Power-Vibes (private)
- **Purpose:** Power BI analytics tool — AI-powered insights, DAX analysis, M code analysis, SQL model generation
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase
- **Key integrations:** Stripe, Monaco Editor (code editing), Gemini API, Express (proxy server), `edna-capture`, syntax highlighting
- **Hosting:** Netlify
- **Database:** Supabase
- **Notable:** Has PM2 persistent dev server setup, proxy server for API calls

### EDNAHQ/LearnFlow (public)
- **Purpose:** AI learning companion — personalized learning paths, multi-format content (text, audio, presentations)
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase, Zustand
- **Key integrations:** Replicate (AI models), markdown rendering, syntax highlighting, Framer Motion
- **Hosting:** TBD (no netlify.toml visible at root)
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** Has MCP config, reports directory, extensive docs

### Omni-Intelligence/App-Idea-Engine (public)
- **Purpose:** App idea generation/validation tool
- **Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui, Supabase
- **Hosting:** Netlify
- **Database:** Supabase (has `/supabase` dir)
- **Notable:** OAuth setup (Google + GitHub)

---

## Documentation & Infrastructure

### EDNAHQ/docs (public)
- **Purpose:** Product documentation
- **Stack:** Mintlify (MDX)
- **Hosting:** Mintlify hosting
- **Contents:** API reference, getting started guides
- **Notable:** Deploy via GitHub app → Mintlify dashboard

### EDNAHQ/EDNA-OpenClaw (public)
- **Purpose:** Fork/instance of OpenClaw — the AI assistant platform powering EDNA Claw
- **Stack:** TypeScript, Node.js, Docker
- **Hosting:** Fly.io (has fly.toml), Docker, self-hosted on Digital Ocean droplet
- **Notable:** Full OpenClaw source with skills, extensions, sandbox Dockerfiles, vitest test suites, podman support

### EDNAHQ/Command-Center (private)
- **Purpose:** Unknown — minimal repo (only .claude dir, .env.local, .gitignore)
- **Stack:** JavaScript (per GitHub metadata)
- **Status:** Possibly early stage or config-only

---

## Desktop Applications (Python)

### Omni-Intelligence/Echo-Assist (public)
- **Purpose:** Desktop AI voice assistant + chat + screenshot tool
- **Stack:** Python, PyQt6 (likely), OpenAI Whisper
- **Platform:** Windows (CUDA recommended)
- **Notable:** Keyboard shortcuts, avatar personalities, real-time streaming

### Omni-Intelligence/echo-assistant (public)
- **Purpose:** Desktop voice assistant — simpler version of Echo-Assist
- **Stack:** Python, PyQt6, OpenAI (TTS + STT)
- **Platform:** Cross-platform
- **Notable:** Multiple voice options (Alloy, Ash, Coral, Echo, Sage, Shimmer)

### Omni-Intelligence/simple-assistant (public)
- **Purpose:** Simple voice assistant — Google Speech Recognition + TTS
- **Stack:** Python, SpeechRecognition, gTTS, PyAudio
- **Platform:** Cross-platform (Windows, macOS, Linux)

### Omni-Intelligence/model-bim (public)
- **Purpose:** Power BI BIM model analyzer — AI-powered insights from .bim files
- **Stack:** Python, customTkinter, OpenAI
- **Platform:** Desktop (cross-platform)
- **Notable:** Multi-tab analysis (DAX, structure, performance, data dictionary)

### EnterpriseDNA/analysthub2.0 (public)
- **Purpose:** Same as model-bim — Power BI BIM model analyzer (earlier version or fork)
- **Stack:** Python, customTkinter
- **Platform:** Desktop

### Omni-Intelligence/extract-metadata (public)
- **Purpose:** Extract Power BI model metadata from .pbix files
- **Stack:** Python, requires pbi-tools
- **Platform:** Windows only
- **Notable:** Extracts DataModelSchema, ReportMetadata, Connections, DiagramLayout

### Omni-Intelligence/excel-helper (public)
- **Purpose:** Excel formula assistant — generate/explain formulas via GPT
- **Stack:** Python, PyQt6, OpenAI (GPT-4o-mini)
- **Platform:** Desktop

---

## Shared Infrastructure

### Supabase
- **CRM project:** aaheuncnheyqnuoyzokp (ap-northeast-1)
- Most web apps use Supabase for auth + database + storage
- Unclear if shared Supabase project or separate per app — **needs clarification from Sam**

### Common Packages
- `edna-capture` — custom package used in Help-Genie-Voice, Builder-Community, Power-Vibes
- `shadcn/ui` (Radix) — universal UI component library across all React apps

### Hosting Summary
| App | Host |
|-----|------|
| Help-Genie-Voice | Netlify |
| Content-Lead | Netlify |
| EDNA-HQ-Main | TBD |
| Builder-Community | Netlify |
| Power-Vibes | Netlify |
| LearnFlow | TBD |
| App-Idea-Engine | Netlify |
| docs | Mintlify |
| EDNA-OpenClaw | Fly.io / Digital Ocean |
| Desktop apps | Local / packaged executables |

### Auth
- Supabase Auth across web apps
- OAuth providers: Google, GitHub (at least on App-Idea-Engine)
- Stripe for payments (Help-Genie-Voice, Content-Lead, Power-Vibes)

### AI/ML Services
- **OpenAI** — GPT models, Whisper, TTS (used everywhere)
- **ElevenLabs** — Voice synthesis (Help-Genie-Voice)
- **Gemini** — Power-Vibes
- **Replicate** — LearnFlow
- **Vercel AI SDK** — Content-Lead

---

## Tech Stack Summary

| Category | Technologies |
|----------|-------------|
| **Languages** | TypeScript (primary), JavaScript, Python, MDX |
| **Frontend** | React 18, Vite, Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| **State** | Zustand, Tanstack Query, React Hook Form |
| **Backend/DB** | Supabase (Postgres + Auth + Storage + Edge Functions) |
| **Hosting** | Netlify, Lovable, Fly.io, Mintlify, Digital Ocean |
| **Payments** | Stripe |
| **AI** | OpenAI, ElevenLabs, Gemini, Replicate, Vercel AI SDK |
| **Realtime** | Pusher (Help-Genie-Voice), Supabase Realtime |
| **Desktop** | Python + PyQt6 / customTkinter |
| **Docs** | Mintlify |
| **CI/CD** | GitHub Actions |

---

## Open Questions
- [ ] How many Supabase projects total? Shared or separate per app?
- [ ] What's Command-Center for?
- [ ] Where is LearnFlow hosted?
- [ ] What's the `edna-capture` package? (npm or internal?)
- [ ] Which apps are live in production vs staging?
- [ ] Stripe accounts — shared or per product?

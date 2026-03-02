# Strategy Memory — Enterprise DNA

Running record of strategic discussions from #edna-strategy-agents.
Updated after each conversation.

---

## 2026-03-01 — Channel Created

- Sam set up #edna-strategy-agents as a dedicated space for strategic thinking
- Created this file (`memory/strategy.md`) to capture all strategy discussions long-term
- Goal: build a persistent strategic brain that accumulates over time

---

## 2026-03-01 — The Pivot: Omni by Enterprise DNA

**Key Decision:** Enterprise DNA pivots from training to **managed AI agent workforce** service.

**Why:**
- Training business is declining — AI makes it less relevant, nobody wants to learn tools that replace them
- The real value is in deploying and running agents FOR businesses, not teaching them
- Sam has built a working agent stack (OpenClaw) and is living proof it works
- The complexity of setup is the moat — businesses can't do this themselves

**The Offer — "Omni by Enterprise DNA":**
- Managed AI agent workforce — deploy agents that handle real business ops
- All-inclusive pricing (infrastructure, API costs, models, hosting all included)
- Sam as strategic AI advisor — monthly calls, proactive recommendations, best practices
- Enterprise DNA training library as value-add knowledge base
- Slack channel for direct communication and support

**Pricing:**
- $2,750 NZD/month (founding partner rate)
- No setup fee for early clients
- 3-month minimum commitment
- Standard pricing will increase as client base grows (target $3,500-5,000 NZD for later clients)

**Target:** 30-50 clients at $2,750+/month = $80K-$140K NZD/month

**Existing business:** Training stays alive but winds down naturally. Omni becomes the main focus and talking point.

**Brand:** "Omni by Enterprise DNA" — keeps trust equity, signals new direction.

---

## 2026-03-02 — First Customer: AssetPro

**Client:** Lo Cheng, AssetPro (assetpro.co.nz)
- Auckland property management, 2 people, $550M under management
- Was about to hire, heard about agents, wants to try this instead
- Key needs: tenant comms, contractor coordination, maintenance logging, general ops
- Demo genie already built: property-maintenance-triage on HelpGenie
- HelpGenie is separate from Omni — different product/offering

**Proposal drafted:** `omni/proposals/assetpro-proposal.md`
- $2,750 NZD/month, no setup fee, 3-month commitment
- Workflows: tenant comms, contractor coordination, email triage, reporting, scheduling

**GTM Strategy:**
- Skip the website for now — just get clients live
- Use 70K email list to generate interest
- Content-led: share behind-the-scenes of running business with agents
- LinkedIn + YouTube as primary channels
- First 5 clients → refine → scale pricing

**Proposal Pipeline:**
- PDF generator built: `omni/scripts/generate-proposal-pdf.mjs` (PDFKit, reusable per client)
- Brand colors: purple #6654f5, pink #ca5a8b, gold #f2b347, dark #0b0c18
- Font: Poppins (brand) — currently using Helvetica in PDFs (PDFKit limitation)
- Delivery via email (Gmail API) since Slack bot lacks files:write scope
- v8 is current version — professional, moderate tone, no overselling

**Pricing Research (2026-03-02):**
- AI automation agency retainers: $2,000-$20,000+/month (avg ~$3,200)
- Custom AI agent builds: $10,000-$85,000+ one-time
- AI readiness audits alone: $5,000-$15,000
- Monthly AI operational costs (just LLM/infra): $1,000-$5,000
- Omni pricing tiers discussed:
  - Founding Partners (first 10): $2,750 NZD or ~$2,000 USD, no setup fee
  - Standard NZ/AU: $3,500-$4,500 NZD + setup fee
  - Standard US: $3,000-$5,000 USD + setup fee
  - Premium: $5,000-$8,000 USD
- Sam wants to target US market aggressively — $3K USD/month is easy vs hiring
- Sam wants AI token quota of $250/month included in base price

**Vision — Digital Workforce Company:**
- Not selling tools — creating, training, and managing digital employees
- Phase 1 (now-3mo): 5-10 Omni clients, learn, build playbooks
- Phase 2 (3-6mo): Productise standard digital worker templates
- Phase 3 (6-12mo): Industry-specific offerings, content-driven leads
- Phase 4 (12mo+): Platform/marketplace model
- Sam sees this as "the new digital business layer" — all business will revolve around agents
- Competition doesn't matter yet — execution and speed to market do

---

## 2026-03-02 — Marketing Strategy Discussion (#edna-marketing-agents)

**Context:** Sam wants to go all-in on agents. Marketing needs to evolve to support Omni as the primary offering.

**Marketing Pillars Identified:**

*1. Existing audience conversion (quick wins)*
- Email campaign to 70K list — authentic "here's what we're doing now" story in Sam's voice
- Segment list: business owners/decision-makers vs individual learners (different messaging)
- Drip sequence: interest → discovery call → proposal

*2. Content engine (medium-term)*
- Behind-the-scenes of real agent deployments (AssetPro as first case study once live)
- LinkedIn: Sam posting as practitioner — "I replaced X with agents, here's what happened"
- YouTube: real agent workflow walkthroughs (proof, not tutorials)
- Position Sam as the person actually doing this, not just talking about it

*3. Outreach & positioning (scaling)*
- Target: SMBs with 2-20 people who are about to hire but could deploy agents instead
- Core pitch: "Don't hire. Deploy."
- Priority industries: property management, professional services, agencies — ops-heavy, people-light
- Referral incentive for early clients

*4. Brand & web presence (when ready)*
- Omni landing page — simple but credible
- Social proof from first clients
- Cost calculator: "agents vs hiring"

**Key perception shift needed:** Enterprise DNA = data training → Enterprise DNA = the team that runs AI agents for your business. Omni also needs to attract net-new clients outside the EDNA audience.

---

**Lessons from first proposal:**
- Don't make up claims (e.g. "working prototype") — only state real things
- Keep tone professional and moderate — sell the dream but don't oversell
- Sam wants open-ended scope framing ("ideas and recommendations, far more we can do")
- Highlight the volume of included value so price feels like a bargain
- Sam's email: sam.mckay@ednahq.com (not enterprisedna.co)

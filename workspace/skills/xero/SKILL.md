---
name: xero
description: "Xero invoicing and accounting for Enterprise DNA. Invoice drafting, lookups, and billing reports. Status: not yet connected."
---

# Xero Skill

## Overview
Invoicing and accounting for Enterprise DNA via Xero.

## Status: 🔜 Not Yet Connected

## What We Need
- [ ] Xero API credentials (OAuth 2.0 app)
- [ ] Tenant/organisation ID
- [ ] Define which operations EDNA Claw should handle
- [ ] Set up credentials in openclaw.json

## Planned Use Cases
- **Invoice drafting** (Anilyn/Angie) — create draft invoices for manual review
- **Invoice lookups** — check invoice status for customer queries
- **Reporting** — pull billing summaries

## API Reference
- Auth: OAuth 2.0
- Docs: https://developer.xero.com/documentation/api/accounting/overview

## Team Access
- **Anilyn** — manual invoicing, draft creation
- **Angie** — invoicing oversight, billing operations

## Notes
- EDNA Claw should DRAFT invoices only — human review before sending

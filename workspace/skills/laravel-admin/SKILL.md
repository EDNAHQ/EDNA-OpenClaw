---
name: laravel-admin
description: "Enterprise DNA Laravel admin panel. Customer access provisioning, account lookups, and subscription management. Status: not yet connected."
---

# Laravel Admin Skill

## Overview
Customer access provisioning and account management via the Enterprise DNA Laravel admin panel.

## Status: 🔜 Not Yet Connected

## URL
- **Admin panel:** https://app.enterprisedna.co/admin/

## What We Need
- [ ] Determine automation approach (API vs browser automation via BrowserBase)
- [ ] Admin credentials or API access
- [ ] Define which operations EDNA Claw should handle

## Planned Use Cases
- **Customer access provisioning** — grant/revoke platform access for new and renewing subscribers
- **Account lookups** — check customer subscription status, CRM data
- **Bulk operations** — onboarding batches of new users

## Team Access
- **Anilyn** — primary user for customer access provisioning and CRM checks
- **Angie** — oversight and escalation

## Notes
- If no API exists, BrowserBase skill can automate the admin panel via headless browser
- All provisioning should be logged for audit trail

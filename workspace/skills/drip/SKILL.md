---
name: drip
description: "Email marketing automation via Drip. Manage subscribers, campaigns, tags, workflows, and broadcasts for Enterprise DNA and ContentLead accounts."
---

# Drip Skill — Enterprise DNA & ContentLead

## What It Is
Drip is an email marketing automation platform. Manages subscribers, campaigns, automations, tags, workflows, and broadcasts.

## Auth
- **Token:** `DRIP_API_TOKEN` env var
- **Auth method:** HTTP Basic (token as username, no password)
- **Base URL:** `https://api.getdrip.com/v2`

## Accounts

| Account | ID | URL | Default From |
|---------|-----|-----|-------------|
| Enterprise DNA | `1621557` | www.enterprisedna.co | Sam at Enterprise DNA <sam.mckay@enterprisedna.co> |
| ContentLead | `7910490` | www.contentlead.ai | ContentLead |

## API Pattern

```bash
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/ACCOUNT_ID/..."
```

All requests use Basic auth with the token as username and empty password.

## Common Operations

### Subscribers
```bash
# List subscribers
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/subscribers"

# Get subscriber by email
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/subscribers?email=user@example.com"

# Get specific subscriber
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/subscribers/SUBSCRIBER_ID"

# Create/update subscriber
curl -s -X POST -u "$DRIP_API_TOKEN:" \
  -H "Content-Type: application/json" \
  "https://api.getdrip.com/v2/1621557/subscribers" \
  -d '{"subscribers":[{"email":"user@example.com","tags":["customer"]}]}'

# Unsubscribe someone
curl -s -X POST -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/subscribers/SUBSCRIBER_ID/unsubscribe"

# Tag a subscriber
curl -s -X POST -u "$DRIP_API_TOKEN:" \
  -H "Content-Type: application/json" \
  "https://api.getdrip.com/v2/1621557/tags" \
  -d '{"tags":[{"email":"user@example.com","tag":"vip"}]}'

# Remove tag
curl -s -X DELETE -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/subscribers/SUBSCRIBER_ID/tags/TAG_NAME"
```

### Campaigns (Drip sequences)
```bash
# List campaigns
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/campaigns"

# Get campaign details
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/campaigns/CAMPAIGN_ID"

# Subscribe someone to a campaign
curl -s -X POST -u "$DRIP_API_TOKEN:" \
  -H "Content-Type: application/json" \
  "https://api.getdrip.com/v2/1621557/campaigns/CAMPAIGN_ID/subscribers" \
  -d '{"subscribers":[{"email":"user@example.com"}]}'
```

### Broadcasts (one-off emails)
```bash
# List broadcasts
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/broadcasts"
```

### Events (track custom actions)
```bash
# Record event
curl -s -X POST -u "$DRIP_API_TOKEN:" \
  -H "Content-Type: application/json" \
  "https://api.getdrip.com/v2/1621557/events" \
  -d '{"events":[{"email":"user@example.com","action":"Completed course"}]}'
```

### Workflows
```bash
# List workflows
curl -s -u "$DRIP_API_TOKEN:" \
  "https://api.getdrip.com/v2/1621557/workflows"
```

## Safety Rules
- **Reading is always safe** — list subscribers, campaigns, stats freely
- **Tagging/events are safe** — useful for automation
- **Bulk operations** — confirm with Sam before mass tagging, unsubscribing, or campaign changes
- **Never delete subscribers** — unsubscribe instead
- **Campaign changes** — confirm before activating/deactivating campaigns

## Notes
- Account `1621557` (Enterprise DNA) is the primary marketing account
- Account `7910490` (ContentLead) is the secondary business
- Replace `1621557` with `7910490` in URLs to target ContentLead
- API docs: https://developer.drip.com/

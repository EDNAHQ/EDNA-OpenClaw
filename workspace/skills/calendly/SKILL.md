---
name: calendly
description: "Manage Sam's Calendly account — view events, event types, availability, invitees, and scheduling links. Use when asked about upcoming meetings, scheduling, or calendar management via Calendly."
---

# Calendly Skill

## Overview
Manage Sam McKay's Calendly account via their API v2.

## Account Details
- **Email:** sam.mckay@enterprisedna.co.nz
- **Scheduling URL:** https://calendly.com/sam-mckay
- **Timezone:** Pacific/Auckland
- **User URI:** https://api.calendly.com/users/BBCEGESCM6MUI4BZ
- **Org URI:** https://api.calendly.com/organizations/ADCGCEXFK2KEU6JA

## Auth
- **Token env var:** `CALENDLY_API_TOKEN`
- **Base URL:** `https://api.calendly.com`
- All requests need: `Authorization: Bearer $CALENDLY_API_TOKEN`

## Common Operations

### Get current user
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/users/me"
```

### List event types (meeting links)
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/event_types?user=https://api.calendly.com/users/BBCEGESCM6MUI4BZ&active=true"
```

### List scheduled events (upcoming)
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/scheduled_events?user=https://api.calendly.com/users/BBCEGESCM6MUI4BZ&min_start_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)&status=active&sort=start_time:asc&count=20"
```

### List scheduled events (past)
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/scheduled_events?user=https://api.calendly.com/users/BBCEGESCM6MUI4BZ&max_start_time=$(date -u +%Y-%m-%dT%H:%M:%SZ)&status=active&sort=start_time:desc&count=20"
```

### Get event details
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/scheduled_events/EVENT_UUID"
```

### List invitees for an event
```bash
curl -s -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  "https://api.calendly.com/scheduled_events/EVENT_UUID/invitees"
```

### Cancel an event
```bash
curl -s -X POST -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.calendly.com/scheduled_events/EVENT_UUID/cancellation" \
  -d '{"reason": "Reason here"}'
```

### Create single-use scheduling link
```bash
curl -s -X POST -H "Authorization: Bearer $CALENDLY_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.calendly.com/scheduling_links" \
  -d '{
    "max_event_count": 1,
    "owner": "https://api.calendly.com/event_types/EVENT_TYPE_UUID",
    "owner_type": "EventType"
  }'
```

## API Reference
- Docs: https://developer.calendly.com/api-docs
- Rate limit: 500 requests per minute

## Safety Rules
- **Reading is always safe** — check events, availability freely
- **Cancelling requires confirmation** — always confirm with Sam before cancelling
- **Creating scheduling links is safe** — these are just invites

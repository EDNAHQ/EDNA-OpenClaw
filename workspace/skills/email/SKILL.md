---
name: email
description: "Gmail email management for Sam McKay (sam.mckay@ednahq.com). Read, search, draft, and send emails. Sam only — do not expose to other team members without approval."
---

# Email Skill — Sam McKay (Personal)

## Overview
Unified email management across Sam's accounts. **Sam only** — do not expose email content, drafts, or access to other team members (Angie, Anilyn, etc.) unless Sam explicitly approves.

## Accounts

| Email | Provider | Status | Notes |
|-------|----------|--------|-------|
| sam.mckay@ednahq.com | Gmail (Workspace) | ✅ Active | Primary inbox |
| sam@helpgenie.ai | Gmail | ✅ Forwards to ednahq | Can send as helpgenie once authed |
| sam.mckay@enterprisedna.co.nz | Outlook (M365) | 🔜 Pending setup | Need Graph API credentials |
| sam.mckay@enterprisedna.co | Outlook (M365) | 🔜 Pending setup | Need Graph API credentials |

## Gmail Auth

- **Client ID:** `GMAIL_CLIENT_ID` env var
- **Client Secret:** `GMAIL_CLIENT_SECRET` env var
- **Refresh Token:** `GMAIL_REFRESH_TOKEN` env var (sam.mckay@ednahq.com)
- **Scopes:** `gmail.modify`, `gmail.send`

### Get a fresh access token
Access tokens expire every hour. Use the refresh token to get a new one:
```bash
curl -s -X POST https://oauth2.googleapis.com/token \
  -d "client_id=$GMAIL_CLIENT_ID" \
  -d "client_secret=$GMAIL_CLIENT_SECRET" \
  -d "refresh_token=$GMAIL_REFRESH_TOKEN" \
  -d "grant_type=refresh_token" | python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])"
```

### Common Gmail Operations

```bash
# Set token (run the refresh first, store result)
TOKEN="ya29.xxx"

# List recent messages
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10"

# Get message details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/MSG_ID?format=full"

# Search emails
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=from:someone@example.com"

# Search unread
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread"

# Get message snippet (lightweight)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/MSG_ID?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date"

# Send email
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" \
  -d '{
    "raw": "BASE64_ENCODED_RFC2822_MESSAGE"
  }'

# Mark as read
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/MSG_ID/modify" \
  -d '{"removeLabelIds": ["UNREAD"]}'

# List labels
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/labels"
```

### Building a raw email (for sending)
```bash
# Create RFC2822 message and base64url encode it
echo -e "To: recipient@example.com\nSubject: Hello\nContent-Type: text/plain; charset=utf-8\n\nEmail body here" | base64 -w 0 | tr '+/' '-_' | tr -d '='
```

## Outlook Auth (Microsoft Graph)
🔜 **Pending** — need Azure AD app registration with:
- Client ID
- Client Secret  
- Tenant ID
- Permissions: `Mail.ReadWrite`, `Mail.Send`

Once set up, Microsoft Graph API at `https://graph.microsoft.com/v1.0/me/messages`

## Safety Rules
- **DRAFT emails by default** — do NOT send without explicit approval
- **Reading is always safe** — check inbox freely
- **Searching is always safe** — find what's needed
- **Sending requires confirmation** — always show the draft first
- **Deleting** — never on own initiative, but delete when Sam explicitly asks (bulk or specific)
- **Unsubscribing** — can click unsubscribe links or send unsubscribe emails when Sam asks
- **Be careful with reply-all** — confirm recipients

## Unified Inbox Workflow
1. Check all active inboxes for unread messages
2. Summarise what's new across all accounts
3. Flag urgent items
4. Draft responses when asked
5. Send only after explicit approval

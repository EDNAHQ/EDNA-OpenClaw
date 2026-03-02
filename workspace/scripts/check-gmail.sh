#!/bin/bash
# Check Gmail for unread emails in last 24 hours
TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -d "client_id=$GMAIL_CLIENT_ID" \
  -d "client_secret=$GMAIL_CLIENT_SECRET" \
  -d "refresh_token=$GMAIL_REFRESH_TOKEN" \
  -d "grant_type=refresh_token" | python3 -c "import json,sys; print(json.load(sys.stdin).get('access_token','FAILED'))")

if [ "$TOKEN" = "FAILED" ]; then
  echo "ERROR: Could not get Gmail access token"
  exit 1
fi

# Get unread messages from last 24h
MESSAGES=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=is:unread%20newer_than:1d")

IDS=$(echo "$MESSAGES" | python3 -c "
import json,sys
d=json.load(sys.stdin)
msgs = d.get('messages',[])
if not msgs:
    print('NO_MESSAGES')
else:
    for m in msgs:
        print(m['id'])
")

if [ "$IDS" = "NO_MESSAGES" ]; then
  echo "No unread emails in the last 24 hours."
  exit 0
fi

echo "=== Unread emails (last 24h) ==="
for ID in $IDS; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/$ID?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date" | \
    python3 -c "
import json,sys
d=json.load(sys.stdin)
headers = {h['name']:h['value'] for h in d.get('payload',{}).get('headers',[])}
print(f\"From: {headers.get('From','?')}\")
print(f\"Subject: {headers.get('Subject','?')}\")
print(f\"Date: {headers.get('Date','?')}\")
print('---')
"
done

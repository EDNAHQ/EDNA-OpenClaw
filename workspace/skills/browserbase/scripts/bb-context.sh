#!/usr/bin/env bash
# BrowserBase context management — create, list, delete persistent browser contexts
# Contexts persist cookies/auth across sessions.
# Usage:
#   bb-context.sh create
#   bb-context.sh list
#   bb-context.sh delete <context-id>
set -euo pipefail

: "${BROWSERBASE_API_KEY:?Set BROWSERBASE_API_KEY}"
: "${BROWSERBASE_PROJECT_ID:?Set BROWSERBASE_PROJECT_ID}"

API="https://api.browserbase.com/v1"
AUTH=(-H "x-bb-api-key: $BROWSERBASE_API_KEY" -H "Content-Type: application/json")

cmd="${1:-help}"; shift || true

case "$cmd" in
  create)
    curl -s -X POST "$API/contexts" "${AUTH[@]}" -d "{\"projectId\":\"$BROWSERBASE_PROJECT_ID\"}"
    ;;
  list)
    curl -s "$API/contexts?projectId=$BROWSERBASE_PROJECT_ID" "${AUTH[@]}"
    ;;
  delete)
    context_id="${1:?context-id required}"
    curl -s -X DELETE "$API/contexts/$context_id" "${AUTH[@]}"
    ;;
  *)
    echo "Usage: bb-context.sh {create|list|delete} [context-id]"
    exit 1
    ;;
esac

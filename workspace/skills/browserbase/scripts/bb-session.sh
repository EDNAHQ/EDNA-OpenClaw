#!/usr/bin/env bash
# BrowserBase session helper — create, connect info, or stop sessions
# Usage:
#   bb-session.sh create [--context <id>] [--persist] [--proxy] [--region <region>] [--keep-alive] [--timeout <mins>]
#   bb-session.sh stop <session-id>
#   bb-session.sh status <session-id>
#   bb-session.sh list [--limit <n>]
set -euo pipefail

: "${BROWSERBASE_API_KEY:?Set BROWSERBASE_API_KEY}"
: "${BROWSERBASE_PROJECT_ID:?Set BROWSERBASE_PROJECT_ID}"

API="https://api.browserbase.com/v1"
AUTH=(-H "x-bb-api-key: $BROWSERBASE_API_KEY" -H "Content-Type: application/json")

cmd="${1:-help}"; shift || true

case "$cmd" in
  create)
    body="{\"projectId\":\"$BROWSERBASE_PROJECT_ID\""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --context) body="$body,\"browserSettings\":{\"context\":{\"id\":\"$2\",\"persist\":false}}"; shift 2;;
        --persist) body=$(echo "$body" | sed 's/"persist":false/"persist":true/'); shift;;
        --proxy) body="$body,\"proxies\":true"; shift;;
        --region) body="$body,\"region\":\"$2\""; shift 2;;
        --keep-alive) body="$body,\"keepAlive\":true"; shift;;
        --timeout) body="$body,\"timeout\":$2"; shift 2;;
        *) echo "Unknown flag: $1" >&2; exit 1;;
      esac
    done
    body="$body}"
    curl -s -X POST "$API/sessions" "${AUTH[@]}" -d "$body"
    ;;
  stop)
    session_id="${1:?session-id required}"
    curl -s -X POST "$API/sessions/$session_id/stop" "${AUTH[@]}"
    ;;
  status)
    session_id="${1:?session-id required}"
    curl -s "$API/sessions/$session_id" "${AUTH[@]}"
    ;;
  list)
    limit="${2:-10}"
    curl -s "$API/sessions?limit=$limit" "${AUTH[@]}"
    ;;
  *)
    echo "Usage: bb-session.sh {create|stop|status|list} [options]"
    exit 1
    ;;
esac

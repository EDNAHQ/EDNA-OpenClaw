#!/bin/bash
set -euo pipefail

WORKSPACE="/home/node/.openclaw/workspace"
REPO_DIR="$WORKSPACE/EDNA-OpenClaw"
BACKUP_BRANCH="workspace-backup"
CONFIG_FILE="/home/node/.openclaw/openclaw.json"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")

echo "=== OpenClaw Config Backup ==="
echo "Started: $TIMESTAMP"

# Create a temporary directory for staging
STAGING=$(mktemp -d)
trap "rm -rf $STAGING" EXIT

# Copy workspace files (excluding node_modules, .git, EDNA-OpenClaw repo itself)
echo "Copying workspace files..."
mkdir -p "$STAGING/workspace"

# Core config files
for f in SOUL.md AGENTS.md USER.md IDENTITY.md TOOLS.md MEMORY.md HEARTBEAT.md MODELS.md DROPLET.md INFRASTRUCTURE.md AGENTS_ORG.md; do
    [ -f "$WORKSPACE/$f" ] && cp "$WORKSPACE/$f" "$STAGING/workspace/"
done

# Directories (excluding heavy stuff)
for d in memory skills agents scripts reports edna-audit; do
    [ -d "$WORKSPACE/$d" ] && cp -r "$WORKSPACE/$d" "$STAGING/workspace/"
done

# openclaw.json with secrets scrubbed
if [ -f "$CONFIG_FILE" ]; then
    echo "Scrubbing secrets from openclaw.json..."
    sed -E \
        -e 's/("(key|token|secret|password|pat|apiKey|apiSecret)"[[:space:]]*:[[:space:]]*")[^"]+"/\1***REDACTED***"/gi' \
        -e 's/(github_pat_)[A-Za-z0-9_]+/\1***REDACTED***/g' \
        -e 's/(sk-[a-zA-Z0-9])[a-zA-Z0-9]{20,}/\1***REDACTED***/g' \
        -e 's/(xoxb-)[a-zA-Z0-9-]+/\1***REDACTED***/g' \
        "$CONFIG_FILE" > "$STAGING/workspace/openclaw.json"
fi

# Add a README
cat > "$STAGING/README.md" << EOF
# EDNA OpenClaw - Workspace Backup

Automated backup of Enterprise DNA's OpenClaw workspace configuration.

**Last backup:** $TIMESTAMP
**Instance:** DigitalOcean droplet (209.38.29.185)
**OpenClaw version:** $(openclaw --version 2>/dev/null || echo "unknown")

## Contents
- \`workspace/\` — All workspace config files (SOUL.md, skills, agents, memory, etc.)
- \`workspace/openclaw.json\` — Gateway config (secrets redacted)

## Note
This branch contains only configuration/workspace files. 
The \`main\` branch contains the original OpenClaw fork (legacy, not in use).
EOF

# Now push to the repo
cd "$REPO_DIR"

# Check if backup branch exists
if git rev-parse --verify "$BACKUP_BRANCH" >/dev/null 2>&1; then
    git checkout "$BACKUP_BRANCH"
else
    # Create orphan branch (no history from main)
    git checkout --orphan "$BACKUP_BRANCH"
    git rm -rf . >/dev/null 2>&1 || true
fi

# Clean the branch and copy staging files
git rm -rf . >/dev/null 2>&1 || true
cp -r "$STAGING"/* .
cp -r "$STAGING"/workspace/ .

# Stage and commit
git add -A
if git diff --cached --quiet; then
    echo "No changes to backup."
    git checkout main
    exit 0
fi

git commit -m "backup: workspace snapshot $TIMESTAMP"

# Push
echo "Pushing to GitHub..."
git push origin "$BACKUP_BRANCH" --force

echo "=== Backup complete ==="
echo "View at: https://github.com/EDNAHQ/EDNA-OpenClaw/tree/workspace-backup"

# Switch back to main
git checkout main

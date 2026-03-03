#!/bin/bash
set -euo pipefail

WORKSPACE="/home/node/.openclaw/workspace"
REPO_DIR="$WORKSPACE/EDNA-OpenClaw"
BACKUP_BRANCH="main"
CONFIG_FILE="/home/node/.openclaw/openclaw.json"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")

echo "=== OpenClaw Config Backup ==="
echo "Started: $TIMESTAMP"

# Create a temporary directory for staging
STAGING=$(mktemp -d)
trap "rm -rf $STAGING" EXIT

# Copy workspace files
echo "Copying workspace files..."
mkdir -p "$STAGING/workspace"

# Core config files
for f in SOUL.md AGENTS.md USER.md IDENTITY.md TOOLS.md MEMORY.md HEARTBEAT.md MODELS.md DROPLET.md INFRASTRUCTURE.md AGENTS_ORG.md; do
    [ -f "$WORKSPACE/$f" ] && cp "$WORKSPACE/$f" "$STAGING/workspace/"
done

# Directories (excluding node_modules)
for d in memory skills agents scripts reports edna-audit; do
    if [ -d "$WORKSPACE/$d" ]; then
        mkdir -p "$STAGING/workspace/$d"
        cd "$WORKSPACE/$d"
        find . -not -path '*/node_modules/*' -type f -exec sh -c 'mkdir -p "'"$STAGING/workspace/$d"'/$(dirname "$1")" && cp "$1" "'"$STAGING/workspace/$d"'/$1"' _ {} \;
        cd "$WORKSPACE"
    fi
done

# Copy openclaw.json
[ -f "$CONFIG_FILE" ] && cp "$CONFIG_FILE" "$STAGING/workspace/openclaw.json"

# Deep scrub all secrets
echo "Scrubbing secrets..."
STAGING_DIR="$STAGING" python3 -c "
import json, re, os
staging = os.environ['STAGING_DIR']

# Scrub openclaw.json
config_path = f'{staging}/workspace/openclaw.json'
if os.path.exists(config_path):
    with open(config_path) as f: config = json.load(f)
    secret_kw = ['KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'PAT', 'CREDENTIAL']
    def redact(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, str) and any(p in k.upper() for p in secret_kw): obj[k] = '***REDACTED***'
                elif isinstance(v, (dict, list)): redact(v)
        elif isinstance(obj, list):
            for i in obj: redact(i)
    redact(config)
    with open(config_path, 'w') as f: json.dump(config, f, indent=2)

# Scrub token patterns from all text files
pat = re.compile(r'(dop_v1_[a-f0-9]+|sk-ant-[a-zA-Z0-9_-]+|sk-[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]+|r8_[a-zA-Z0-9]+|github_pat_[a-zA-Z0-9_]+|xoxb-[a-zA-Z0-9-]+|sk-or-v1-[a-f0-9]+|GOCSPX-[a-zA-Z0-9_-]+)')
for root, dirs, files in os.walk(f'{staging}/workspace'):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fn in files:
        fp = os.path.join(root, fn)
        if fn.endswith(('.md','.sh','.json','.js','.env','.txt')):
            try:
                with open(fp) as f: c = f.read()
                n = pat.sub('***REDACTED***', c)
                if n != c:
                    with open(fp, 'w') as f: f.write(n)
            except: pass
"

# Add README
OC_VERSION=$(openclaw --version 2>/dev/null || echo "unknown")
cat > "$STAGING/README.md" << EOF
# EDNA OpenClaw - Workspace Backup

Automated backup of Enterprise DNA's OpenClaw workspace configuration.

**Last backup:** $TIMESTAMP
**Instance:** DigitalOcean droplet (209.38.29.185)
**OpenClaw version:** $OC_VERSION

## Contents
- \`workspace/\` — All workspace config files (SOUL.md, skills, agents, memory, etc.)
- \`workspace/openclaw.json\` — Gateway config (secrets redacted)

## Note
This branch contains only configuration/workspace files.
The \`main\` branch contains the original OpenClaw fork (legacy, not in use).
EOF

# Push to repo
cd "$REPO_DIR"

if git rev-parse --verify "$BACKUP_BRANCH" >/dev/null 2>&1; then
    git checkout "$BACKUP_BRANCH"
else
    git checkout --orphan "$BACKUP_BRANCH"
    git rm -rf . >/dev/null 2>&1 || true
fi

# Clean and copy staging
git rm -rf . >/dev/null 2>&1 || true
cp -r "$STAGING"/* .
cp -r "$STAGING"/workspace/ .

git add -A
if git diff --cached --quiet; then
    echo "No changes to backup."
    git checkout main
    exit 0
fi

git commit -m "backup: workspace snapshot $TIMESTAMP"
echo "Pushing to GitHub..."
git push origin "$BACKUP_BRANCH" --force

echo "=== Backup complete ==="
echo "View at: https://github.com/EDNAHQ/EDNA-OpenClaw/tree/workspace-backup"

git checkout main

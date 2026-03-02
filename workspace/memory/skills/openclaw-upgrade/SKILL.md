# OpenClaw Upgrade Skill

Upgrade the OpenClaw backend in the EDNA-OpenClaw fork while preserving custom UI commits.

## Prerequisites
- Repo: `/home/node/.openclaw/workspace/EDNA-OpenClaw`
- Remote `upstream` → `https://github.com/openclaw/openclaw.git`
- Remote `origin` → `https://github.com/EDNAHQ/EDNA-OpenClaw.git`
- Auto-deploy: GitHub push triggers DigitalOcean deployment
- **Never** hit "Update now" in the UI — always go through git

## Custom Files (do not lose these)
- `ui/src/ui/icons.ts`
- `ui/src/ui/navigation.ts`
- `ui/src/ui/views/login.ts`
- `ui/src/ui/app-render.ts`
- `ui/src/styles.css`
- `ui/src/styles/layout.css`
- `ui/src/styles/login.css`
- `.github/workflows/deploy.yml`

## Upgrade Steps

```bash
cd /home/node/.openclaw/workspace/EDNA-OpenClaw

# 1. Fetch latest upstream tags
git fetch upstream --tags

# 2. Identify current base and target
#    Current base = last upstream tag that HEAD descends from
#    Target = the new release tag (e.g. v2026.2.25)
git log --oneline v<NEW_TAG>..HEAD   # shows your custom commits on top

# 3. Rebase custom commits onto new tag
git rebase --onto v<NEW_TAG> v<OLD_TAG> main

# 4. Resolve any conflicts — always prefer our ui/ changes
#    Remove conflict markers, git add, git rebase --continue

# 5. Verify
git merge-base --is-ancestor v<NEW_TAG> HEAD  # should succeed
git log --oneline v<NEW_TAG>..HEAD             # should show only custom commits

# 6. Push (force needed due to rebase)
git push --force-with-lease origin main
```

## Finding OLD_TAG
The old tag is the upstream release your current HEAD is based on. Check with:
```bash
git log --oneline HEAD~8..HEAD~7  # the commit just before your custom ones
# Or: git log --oneline --ancestry-path v<CANDIDATE>..HEAD | tail -1
```

## Conflict Resolution
- Conflicts will almost always be in `ui/` files
- Our custom code wins — keep our additions, accept upstream structural changes
- Pattern: `<<<<<<< HEAD` = upstream, `>>>>>>>` = ours (during rebase, it's inverted from merge)
- After resolving: `git add <file> && GIT_EDITOR=true git rebase --continue`

## Current State (last upgrade: 2026-02-26)
- Base: `v2026.2.25`
- Custom commits: 7 (on top of v2026.2.25)

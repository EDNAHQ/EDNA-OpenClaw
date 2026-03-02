---
name: github
description: "GitHub repository management for EDNAHQ. Use for repo operations, issues, PRs, and code queries via the GitHub REST API."
---

# GitHub Skill — Enterprise DNA

## Auth
- **Token:** `GITHUB_TOKEN` env var (PAT with full repo access)
- **Account:** EDNAHQ (user account, not org)
- **`gh` CLI:** Not installed on sandbox — use GitHub REST API via `curl`

### API Pattern
```bash
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/...
```

## Repositories

### EDNAHQ
| Repo | Description |
|------|-------------|
| `EDNAHQ/EDNA-OpenClaw` | OpenClaw custom frontend |
| `EDNAHQ/EDNA-HQ-Main` | Main EDNA HQ project |
| `EDNAHQ/Content-Lead` | ContentLead.ai platform |
| `EDNAHQ/Command-Center` | Command Center |
| `EDNAHQ/Builder-Community` | Builder Community |
| `EDNAHQ/docs` | Documentation |
| `EDNAHQ/Help-Genie-Voice` | Help Genie Voice |
| `EDNAHQ/LearnFlow` | LearnFlow |
| `EDNAHQ/Power-Vibes` | Power Vibes |

### EnterpriseDNA
| Repo | Description |
|------|-------------|
| `EnterpriseDNA/analysthub2.0` | Analyst Hub 2.0 |

### Omni-Intelligence
| Repo | Description |
|------|-------------|
| `Omni-Intelligence/App-Idea-Engine` | App Idea Engine |
| `Omni-Intelligence/Echo-Assist` | Echo Assist |
| `Omni-Intelligence/echo-assistant` | Echo Assistant |
| `Omni-Intelligence/excel-helper` | Excel Helper |
| `Omni-Intelligence/extract-metadata` | Extract Metadata |
| `Omni-Intelligence/model-bim` | Model BIM |
| `Omni-Intelligence/simple-assistant` | Simple Assistant |

## Quick Commands

```bash
# List repos
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/user/repos?per_page=100 | grep full_name

# List issues on a repo
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/EDNAHQ/EDNA-OpenClaw/issues

# List PRs
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/EDNAHQ/EDNA-OpenClaw/pulls

# Get file contents
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/EDNAHQ/EDNA-OpenClaw/contents/README.md

# Create issue
curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"title":"Bug: something","body":"Details..."}' \
  https://api.github.com/repos/EDNAHQ/EDNA-OpenClaw/issues
```

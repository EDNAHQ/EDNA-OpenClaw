---
name: slack
description: "Slack integration for enterprisedna-hq workspace. Use for sending messages, reacting, pinning, and channel management in Slack."
---

# Slack Skill — Enterprise DNA

## Workspace
- **Workspace:** enterprisedna-hq
- **Bot name:** edna_claw (`U0AHUGEGQN5`)
- **Mode:** Socket mode

## Users
| Name | User ID | Handle |
|------|---------|--------|
| Sam McKay | `U0AF3U727R6` | @sam.mckay |

## Other Bots
| Name | User ID |
|------|---------|
| Cursor | `U0AHK9ZQ90U` |

## Channels
| Channel | ID | Purpose | Bot joined? |
|---------|-----|---------|-------------|
| `#all-ednahq` | `C0AE9KR3FC2` | Announcements & updates | ✅ Yes |
| `#new-channel` | `C0AED8B36FN` | Default/unused | ❌ No |
| `#social` | `C0AENHC2XSM` | Fun/social | ❌ No |

## Actions Reference

See built-in skill at `/app/skills/slack/SKILL.md` for full action docs. Quick reference:

| Action | Example |
|--------|---------|
| Send message | `action: sendMessage, to: "channel:C0AE9KR3FC2", content: "..."` |
| React | `action: react, channelId: "C0AE9KR3FC2", messageId: "...", emoji: "✅"` |
| Read messages | `action: readMessages, channelId: "C0AE9KR3FC2", limit: 20` |
| Pin | `action: pinMessage, channelId: "...", messageId: "..."` |
| Member info | `action: memberInfo, userId: "U0AF3U727R6"` |

## Conventions
- Use `#all-ednahq` for team announcements and updates
- Keep bot messages concise — no walls of text
- React to acknowledge messages when a full reply isn't needed
- Don't post to channels the bot hasn't joined without being asked

## TODO
- [ ] Add Angie and Anilyn's user IDs when they join
- [ ] Join `#social` if the team wants bot presence there

# OpenRouter Model Reference

_Last updated: 2026-02-24_

Quick reference for the best models available via OpenRouter. Use these when spawning agents or switching models for specific tasks.

---

## 🏆 Tier 1 — Frontier (Best Quality)

### Anthropic Claude Opus 4.6
- **ID:** `anthropic/claude-opus-4.6`
- **Context:** 1M tokens | **Output:** 128K
- **Price:** $5/M in, $25/M out
- **Best for:** Complex coding, long-running tasks, deep reasoning, multi-step agents
- **Note:** We use this directly via Anthropic API for EDNA Claw. Available on OR too.

### Anthropic Claude Sonnet 4.6
- **ID:** `anthropic/claude-sonnet-4.6`
- **Context:** 1M tokens | **Output:** 128K
- **Price:** $3/M in, $15/M out
- **Best for:** Coding, agents, iterative dev, document creation, computer use
- **Note:** Best Sonnet yet. Great balance of quality/cost for most agent work.

### Google Gemini 3.1 Pro Preview
- **ID:** `google/gemini-3.1-pro-preview`
- **Context:** 1M tokens | **Output:** 65K
- **Price:** $2/M in, $12/M out
- **Best for:** Multimodal (text+image+audio+video), agentic coding, financial modeling, spreadsheet automation
- **Note:** Supports reasoning. Medium thinking level for cost/speed balance.

### OpenAI GPT-5.2 Codex
- **ID:** `openai/gpt-5.2-codex`
- **Context:** 400K tokens | **Output:** 128K
- **Price:** $1.75/M in, $14/M out
- **Best for:** Software engineering, multi-hour coding tasks, code review, refactoring
- **Note:** Purpose-built for agentic coding. Adjustable reasoning effort.

---

## 🥈 Tier 2 — Strong & Cost-Effective

### Qwen 3.5 Plus
- **ID:** `qwen/qwen3.5-plus-02-15`
- **Context:** 1M tokens | **Output:** 65K
- **Price:** $0.40/M in, $2.40/M out ← **very cheap**
- **Best for:** General tasks, multimodal (text+image+video), reasoning
- **Note:** Incredible value. 1M context at fraction of frontier cost.

### Qwen 3.5 397B (MoE)
- **ID:** `qwen/qwen3.5-397b-a17b`
- **Context:** 262K tokens | **Output:** 65K
- **Price:** $0.55/M in, $3.50/M out
- **Best for:** Coding, reasoning, agents, GUI interaction, video understanding
- **Note:** Open-source frontier. 397B total, 17B active per token.

### MiniMax M2.5
- **ID:** `minimax/minimax-m2.5`
- **Context:** 196K tokens | **Output:** 65K
- **Price:** $0.30/M in, $1.10/M out ← **very cheap**
- **Best for:** Coding (80.2% SWE-Bench!), office tasks (Word/Excel/PowerPoint), multi-agent
- **Note:** Insane SWE-Bench score for the price. Great for grunt coding work.

### Kimi K2.5
- **ID:** `moonshotai/kimi-k2.5`
- **Context:** 262K tokens | **Output:** 65K
- **Price:** $0.45/M in, $2.20/M out
- **Best for:** Visual coding, multimodal, agentic tool-calling
- **Note:** Strong reasoning + vision. Good for UI/frontend work.

### Qwen 3 Max Thinking
- **ID:** `qwen/qwen3-max-thinking`
- **Context:** 262K tokens | **Output:** 32K
- **Price:** $1.20/M in, $6/M out
- **Best for:** Deep multi-step reasoning, complex analysis
- **Note:** Flagship reasoning model with extended thinking.

---

## ⚡ Tier 3 — Fast & Cheap (Grunt Work)

### Qwen 3 Coder Next (MoE 80B/3B active)
- **ID:** `qwen/qwen3-coder-next`
- **Context:** 256K tokens | **Output:** 65K
- **Price:** $0.12/M in, $0.75/M out ← **dirt cheap**
- **Best for:** Coding agents, tool use, CLI/IDE integration
- **Note:** Optimized for coding agents. No-thinking mode. Incredibly cheap.

### MiniMax M2.1
- **ID:** `minimax/minimax-m2.1`
- **Context:** TBD | **Output:** TBD
- **Price:** ~cheap
- **Best for:** Coding, multilingual, lightweight agentic tasks

### Z.ai GLM 4.7 Flash
- **ID:** `z-ai/glm-4.7-flash`
- **Context:** 202K tokens | **Output:** large
- **Price:** $0.06/M in, $0.40/M out ← **extremely cheap**
- **Best for:** Agentic coding, tool collaboration, long-horizon planning
- **Note:** 30B-class model, SOTA for its size.

### ByteDance Seed 1.6 Flash
- **ID:** `bytedance-seed/seed-1.6-flash`
- **Context:** 256K tokens | **Output:** 32K
- **Price:** $0.075/M in, $0.30/M out ← **extremely cheap**
- **Best for:** Multimodal (text+image+video), quick analysis
- **Note:** Ultra-fast with deep thinking. Great for cheap vision tasks.

### StepFun Step 3.5 Flash
- **ID:** `stepfun/step-3.5-flash`
- **Context:** 256K tokens | **Output:** 256K
- **Price:** $0.10/M in, $0.30/M out
- **Best for:** Reasoning at speed, long context
- **Note:** Also available FREE: `stepfun/step-3.5-flash:free`

---

## 🆓 Free Models (Rate-Limited)

| Model | ID | Context | Good For |
|-------|-----|---------|----------|
| Free Router | `openrouter/free` | 200K | Random free model selection |
| Step 3.5 Flash | `stepfun/step-3.5-flash:free` | 256K | Reasoning, long context |
| Arcee Trinity Large | `arcee-ai/trinity-large-preview:free` | 131K | Creative, roleplay, agentic coding |
| LiquidAI 1.2B Thinking | `liquid/lfm-2.5-1.2b-thinking:free` | 32K | Light reasoning, edge tasks |

---

## 🎯 Recommended Model by Task

| Task | Model | Why |
|------|-------|-----|
| **Heavy coding/refactoring** | Claude Opus 4.6 or GPT-5.2 Codex | Best quality, long-running tasks |
| **Standard coding agents** | Claude Sonnet 4.6 or MiniMax M2.5 | Quality vs cost sweet spot |
| **Cheap bulk coding** | Qwen 3 Coder Next or GLM 4.7 Flash | Pennies per task |
| **Code review** | Claude Sonnet 4.6 | Catches subtle issues |
| **Research/analysis** | Gemini 3.1 Pro or Qwen 3.5 Plus | Multimodal, huge context |
| **Data/spreadsheets** | Gemini 3.1 Pro or MiniMax M2.5 | Excel/spreadsheet native |
| **Vision/UI work** | Kimi K2.5 or Gemini 3.1 Pro | Visual coding, screenshots |
| **Deep reasoning** | Qwen 3 Max Thinking | Extended thinking chains |
| **Pipeline/monitoring** | GLM 4.7 Flash or Seed 1.6 Flash | Cheap, fast, good enough |
| **Prospecting/outreach** | Qwen 3.5 Plus | Cheap, 1M context, solid quality |

---

## 💡 Cost Comparison (per 1M tokens, input/output)

| Model | Input | Output | Relative Cost |
|-------|-------|--------|---------------|
| Claude Opus 4.6 | $5.00 | $25.00 | 💰💰💰💰💰 |
| GPT-5.2 Codex | $1.75 | $14.00 | 💰💰💰💰 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 💰💰💰💰 |
| Gemini 3.1 Pro | $2.00 | $12.00 | 💰💰💰 |
| Qwen 3 Max Thinking | $1.20 | $6.00 | 💰💰💰 |
| Qwen 3.5 397B | $0.55 | $3.50 | 💰💰 |
| Qwen 3.5 Plus | $0.40 | $2.40 | 💰💰 |
| Kimi K2.5 | $0.45 | $2.20 | 💰💰 |
| MiniMax M2.5 | $0.30 | $1.10 | 💰 |
| Qwen 3 Coder Next | $0.12 | $0.75 | 💰 |
| GLM 4.7 Flash | $0.06 | $0.40 | 🪙 |
| Seed 1.6 Flash | $0.075 | $0.30 | 🪙 |
| Step 3.5 Flash | $0.10 | $0.30 | 🪙 |

---

## How to Use via OpenRouter

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "MODEL_ID_HERE", "messages": [...]}'
```

OpenRouter is OpenAI-compatible, so any SDK that supports custom base URLs works.

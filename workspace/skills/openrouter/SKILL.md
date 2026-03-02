---
name: openrouter
description: "OpenRouter LLM gateway. Access hundreds of models (GPT-4o, Claude, Gemini, DeepSeek, etc.) via OpenAI-compatible API. Used for sub-agent model routing."
---

# OpenRouter Skill

## What It Is
OpenRouter is an LLM gateway — one API key, access to hundreds of models (GPT-4o, Claude, Gemini, Llama, Mistral, DeepSeek, etc). OpenAI-compatible API format.

## Auth
- **Token:** `OPENROUTER_API_KEY` env var
- **Tier:** Paid (no spend cap, no rate limit)
- **Base URL:** `https://openrouter.ai/api/v1`

## API Pattern

OpenRouter uses the OpenAI chat completions format:

```bash
curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Top Models (by weekly usage, Feb 2026)

| Model ID | Provider | Input $/1M | Output $/1M | Context | Best For |
|----------|----------|-----------|------------|---------|----------|
| `minimax/minimax-m2.5` | MiniMax | $0.295 | $1.20 | 196K | SOTA general + coding (80.2% SWE-Bench), token-efficient, planning |
| `google/gemini-3-flash-preview` | Google | $0.50 | $3.00 | 1M | Multimodal (text/image/audio/video/PDF), configurable reasoning levels, agentic coding |
| `deepseek/deepseek-v3.2` | DeepSeek | $0.25 | $0.40 | 164K | Cheapest high-quality option, strong reasoning (GPT-5 class), agentic tool use |
| `x-ai/grok-4.1-fast` | xAI | $0.20 | $0.50 | 2M | Best agentic tool calling, customer support, deep research, massive 2M context |
| `moonshotai/kimi-k2.5` | MoonshotAI | $0.45 | $2.20 | 262K | Native multimodal, visual coding, self-directed agent swarms |
| `z-ai/glm-5` | Z.ai | $0.95 | $2.55 | 205K | Complex systems design, long-horizon agent workflows, full-system construction |

### Other Notable Models

| Model ID | Provider | Input $/1M | Output $/1M | Context |
|----------|----------|-----------|------------|---------|
| `openai/gpt-4o` | OpenAI | $2.50 | $10.00 | 128K |
| `anthropic/claude-sonnet-4` | Anthropic | $3.00 | $15.00 | 200K |
| `anthropic/claude-opus-4` | Anthropic | $15.00 | $75.00 | 200K |
| `google/gemini-2.5-pro` | Google | $1.25 | $10.00 | 1M |
| `deepseek/deepseek-r1` | DeepSeek | $0.55 | $2.19 | 164K |
| `meta-llama/llama-4-maverick` | Meta | $0.20 | $0.60 | 1M |

### Model Selection Guide

- **Cheapest general use:** `deepseek/deepseek-v3.2` or `x-ai/grok-4.1-fast`
- **Best for coding:** `minimax/minimax-m2.5` (top SWE-Bench scores)
- **Largest context window:** `x-ai/grok-4.1-fast` (2M tokens)
- **Multimodal (images/video/audio):** `google/gemini-3-flash-preview` or `moonshotai/kimi-k2.5`
- **Agentic tool use:** `x-ai/grok-4.1-fast` or `deepseek/deepseek-v3.2`
- **Complex systems/architecture:** `z-ai/glm-5`
- **Budget reasoning model:** `deepseek/deepseek-r1`

For full model list: `curl -s https://openrouter.ai/api/v1/models`

## Common Operations

```bash
# Check available credits / usage
curl -s -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/auth/key

# List available models
curl -s https://openrouter.ai/api/v1/models | python3 -c "
import json,sys
for m in json.load(sys.stdin)['data']:
    print(f\"{m['id']:50s} \${float(m.get('pricing',{}).get('prompt','0'))*1000000:.2f}/M tok\")
" | head -30

# Chat completion with streaming
curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o",
    "stream": true,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Use Cases
- **Compare models** — run the same prompt through different LLMs
- **Fallback** — if primary Anthropic/OpenAI keys hit limits
- **Access models** we don't have direct keys for (Gemini, DeepSeek, Llama, Mistral)
- **Cost optimization** — route to cheaper models for simple tasks

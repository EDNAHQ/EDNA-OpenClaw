---
name: replicate
description: "Replicate API for running AI models — image generation, video generation, audio, and vision. Use for media creation tasks."
---

# Replicate Skill

## What It Is
Replicate is an API platform for running AI models — primarily image generation, video generation, audio, and vision models. One API key, access to thousands of models.

## Auth
- **Token:** `REPLICATE_API_TOKEN` env var
- **Account:** EDNA HQ (organization: `edna_hq`)
- **Base URL:** `https://api.replicate.com/v1`

## API Pattern

Replicate uses an async prediction model — you create a prediction, then poll for the result.

```bash
# Create a prediction
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/flux-pro",
    "input": {"prompt": "a photo of a cat"}
  }'

# Poll for result (use the URL from the response)
curl -s -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/predictions/<prediction_id>
```

### Shortcut: Wait for result (sync)
Append `?wait=60` (seconds) to block until complete:
```bash
curl -s -X POST "https://api.replicate.com/v1/predictions?wait=60" \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/flux-pro",
    "input": {"prompt": "a photo of a cat"}
  }'
```

## Image Models

### Best Picks
| Model | Best For |
|-------|----------|
| `openai/gpt-image-1.5` | **Best overall** — best instruction following and prompt adherence |
| `google/nano-banana-pro` | **Best from Google** — SOTA image gen + editing (15.8M runs) |
| `black-forest-labs/flux-2-max` | **Best from BFL** — highest fidelity Flux model |
| `recraft-ai/recraft-v4-svg` | **Best for SVGs** — production-ready vector graphics |

### Featured Models
| Model | What It Does |
|-------|-------------|
| `black-forest-labs/flux-2-flex` | Max-quality gen + editing, supports 10 reference images |
| `black-forest-labs/flux-2-pro` | High-quality gen + editing, supports 8 reference images |
| `bytedance/seedream-4` | Text-to-image + single-sentence editing, up to 4K resolution (28.1M runs) |

### Fast / Production Models
| Model | What It Does |
|-------|-------------|
| `prunaai/z-image-turbo` | Super fast 6B param model (30.2M runs) |
| `prunaai/p-image` | Sub-1-second generation, built for production (4.8M runs) |
| `prunaai/hidream-l1-fast` | Optimised HiDream model (8.1M runs) |
| `google/imagen-4-fast` | Fast Imagen 4 — speed + cost optimised |

### Premium Quality Models
| Model | What It Does |
|-------|-------------|
| `google/imagen-4` | Google's Imagen 4 flagship (7.7M runs) |
| `google/imagen-4-ultra` | Ultra quality Imagen 4 — when quality > speed/cost (1.5M runs) |
| `recraft-ai/recraft-v4` | Design-focused, strong prompt accuracy, text rendering, cost-efficient |
| `recraft-ai/recraft-v4-pro` | Higher res (~2048px) for print-ready / large-scale work |
| `recraft-ai/recraft-v4-pro-svg` | Detailed SVG vectors with finer paths and clean layers |

### LoRA / Custom
| Model | What It Does |
|-------|-------------|
| `prunaai/p-image-lora` | Use trained LoRAs from p-image-trainer |

## Video Models

| Model | Best For |
|-------|----------|
| `google/veo-3` | Google's best video gen, high quality + audio |
| `kling-ai/kling-v2.6` | Top-tier image-to-video, cinematic, native audio |
| `minimax/video-01-live` | MiniMax video generation |
| `wan-ai/wan-2.1` | Open-source video gen |

## Common Operations

### Generate an Image
```bash
curl -s -X POST "https://api.replicate.com/v1/predictions?wait=60" \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/flux-pro",
    "input": {
      "prompt": "professional headshot photo, studio lighting",
      "aspect_ratio": "1:1"
    }
  }'
```

### Generate a Video from Text
```bash
curl -s -X POST "https://api.replicate.com/v1/predictions" \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/veo-3",
    "input": {
      "prompt": "A drone flying over mountains at sunset"
    }
  }'
```

### Generate a Video from Image
```bash
curl -s -X POST "https://api.replicate.com/v1/predictions" \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kling-ai/kling-v2.6",
    "input": {
      "prompt": "Camera slowly zooms in",
      "image": "https://example.com/photo.jpg"
    }
  }'
```

### Check Prediction Status
```bash
curl -s -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/predictions/<prediction_id>
```

### List Recent Predictions
```bash
curl -s -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/predictions?limit=10
```

## Model Selection Guide

### Images
- **Best overall:** `openai/gpt-image-1.5`
- **Best quality + editing:** `google/nano-banana-pro`
- **Highest fidelity:** `black-forest-labs/flux-2-max`
- **With reference images:** `black-forest-labs/flux-2-flex` (up to 10 refs)
- **4K resolution:** `bytedance/seedream-4`
- **Fastest / production:** `prunaai/p-image` (sub-1s) or `prunaai/z-image-turbo`
- **SVG / vector:** `recraft-ai/recraft-v4-svg`
- **Print-ready / large:** `recraft-ai/recraft-v4-pro`

### Videos
- **Best video quality:** `google/veo-3`
- **Image-to-video:** `kling-ai/kling-v2.6`
- **Budget video:** `wan-ai/wan-2.1`

## Notes
- Video models can take minutes to run — use async polling, don't use `?wait=60`
- Image models are usually fast enough for sync (`?wait=60`)
- Output is a URL to the generated file — download or pass it along
- Results are temporary — download/save outputs you want to keep

#!/usr/bin/env python3
"""Fetch OpenRouter models and build a curated catalog file."""
import json, urllib.request, datetime, os

CATALOG_PATH = os.path.join(os.path.dirname(__file__), '..', 'MODEL-CATALOG.md')

resp = urllib.request.urlopen("https://openrouter.ai/api/v1/models")
data = json.loads(resp.read())
models = data.get('data', [])

results = []
for m in models:
    p = m.get('pricing', {})
    inp = float(p.get('prompt', '0') or '0') * 1_000_000
    out = float(p.get('completion', '0') or '0') * 1_000_000
    ctx = m.get('context_length', 0)
    if inp <= 0 or out <= 0:
        continue
    results.append({
        'id': m['id'],
        'name': m.get('name', m['id']),
        'input': round(inp, 3),
        'output': round(out, 3),
        'context': ctx,
    })

results.sort(key=lambda x: x['input'])

# Build tiers
def tier(label, filtered, max_count=10):
    lines = [f"\n## {label}\n"]
    lines.append("| Model ID | Name | $/M In | $/M Out | Context |")
    lines.append("|----------|------|--------|---------|---------|")
    for r in filtered[:max_count]:
        lines.append(f"| `{r['id']}` | {r['name']} | ${r['input']:.3f} | ${r['output']:.3f} | {r['context']//1000}k |")
    return "\n".join(lines)

ultra_cheap = [r for r in results if r['input'] <= 0.05 and r['context'] >= 16000]
cheap = [r for r in results if 0.05 < r['input'] <= 0.15 and r['context'] >= 32000]
mid = [r for r in results if 0.15 < r['input'] <= 1.0 and r['context'] >= 32000]
heavy = [r for r in results if r['input'] > 1.0 and r['context'] >= 32000]
big_context = sorted([r for r in results if r['context'] >= 500000], key=lambda x: x['input'])

now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')

doc = f"""# MODEL-CATALOG.md
_Auto-generated {now} from OpenRouter API. {len(results)} models indexed._

Use `openrouter/` prefix when passing model IDs to sub-agents.

{tier("Ultra-Cheap (≤$0.05/M input)", ultra_cheap, 15)}

{tier("Cheap ($0.05–$0.15/M input, ≥32k ctx)", cheap, 15)}

{tier("Mid-Range ($0.15–$1.00/M input)", mid, 15)}

{tier("Heavy/Premium (>$1.00/M input)", heavy, 15)}

{tier("Big Context (≥500k)", big_context, 15)}

## Quick Reference for Sub-Agent Routing
- *Ultra-cheap tasks* (summaries, formatting, simple lookups): pick from Ultra-Cheap tier
- *General sub-agents* (research, drafts, data work): Cheap tier — Qwen3.5-Flash, GPT-4.1 Nano, Gemini 2.0 Flash
- *Coding*: MiniMax M2.5 or Devstral or Qwen3-Coder
- *Heavy reasoning*: Mid-Range tier before reaching for Opus
- *Long documents*: Big Context tier
"""

with open(CATALOG_PATH, 'w') as f:
    f.write(doc)

print(f"Wrote catalog with {len(results)} models to {CATALOG_PATH}")

import json, sys

data = json.load(sys.stdin)
models = data.get('data', [])

results = []
for m in models:
    p = m.get('pricing', {})
    inp = float(p.get('prompt', '0') or '0') * 1_000_000
    out = float(p.get('completion', '0') or '0') * 1_000_000
    ctx = m.get('context_length', 0)
    if inp == 0 and out == 0:
        continue
    results.append({
        'id': m['id'],
        'name': m.get('name', m['id']),
        'input': round(inp, 3),
        'output': round(out, 3),
        'context': ctx,
    })

results.sort(key=lambda x: x['input'])

for r in results[:100]:
    print(f"{r['id']}|{r['name']}|${r['input']}/M in|${r['output']}/M out|{r['context']//1000}k ctx")

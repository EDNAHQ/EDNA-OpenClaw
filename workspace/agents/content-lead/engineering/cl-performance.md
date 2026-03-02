# SCOPE: Content Lead repos ONLY (EDNAHQ/Content-Lead, EDNAHQ/Help-Genie-Voice)
# Read agents/content-lead/engineering/README.md for business context

# Performance Agent

## Role
Monitor and optimize performance across all apps — database queries, bundle size, rendering, API response times.

## Context
- Read `INFRASTRUCTURE.md` for repo/tech stack details
- All apps use Supabase (Postgres) — query optimization is key
- Frontend: React + Vite — bundle splitting and lazy loading matter
- Supabase credentials in `.env`

## What You Optimize

### Database (Supabase/Postgres)
1. **Slow queries** — find N+1 patterns, missing indexes, unfiltered selects
2. **RLS performance** — policies that scan too many rows
3. **Index analysis** — suggest indexes for common query patterns
4. **Connection usage** — connection pooling via Supabase pooler

### Frontend Bundle
1. **Bundle size** — large dependencies, missing tree-shaking
2. **Code splitting** — lazy routes, dynamic imports for heavy components
3. **Image optimization** — uncompressed images, missing lazy loading
4. **Rendering** — unnecessary re-renders, missing React.memo/useMemo

### API & Network
1. **Waterfall requests** — sequential calls that could be parallel
2. **Caching** — Tanstack Query staleTime/cacheTime configuration
3. **Prefetching** — preload data for likely next navigations

## How to Analyze

### Database Performance
```bash
source /home/node/.openclaw/workspace/.env

# Check table sizes
node -e "
const {Client} = require('pg');
const c = new Client({connectionString: process.env.SUPABASE_DB_URL});
c.connect().then(() => c.query(\`
  SELECT schemaname, tablename, 
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_live_tup as row_count
  FROM pg_stat_user_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
\`)).then(r => { console.table(r.rows); c.end(); })
"

# Check missing indexes
node -e "
const {Client} = require('pg');
const c = new Client({connectionString: process.env.SUPABASE_DB_URL});
c.connect().then(() => c.query(\`
  SELECT relname, seq_scan, idx_scan, n_live_tup
  FROM pg_stat_user_tables
  WHERE seq_scan > idx_scan AND n_live_tup > 1000
  ORDER BY seq_scan - idx_scan DESC
\`)).then(r => { console.table(r.rows); c.end(); })
"
```

### Frontend Bundle
```bash
cd /home/node/.openclaw/workspace/repos/{repo}
npm run build 2>&1  # Check output sizes
# Look for large chunks in dist/assets/
ls -lhS dist/assets/*.js 2>/dev/null | head -10
```

### Code Analysis
```bash
# Find large component files (potential split candidates)
find src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -20

# Find heavy imports
grep -r "import.*from" src/ | grep -E "(lodash|moment|xlsx|three|framer)" | head -20
```

## Output Format
```markdown
## Performance Report: [repo]

### Database
- Table sizes and row counts
- Missing indexes: [list with recommended indexes]
- Slow query patterns: [list]

### Bundle
- Total build size: X MB
- Largest chunks: [list]
- Optimization opportunities: [list]

### Rendering
- Components with potential re-render issues: [list]

### Recommendations (prioritized)
1. [Highest impact] — estimated improvement
2. [Medium impact] — estimated improvement
3. [Low-hanging fruit] — quick win
```

## Rules
- Always measure before suggesting changes — no premature optimization
- Prioritize by impact — database indexes > bundle splitting > micro-optimizations
- Be specific about expected improvement ("~200ms faster" not "faster")
- Don't suggest changes that hurt readability for marginal gains
- Supabase pooler connection string for queries, not direct connection

---
name: supabase
description: "Generic Supabase connection patterns. PostgREST API, direct Postgres, auth headers. Referenced by database-specific skills like edna-crm."
---

# Supabase Skill

Generic skill for connecting to Supabase projects. Database-specific skills reference this for shared patterns.

## Connection Pattern
Each Supabase project needs:
- **URL:** `https://<ref>.supabase.co`
- **Service Role Key:** Full read/write access (bypass RLS)
- **DB URL (optional):** Direct Postgres connection for DDL/schema changes

## API: PostgREST (`/rest/v1/`)

### Headers
```
apikey: <service_role_key>
Authorization: Bearer <service_role_key>
Content-Type: application/json
```

### Common Operations

**Select:**
```bash
curl "$URL/rest/v1/<table>?select=*&order=created_at.desc&limit=10"
```

**Filter:**
```bash
# Equals
?column=eq.value
# Greater than
?column=gt.100
# In list
?column=in.(a,b,c)
# Full-text search
?column=ilike.*search*
# Array contains
?tags=cs.{tag1}
```

**Insert:**
```bash
curl -X POST "$URL/rest/v1/<table>" \
  -H "Prefer: return=representation" \
  -d '{"col": "value"}'
```

**Bulk insert:**
```bash
curl -X POST "$URL/rest/v1/<table>" \
  -H "Prefer: return=representation" \
  -d '[{"col": "a"}, {"col": "b"}]'
```

**Upsert (dedupe):**
```bash
curl -X POST "$URL/rest/v1/<table>" \
  -H "Prefer: return=representation,resolution=merge-duplicates" \
  -d '[...]'
```

**Update (PATCH, never PUT):**
```bash
curl -X PATCH "$URL/rest/v1/<table>?id=eq.<uuid>" \
  -H "Prefer: return=representation" \
  -d '{"col": "new_value"}'
```

**Delete (always with filter):**
```bash
curl -X DELETE "$URL/rest/v1/<table>?id=eq.<uuid>"
```

**Joins:**
```bash
# Get parent with children
?select=*,children_table(*)
# Get child with parent
?select=*,parent_table(col1,col2)
```

## Direct SQL (Schema Changes)
Use the `pg` npm module with the project's DB URL:
```javascript
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.<DB_URL_VAR> });
await c.connect();
await c.query('ALTER TABLE x ADD COLUMN IF NOT EXISTS y text');
await c.end();
```

## Connected Projects

| Project | Ref | Env Vars | Database Skill |
|---------|-----|----------|---------------|
| EDNA CRM | aaheuncnheyqnuoyzokp | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` | `edna-crm` |

## Safety Rules
- **PATCH** for updates, never PUT
- **Always filter** deletes — never delete without a WHERE clause
- Use `return=representation` to see what was affected
- Service role bypasses RLS — be careful with writes

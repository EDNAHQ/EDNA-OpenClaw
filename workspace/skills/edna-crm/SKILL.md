---
name: edna-crm
description: "Enterprise DNA CRM on Supabase. Query and manage companies, contacts, deals, and interactions. Use for customer lookups, pipeline queries, and CRM operations."
---

# EDNA CRM Database Skill

Enterprise DNA's CRM database on Supabase. For generic Supabase patterns, see `supabase/SKILL.md`.

## Connection
- **Project:** EDNA CRM (`aaheuncnheyqnuoyzokp`)
- **URL:** `$SUPABASE_URL` (https://aaheuncnheyqnuoyzokp.supabase.co)
- **Auth:** `$SUPABASE_SERVICE_ROLE_KEY` (service_role — full read/write)
- **Direct DB:** `$SUPABASE_DB_URL` (Postgres via pooler — for DDL/schema changes)
- **API:** PostgREST via `/rest/v1/` (see `supabase/SKILL.md` for patterns)

## Tables

### companies
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| business | text (required) | "enterprise_dna" or "contentlead" |
| name | text (required) | company name |
| domain | text | website domain |
| industry | text | |
| size | text | e.g. "1-10", "11-50", "51-200" |
| location | text | |
| description | text | |
| icp_fit_score | integer | 1-100, ideal customer profile fit |
| source | text | how we found them |
| status | text | default "prospect" — prospect/qualified/customer/churned |
| tags | text[] | |
| metadata | jsonb | flexible extra data |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |

### contacts
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| company_id | uuid (FK→companies) | |
| business | text (required) | "enterprise_dna" or "contentlead" |
| name | text (required) | |
| email | text | |
| phone | text | |
| role | text | job title/role |
| linkedin_url | text | |
| is_decision_maker | boolean | default false |
| stripe_customer_id | text (unique) | Stripe `cus_xxx` — primary lookup key |
| country | text | 2-letter country code from Stripe |
| currency | text | default "usd" |
| subscription_status | text | default "none" — active/trialing/churned/none |
| plan_name | text | human-readable plan name |
| total_spend_cents | bigint | default 0 — lifetime spend in cents |
| last_payment_at | timestamptz | most recent successful charge |
| subscription_started_at | timestamptz | current subscription start date |
| is_delinquent | boolean | default false — failed payment flag |
| tags | text[] | |
| metadata | jsonb | flexible extra data |
| created_at / updated_at | timestamptz | auto |

### deals
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| company_id | uuid (FK→companies) | |
| contact_id | uuid (FK→contacts) | |
| business | text (required) | |
| title | text (required) | deal name |
| value_cents | bigint | amount in cents |
| currency | text | default "USD" |
| stage | text | default "prospecting" — prospecting/qualified/proposal/negotiation/won/lost |
| probability | integer | 0-100 |
| expected_close_date | date | |
| owner_agent | text | who owns this deal |
| notes | text | |
| lost_reason | text | if stage=lost |
| metadata | jsonb | |
| created_at / updated_at | timestamptz | auto |

### interactions
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| company_id | uuid (FK→companies) | |
| contact_id | uuid (FK→contacts) | |
| deal_id | uuid (FK→deals) | |
| business | text (required) | |
| type | text (required) | email/call/meeting/note/demo/support |
| subject | text | |
| body | text | |
| agent | text | who did this (team member or "edna") |
| outcome | text | |
| metadata | jsonb | |
| created_at | timestamptz | auto |

## Useful Queries

### Look up customer by email
```bash
curl "$SUPABASE_URL/rest/v1/contacts?email=eq.user@example.com&select=*"
```

### Look up by Stripe ID
```bash
curl "$SUPABASE_URL/rest/v1/contacts?stripe_customer_id=eq.cus_xxx&select=*"
```

### Active customers sorted by spend
```bash
curl "$SUPABASE_URL/rest/v1/contacts?subscription_status=eq.customer&order=total_spend_cents.desc&limit=20"
```

### Churned high-value customers (win-back targets)
```bash
curl "$SUPABASE_URL/rest/v1/contacts?subscription_status=eq.churned&total_spend_cents=gte.10000&order=total_spend_cents.desc"
```

### Delinquent customers (at-risk)
```bash
curl "$SUPABASE_URL/rest/v1/contacts?is_delinquent=eq.true&select=name,email,plan_name,total_spend_cents"
```

### Customers by country
```bash
curl "$SUPABASE_URL/rest/v1/contacts?country=eq.US&business=eq.enterprise_dna&order=created_at.desc"
```

### Get company with contacts and deals
```bash
curl "$SUPABASE_URL/rest/v1/companies?select=*,contacts(*),deals(*)&id=eq.UUID"
```

### Insert a contact (with Stripe data)
```bash
curl -X POST "$SUPABASE_URL/rest/v1/contacts" \
  -H "Prefer: return=representation" \
  -d '{"business":"enterprise_dna","name":"Jane Doe","email":"jane@example.com","stripe_customer_id":"cus_xxx","subscription_status":"customer","plan_name":"Yearly EDNA Learn Pro Subscription","total_spend_cents":57000,"country":"US","currency":"usd"}'
```

### Upsert contacts (bulk, dedupe on stripe_customer_id)
```bash
curl -X POST "$SUPABASE_URL/rest/v1/contacts" \
  -H "Prefer: return=representation,resolution=merge-duplicates" \
  -H "on_conflict=stripe_customer_id" \
  -d '[...]'
```

## Schema Changes
Use `$SUPABASE_DB_URL` with the `pg` npm module for DDL:
```javascript
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.SUPABASE_DB_URL });
await c.connect();
await c.query('ALTER TABLE contacts ADD COLUMN IF NOT EXISTS new_col text');
await c.end();
```

## Business Values
- `enterprise_dna` — Enterprise DNA customers/prospects
- `contentlead` — ContentLead customers/prospects

## Safety Rules
- Always include `business` field when inserting
- Use PATCH for updates (not PUT)
- Always filter deletes — never delete without a WHERE clause
- Log significant interactions (emails sent, calls made, demos given)
- Upsert on `stripe_customer_id` to avoid duplicates when syncing from Stripe

# CRM Reference — All Agents Read This

## Database
- **Supabase project:** aaheuncnheyqnuoyzokp (ap-northeast-1)
- **REST API:** https://aaheuncnheyqnuoyzokp.supabase.co
- **Credentials:** In workspace `.env` (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL)

## How to Query

### Via REST API (preferred for reads/writes)
```bash
SUPABASE_URL="https://aaheuncnheyqnuoyzokp.supabase.co"
SUPABASE_KEY="$(grep SUPABASE_SERVICE_ROLE_KEY /home/node/.openclaw/workspace/.env | cut -d= -f2)"

# Read
curl -s "$SUPABASE_URL/rest/v1/companies?business=eq.content_lead&select=*" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"

# Insert
curl -s -X POST "$SUPABASE_URL/rest/v1/companies" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"business":"content_lead","name":"Company","domain":"example.com"}'

# Update
curl -s -X PATCH "$SUPABASE_URL/rest/v1/companies?id=eq.UUID_HERE" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"qualified"}'
```

### Via Direct SQL (for complex queries, schema changes)
```javascript
const {Client} = require('pg');
const c = new Client({connectionString: process.env.SUPABASE_DB_URL});
await c.connect();
const result = await c.query('SELECT * FROM companies WHERE business = $1', ['content_lead']);
console.table(result.rows);
await c.end();
```

## Schema

### companies
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| business | text | `'content_lead'` or `'enterprise_dna'` |
| name | text | Company name |
| domain | text | Website URL |
| industry | text | Industry classification |
| size | text | startup/smb/mid-market/enterprise |
| location | text | Country/region |
| description | text | What they do |
| icp_fit_score | integer | 0-100 fit score |
| source | text | How we found them |
| status | text | prospect/lead/qualified/customer/lost |
| tags | text[] | Categorization tags |
| metadata | jsonb | Flexible extra data (tech stack, social platforms, etc.) |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

### contacts
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | FK → companies |
| business | text | `'content_lead'` or `'enterprise_dna'` |
| name | text | Full name |
| email | text | Email address |
| phone | text | Phone number |
| role | text | Job title |
| linkedin_url | text | LinkedIn profile |
| is_decision_maker | boolean | Can they buy? |
| tags | text[] | Tags |
| metadata | jsonb | Extra data |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

### deals
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | FK → companies |
| contact_id | uuid | FK → contacts |
| business | text | `'content_lead'` or `'enterprise_dna'` |
| title | text | Deal name |
| value_cents | bigint | Value in cents |
| currency | text | Default 'USD' |
| stage | text | prospect/lead/qualified/proposal/negotiation/closed_won/closed_lost |
| probability | integer | 0-100% |
| expected_close_date | date | When we expect to close |
| owner_agent | text | Which agent owns this deal |
| notes | text | Free text |
| lost_reason | text | Why we lost (if closed_lost) |
| metadata | jsonb | Extra data |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

### interactions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| company_id | uuid | FK → companies |
| contact_id | uuid | FK → contacts (nullable) |
| deal_id | uuid | FK → deals (nullable) |
| business | text | `'content_lead'` or `'enterprise_dna'` |
| type | text | email/call/linkedin/meeting/note/listing/content/social |
| subject | text | Brief description |
| body | text | Full content (email text, notes, etc.) |
| agent | text | Which agent did this |
| outcome | text | Result (sent/delivered/opened/replied/no_reply/etc.) |
| metadata | jsonb | Extra data |
| created_at | timestamptz | Auto |

## Business Filters
**CRITICAL:** Every query MUST filter by business:
- Content Lead agents: `business = 'content_lead'`
- Enterprise DNA agents: `business = 'enterprise_dna'`
- **Never mix data between businesses**

## Using Interactions for Marketing Tracking
The `interactions` table isn't just for sales — use it to track ALL outreach:
- `type: 'listing'` — directory submission (G2, Capterra, etc.)
- `type: 'content'` — blog post published, case study created
- `type: 'social'` — social media post published
- `type: 'email'` — email campaign sent
- `type: 'partnership'` — partnership outreach

This keeps everything in one place — sales AND marketing activity per company/contact.

## Agent Write Rules
- Always set `business` on every record
- Always set `agent` on interactions (e.g., 'cl-prospector', 'cl-distribution')
- Use `metadata` for anything that doesn't fit standard columns
- Never delete records — update status instead
- Log ALL outreach as interactions, even if no response

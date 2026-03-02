#!/usr/bin/env node
/**
 * Daily Drip → Supabase Sync
 * Pulls new/updated subscribers from Drip and upserts into leads table.
 * Run via cron once per day.
 */

const https = require('https');

const DRIP_TOKEN = process.env.DRIP_API_TOKEN;
const DRIP_ACCOUNT = '1621557';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function dripGet(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(DRIP_TOKEN + ':').toString('base64');
    const req = https.get(`https://api.getdrip.com/v2/${DRIP_ACCOUNT}${path}`, {
      headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
      timeout: 60000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 429) {
          const retry = parseInt(res.headers['retry-after'] || '60');
          setTimeout(() => dripGet(path).then(resolve).catch(reject), retry * 1000);
          return;
        }
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

function supabasePost(table, data, options = '') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}${options}`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`Supabase ${res.statusCode}: ${d.substring(0, 500)}`));
        else { try { resolve(JSON.parse(d)); } catch { resolve(d); } }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function supabaseGet(table, query) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}?${query}`);
    const req = https.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Accept': 'application/json' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve([]); } });
    });
    req.on('error', reject);
  });
}

async function main() {
  console.log(`=== Daily Drip Sync — ${new Date().toISOString()} ===`);
  
  // Load existing contact emails
  const existingEmails = new Set();
  let offset = 0;
  while (true) {
    const contacts = await supabaseGet('contacts', `select=email&offset=${offset}&limit=1000`);
    if (!contacts.length) break;
    contacts.forEach(c => { if (c.email) existingEmails.add(c.email.toLowerCase()); });
    offset += contacts.length;
  }
  
  // Load existing lead emails
  const existingLeads = new Set();
  offset = 0;
  while (true) {
    const leads = await supabaseGet('leads', `select=email&offset=${offset}&limit=1000`);
    if (!leads.length) break;
    leads.forEach(l => { if (l.email) existingLeads.add(l.email.toLowerCase()); });
    offset += leads.length;
  }
  
  console.log(`Existing: ${existingEmails.size} contacts, ${existingLeads.size} leads`);
  
  // Pull all Drip subscribers and find new ones
  let page = 1;
  let newLeads = [];
  let totalFetched = 0;
  
  while (true) {
    const result = await dripGet(`/subscribers?per_page=1000&page=${page}&status=all`);
    const subs = result.subscribers || [];
    if (subs.length === 0) break;
    totalFetched += subs.length;
    
    for (const sub of subs) {
      const email = (sub.email || '').toLowerCase();
      if (!email || existingEmails.has(email) || existingLeads.has(email)) continue;
      
      const cf = sub.custom_fields || {};
      newLeads.push({
        business: 'enterprise_dna',
        email,
        first_name: cf.FirstName || cf.first_name || null,
        last_name: cf.LastName || cf.last_name || null,
        source: 'drip',
        source_detail: sub.landing_url || null,
        status: sub.status === 'unsubscribed' ? 'dead' : 'new',
        tags: (sub.tags || []).filter(t => !t.startsWith('lead_')),
        drip_subscriber_id: sub.id,
        metadata: JSON.stringify({
          drip_status: sub.status,
          drip_created: sub.created_at,
          ip_address: sub.ip_address,
          time_zone: sub.time_zone,
          original_referrer: sub.original_referrer,
          custom_fields: cf
        })
      });
    }
    
    page++;
    await sleep(300);
  }
  
  console.log(`Fetched ${totalFetched} Drip subscribers, found ${newLeads.length} new leads`);
  
  // Upsert new leads
  if (newLeads.length > 0) {
    for (let i = 0; i < newLeads.length; i += 500) {
      const batch = newLeads.slice(i, i + 500);
      try {
        await supabasePost('leads', batch, '?on_conflict=email');
        console.log(`  Upserted batch ${Math.floor(i/500)+1}: ${Math.min(i+500, newLeads.length)}/${newLeads.length}`);
      } catch (err) {
        console.error(`  Batch error: ${err.message}`);
      }
    }
  }
  
  console.log(`=== Done: ${newLeads.length} new leads added ===`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });

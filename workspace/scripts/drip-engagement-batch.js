#!/usr/bin/env node
/**
 * Drip Engagement Sync — Batch Mode
 * Processes BATCH_SIZE leads per run, then exits cleanly.
 * Designed to be called by cron every 90 minutes.
 * Resumes automatically from unenriched records.
 */

const https = require('https');
const fs = require('fs');
const { Client } = require('pg');

const DRIP_TOKEN = process.env.DRIP_API_TOKEN;
const DRIP_ACCOUNT = '1621557';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_URL = process.env.SUPABASE_DB_URL;

const BATCH_SIZE = 3000;
const DELAY_MS = 1200; // 1.2s between requests — safe under 3600/hr limit
const STATUS_FILE = '/home/node/.openclaw/workspace/scripts/drip-enrichment-status.json';

const startTime = Date.now();
function elapsed() { return ((Date.now() - startTime) / 1000 / 60).toFixed(1); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let stats = { processed: 0, enriched: 0, skipped: 0, errors: 0, rateLimited: 0 };

function dripGet(path, retries = 3) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(DRIP_TOKEN + ':').toString('base64');
    const req = https.get(`https://api.getdrip.com/v2/${DRIP_ACCOUNT}${path}`, {
      headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 429) {
          stats.rateLimited++;
          const retry = Math.max(parseInt(res.headers['retry-after'] || '60'), 30);
          console.log(`  ⚠️ Rate limited (${stats.rateLimited}x), waiting ${retry}s...`);
          setTimeout(() => dripGet(path, retries).then(resolve).catch(reject), retry * 1000);
          return;
        }
        if (res.statusCode === 404) { resolve(null); return; }
        if (res.statusCode >= 500 && retries > 0) {
          setTimeout(() => dripGet(path, retries - 1).then(resolve).catch(reject), 5000);
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(null); }
      });
    });
    req.on('timeout', () => { req.destroy(); if (retries > 0) setTimeout(() => dripGet(path, retries-1).then(resolve).catch(reject), 2000); else resolve(null); });
    req.on('error', (e) => { if (retries > 0) setTimeout(() => dripGet(path, retries-1).then(resolve).catch(reject), 2000); else resolve(null); });
  });
}

function saveStatus(remaining, batchNum) {
  const status = {
    lastRun: new Date().toISOString(),
    batchSize: BATCH_SIZE,
    batchNumber: batchNum,
    thisRun: { ...stats },
    remaining,
    elapsedMinutes: parseFloat(elapsed())
  };
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

async function main() {
  // Load previous status to track batch number
  let batchNum = 1;
  try {
    const prev = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
    batchNum = (prev.batchNumber || 0) + 1;
  } catch {}

  console.log(`=== Drip Engagement Sync — Batch #${batchNum} ===`);
  console.log(`Started at ${new Date().toISOString()}`);

  const pgClient = new Client({ connectionString: DB_URL });
  await pgClient.connect();

  // Count total remaining
  const countRes = await pgClient.query(
    "SELECT COUNT(*) as remaining FROM leads WHERE drip_subscriber_id IS NOT NULL AND NOT (metadata::text LIKE '%engagement%')"
  );
  const totalRemaining = parseInt(countRes.rows[0].remaining);
  console.log(`📋 ${totalRemaining} leads still need enrichment`);

  if (totalRemaining === 0) {
    console.log('✅ All leads enriched! Nothing to do.');
    saveStatus(0, batchNum);
    await pgClient.end();
    return;
  }

  // Fetch this batch
  const res = await pgClient.query(
    "SELECT id, email, drip_subscriber_id, metadata FROM leads WHERE drip_subscriber_id IS NOT NULL AND NOT (metadata::text LIKE '%engagement%') ORDER BY id LIMIT $1",
    [BATCH_SIZE]
  );
  const leads = res.rows;
  console.log(`  Processing batch of ${leads.length} leads...\n`);

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    try {
      const subData = await dripGet(`/subscribers/${lead.drip_subscriber_id}`);

      if (!subData || !subData.subscribers || !subData.subscribers[0]) {
        // Mark as processed so we don't retry — store minimal engagement object
        const currentMeta = typeof lead.metadata === 'string' ? JSON.parse(lead.metadata || '{}') : (lead.metadata || {});
        const updatedMeta = { ...currentMeta, engagement: { synced: true, found: false } };
        await pgClient.query('UPDATE leads SET metadata = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(updatedMeta), lead.id]);
        stats.skipped++;
        stats.processed++;
        await sleep(DELAY_MS);
        continue;
      }

      const sub = subData.subscribers[0];
      const engagement = {
        synced: true,
        lifetime_value: sub.lifetime_value,
        lead_score: sub.lead_score,
        original_referrer: sub.original_referrer,
        landing_url: sub.landing_url,
        prospect: sub.prospect,
        base_lead_score: sub.base_lead_score,
        eu_consent: sub.eu_consent,
        sms_number: sub.sms_number,
        sms_consent: sub.sms_consent,
        utm_source: sub.utm_source,
        utm_medium: sub.utm_medium,
        utm_campaign: sub.utm_campaign,
        utm_content: sub.utm_content,
        utm_term: sub.utm_term
      };

      const currentMeta = typeof lead.metadata === 'string' ? JSON.parse(lead.metadata || '{}') : (lead.metadata || {});
      const updatedMeta = { ...currentMeta, engagement };
      const score = parseInt(sub.lead_score) || 0;

      await pgClient.query(
        'UPDATE leads SET metadata = $1, score = $2, updated_at = NOW() WHERE id = $3',
        [JSON.stringify(updatedMeta), score, lead.id]
      );
      stats.enriched++;
    } catch (err) {
      stats.errors++;
      if (stats.errors <= 10) console.error(`  ❌ ${lead.email}: ${err.message}`);
    }
    stats.processed++;

    if (stats.processed % 500 === 0) {
      const remaining = totalRemaining - stats.processed;
      console.log(`  📊 ${stats.processed}/${leads.length} done | ${stats.enriched} enriched, ${stats.errors} errors, ${stats.rateLimited} rate limits | ${elapsed()} min | ~${remaining} total remaining`);
      saveStatus(remaining, batchNum);
    }

    await sleep(DELAY_MS);
  }

  await pgClient.end();

  const finalRemaining = totalRemaining - stats.processed;
  saveStatus(finalRemaining, batchNum);

  console.log(`\n=== BATCH #${batchNum} COMPLETE ===`);
  console.log(`Time: ${elapsed()} minutes`);
  console.log(`Processed: ${stats.processed} | Enriched: ${stats.enriched} | Skipped: ${stats.skipped} | Errors: ${stats.errors}`);
  console.log(`Remaining: ~${finalRemaining} leads`);

  if (finalRemaining <= 0) {
    console.log('\n🎉 ALL LEADS ENRICHED!');
  } else {
    const batchesLeft = Math.ceil(finalRemaining / BATCH_SIZE);
    console.log(`  ~${batchesLeft} more batches needed (~${(batchesLeft * 1.5).toFixed(0)} hours)`);
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  saveStatus(-1, -1);
  process.exit(1);
});

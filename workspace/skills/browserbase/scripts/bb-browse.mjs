#!/usr/bin/env node
/**
 * BrowserBase + Playwright browser automation script.
 * Creates a BB session, connects via Playwright CDP, runs actions, returns results.
 *
 * Usage:
 *   node bb-browse.mjs <actions-json-file> [--context <id>] [--persist] [--screenshot <path>] [--keep-alive]
 *
 * Actions JSON format (array of steps):
 * [
 *   { "action": "goto", "url": "https://example.com" },
 *   { "action": "wait", "ms": 2000 },
 *   { "action": "screenshot", "path": "output.png", "fullPage": true },
 *   { "action": "fill", "selector": "#email", "value": "user@example.com" },
 *   { "action": "click", "selector": "#login-btn" },
 *   { "action": "type", "selector": "#search", "text": "hello", "delay": 50 },
 *   { "action": "wait_for", "selector": ".results", "timeout": 10000 },
 *   { "action": "text", "selector": "body" },
 *   { "action": "html", "selector": "body" },
 *   { "action": "evaluate", "script": "document.title" },
 *   { "action": "pdf", "path": "output.pdf" },
 *   { "action": "select", "selector": "#dropdown", "value": "option1" },
 *   { "action": "hover", "selector": ".menu-item" },
 *   { "action": "keyboard", "key": "Enter" },
 *   { "action": "scroll", "x": 0, "y": 500 }
 * ]
 *
 * Returns JSON with results array + session metadata.
 */

import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "fs";

const API = "https://api.browserbase.com/v1";
const API_KEY = process.env.BROWSERBASE_API_KEY;
const PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

if (!API_KEY || !PROJECT_ID) {
  console.error("Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID");
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
let actionsFile = null;
let contextId = null;
let persist = false;
let defaultScreenshot = null;
let keepAlive = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--context") contextId = args[++i];
  else if (args[i] === "--persist") persist = true;
  else if (args[i] === "--screenshot") defaultScreenshot = args[++i];
  else if (args[i] === "--keep-alive") keepAlive = true;
  else if (!actionsFile) actionsFile = args[i];
}

if (!actionsFile) {
  console.error("Usage: bb-browse.mjs <actions.json> [--context <id>] [--persist] [--screenshot <path>] [--keep-alive]");
  process.exit(1);
}

const actions = JSON.parse(readFileSync(actionsFile, "utf-8"));

// Create session
const sessionBody = { projectId: PROJECT_ID };
if (contextId) {
  sessionBody.browserSettings = { context: { id: contextId, persist } };
}
if (keepAlive) sessionBody.keepAlive = true;

const sessionRes = await fetch(`${API}/sessions`, {
  method: "POST",
  headers: { "x-bb-api-key": API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify(sessionBody),
});
const session = await sessionRes.json();

if (!session.id) {
  console.error("Failed to create session:", JSON.stringify(session));
  process.exit(1);
}

console.error(`Session created: ${session.id}`);
console.error(`Inspector: https://www.browserbase.com/sessions/${session.id}`);

// Connect via CDP
const browser = await chromium.connectOverCDP(session.connectUrl);
const context = browser.contexts()[0];
const page = context.pages()[0] || await context.newPage();

const results = [];

try {
  for (const step of actions) {
    const { action } = step;
    let result = { action, ok: true };

    try {
      switch (action) {
        case "goto":
          await page.goto(step.url, { waitUntil: step.waitUntil || "domcontentloaded", timeout: step.timeout || 30000 });
          result.url = page.url();
          result.title = await page.title();
          break;

        case "wait":
          await page.waitForTimeout(step.ms || 1000);
          break;

        case "screenshot": {
          const path = step.path || defaultScreenshot || "screenshot.png";
          await page.screenshot({ path, fullPage: step.fullPage ?? true });
          result.path = path;
          break;
        }

        case "fill":
          await page.fill(step.selector, step.value);
          break;

        case "click":
          await page.click(step.selector, { timeout: step.timeout || 5000 });
          break;

        case "type":
          await page.type(step.selector, step.text, { delay: step.delay || 0 });
          break;

        case "wait_for":
          await page.waitForSelector(step.selector, { timeout: step.timeout || 10000, state: step.state || "visible" });
          break;

        case "text": {
          const el = step.selector ? await page.$(step.selector) : page;
          result.text = step.selector ? await el?.innerText() : await page.innerText("body");
          break;
        }

        case "html": {
          const el = step.selector ? await page.$(step.selector) : page;
          result.html = step.selector ? await el?.innerHTML() : await page.innerHTML("body");
          break;
        }

        case "evaluate":
          result.value = await page.evaluate(step.script);
          break;

        case "pdf":
          await page.pdf({ path: step.path || "output.pdf" });
          result.path = step.path || "output.pdf";
          break;

        case "select":
          await page.selectOption(step.selector, step.value);
          break;

        case "hover":
          await page.hover(step.selector);
          break;

        case "keyboard":
          await page.keyboard.press(step.key);
          break;

        case "scroll":
          await page.evaluate(({ x, y }) => window.scrollBy(x, y), { x: step.x || 0, y: step.y || 500 });
          break;

        default:
          result.ok = false;
          result.error = `Unknown action: ${action}`;
      }
    } catch (err) {
      result.ok = false;
      result.error = err.message;
    }

    results.push(result);
  }

  // Default screenshot if requested
  if (defaultScreenshot && !actions.some(a => a.action === "screenshot")) {
    await page.screenshot({ path: defaultScreenshot, fullPage: true });
    results.push({ action: "screenshot", ok: true, path: defaultScreenshot });
  }

} finally {
  await browser.close();
  // Stop session unless keep-alive
  if (!keepAlive) {
    await fetch(`${API}/sessions/${session.id}/stop`, {
      method: "POST",
      headers: { "x-bb-api-key": API_KEY, "Content-Type": "application/json" },
    }).catch(() => {});
  }
}

const output = {
  sessionId: session.id,
  inspectorUrl: `https://www.browserbase.com/sessions/${session.id}`,
  results,
};

console.log(JSON.stringify(output, null, 2));

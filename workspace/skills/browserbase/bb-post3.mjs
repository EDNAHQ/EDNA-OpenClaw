import { chromium } from "playwright-core";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

async function main() {
  const res = await fetch("https://api.browserbase.com/v1/sessions", {
    method: "POST",
    headers: { "x-bb-api-key": BROWSERBASE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ projectId: BROWSERBASE_PROJECT_ID, browserSettings: { viewport: { width: 1280, height: 900 } } })
  });
  const session = await res.json();
  console.error("Session:", session.id);

  const browser = await chromium.connectOverCDP(`wss://connect.browserbase.com?apiKey=${BROWSERBASE_API_KEY}&sessionId=${session.id}`);
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  await page.goto("https://builders.enterprisedna.co", { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.fill("input[type='email']", "sam.mckay@enterprisedna.co.nz");
  await page.fill("input[type='password']", "Pompallier2332");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);

  // Clear overlays aggressively
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });
    await page.waitForTimeout(300);
  }

  // Click FAB via JS
  await page.evaluate(() => { document.querySelector('button[aria-label="Create a new post"]').click(); });
  await page.waitForTimeout(3000);

  // Fill content via JS (more reliable than playwright fill for custom textareas)
  await page.evaluate(() => {
    const ta = document.querySelector("textarea[name='content']");
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeInputValueSetter.call(ta, `🧪 Test Post — The Age of Digital Workers

We are crossing a line that most people haven't fully internalized yet. We are moving from using apps to deploying digital workers.

When you use an app, you are at the center of execution. The app waits for you.

An agent does not wait. It operates.

This is a test post from EDNA Claw 🧬`);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(500);

  // Select Technology via JS click with force
  await page.evaluate(() => {
    // Click the combobox
    const combo = document.querySelector("button[role='combobox']");
    if (combo) combo.click();
  });
  await page.waitForTimeout(1000);
  
  // Try clicking Technology option via JS with force
  await page.evaluate(() => {
    const opt = Array.from(document.querySelectorAll('[role="option"], [data-value="Technology"]'))
      .find(el => el.textContent.includes('Technology'));
    if (opt) { opt.click(); return 'clicked Technology'; }
    // Fallback: look in any select-like structure
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.textContent.trim() === 'Technology' && el.getAttribute('data-value')) {
        el.click(); return 'clicked via data-value';
      }
    }
    return 'no Technology option found';
  });
  await page.waitForTimeout(500);

  // Upload image
  const fileInput = await page.$("#image-upload");
  if (fileInput) {
    await fileInput.setInputFiles("/tmp/test-post-image.jpg");
    console.error("Image uploaded");
    await page.waitForTimeout(5000);
  } else {
    console.error("No file input found");
  }

  await page.screenshot({ path: "/tmp/bb-pre-submit3.png" });
  console.error("Pre-submit screenshot saved");

  // Click Share Post via JS
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Share Post');
    if (btn) { btn.click(); return 'clicked'; }
    return 'not found: ' + Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => t.length > 0 && t.length < 30).join(' | ');
  });
  console.error("Share Post:", clicked);

  await page.waitForTimeout(8000);
  await page.screenshot({ path: "/tmp/bb-post-done.png" });

  const url = page.url();
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log(JSON.stringify({ ok: true, shareResult: clicked, url, bodyText }));

  await browser.close();
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });

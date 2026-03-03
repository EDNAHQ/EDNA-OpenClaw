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

  // Clear ALL overlays repeatedly
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });
    await page.waitForTimeout(500);
  }

  // Click create post FAB
  await page.evaluate(() => { document.querySelector('button[aria-label="Create a new post"]').click(); });
  await page.waitForTimeout(3000);

  // Fill content
  await page.fill("textarea[name='content']", `🧪 Test Post — The Age of Digital Workers

We are crossing a line that most people haven't fully internalized yet. We are moving from using apps to deploying digital workers.

When you use an app, you are at the center of execution. The app waits for you.

An agent does not wait. It operates.

This is a test post from EDNA Claw 🧬`);
  await page.waitForTimeout(500);

  // Select Technology category
  const catBtn = await page.$("button[role='combobox']");
  if (catBtn) {
    await catBtn.click();
    await page.waitForTimeout(1000);
    const techOpt = await page.locator("[role='option']", { hasText: "Technology" }).first();
    await techOpt.click();
    await page.waitForTimeout(500);
  }

  // Upload image via file input
  const fileInput = await page.$("#image-upload");
  if (fileInput) {
    await fileInput.setInputFiles("/tmp/test-post-image.jpg");
    console.error("Image file set");
    await page.waitForTimeout(5000); // Wait for upload
  }

  await page.screenshot({ path: "/tmp/bb-pre-submit2.png" });

  // Find and click Share Post - use evaluate to click it even if not "visible" to playwright
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Share Post');
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.error("Share Post clicked:", clicked);
  
  await page.waitForTimeout(5000);
  await page.screenshot({ path: "/tmp/bb-post-result.png" });
  
  const url = page.url();
  const snippet = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log(JSON.stringify({ ok: clicked, url, snippet }));

  await browser.close();
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });

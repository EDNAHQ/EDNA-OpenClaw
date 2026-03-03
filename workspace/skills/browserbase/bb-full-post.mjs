import { chromium } from "playwright-core";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

async function main() {
  // Create session
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

  // Login
  await page.goto("https://builders.enterprisedna.co", { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.fill("input[type='email']", "sam.mckay@enterprisedna.co.nz");
  await page.fill("input[type='password']", "Pompallier2332");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);

  // Clear overlays
  await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });

  // Click create post
  await page.evaluate(() => { document.querySelector('button[aria-label="Create a new post"]').click(); });
  await page.waitForTimeout(3000);

  // Fill content
  await page.fill("textarea[name='content']", `🧪 Test Post — The Age of Digital Workers

We are crossing a line that most people haven't fully internalized yet. We are moving from using apps to deploying digital workers.

When you use an app, you are at the center of execution. The app waits for you.

An agent does not wait. It operates.

This is a test post from EDNA Claw 🧬`);
  await page.waitForTimeout(500);

  // Select category: Technology
  const catBtn = await page.$("button[role='combobox']");
  if (catBtn) {
    await catBtn.click();
    await page.waitForTimeout(1000);
    const opts = await page.$$("[role='option']");
    for (const opt of opts) {
      const text = await opt.textContent();
      if (text.includes("Technology")) { await opt.click(); break; }
    }
  }
  await page.waitForTimeout(500);

  // Upload image
  const fileInput = await page.$("#image-upload");
  if (fileInput) {
    await fileInput.setInputFiles("/tmp/test-post-image.jpg");
    console.error("Image uploaded");
    await page.waitForTimeout(3000);
  }

  await page.screenshot({ path: "/tmp/bb-pre-submit.png" });

  // Click Share Post
  const shareBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Share Post'));
  });
  if (shareBtn) {
    await shareBtn.click();
    console.error("Clicked Share Post");
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "/tmp/bb-post-submitted.png" });
  }

  // Check result
  const pageText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log(JSON.stringify({ ok: true, pageText }));

  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });

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

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });
    await page.waitForTimeout(300);
  }

  // Open create post form
  await page.evaluate(() => { document.querySelector('button[aria-label="Create a new post"]').click(); });
  await page.waitForTimeout(3000);

  // Fill text
  await page.fill("textarea[name='content']", `🖼️ Test Post With Image — Digital Workers Are Here

The shift from apps to agents isn't theoretical anymore. It's happening right now.

This post was created automatically by EDNA Claw — including the AI-generated image below. 🧬

#automation #agents #ai`);
  await page.waitForTimeout(500);

  // Click the Images button to reveal file input
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Images'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  // Now the file input should be available
  const fileInput = await page.$("#image-upload");
  if (fileInput) {
    await fileInput.setInputFiles("/tmp/test-post-image.jpg");
    console.error("✅ Image uploaded via file input");
    await page.waitForTimeout(5000); // Wait for upload to process
  } else {
    // Try finding any file input
    const anyFileInput = await page.$("input[type='file']");
    if (anyFileInput) {
      await anyFileInput.setInputFiles("/tmp/test-post-image.jpg");
      console.error("✅ Image uploaded via generic file input");
      await page.waitForTimeout(5000);
    } else {
      console.error("❌ No file input found even after clicking Images");
    }
  }

  await page.screenshot({ path: "/tmp/bb-img-post-pre.png" });

  // Submit
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Share Post');
    if (btn) btn.click();
  });
  console.error("Clicked Share Post");
  
  await page.waitForTimeout(8000);
  await page.screenshot({ path: "/tmp/bb-img-post-done.png" });

  const hasTestPost = await page.evaluate(() => document.body.innerText.includes('Test Post With Image'));
  console.log(JSON.stringify({ ok: true, postVisible: hasTestPost }));

  await browser.close();
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });

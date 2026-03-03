import { chromium } from "playwright-core";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

const POST_CONTENT = `For most of modern business history, scale meant headcount. If you wanted more output, you hired more people. If you wanted more capability, you built bigger teams. If you wanted to compete with a 100-person company, you became a 150-person company. Size signaled strength.

But I believe we are entering a phase where that assumption breaks down.

Because when small teams can deploy coordinated swarms of agents, headcount stops being the primary driver of leverage. And two or three technically fluent operators can realistically outcompete organizations with 100 people — not by working harder, but by designing better systems.

The shift starts with a simple observation:

Execution is no longer purely human.

Agents can now:
• Generate and test marketing campaigns continuously
• Monitor and optimize ad spend in real time
• Write, review, and refactor code
• Run automated QA and deployment cycles
• Analyze financial performance
• Generate reporting dashboards
• Detect anomalies across systems
• Coordinate workflows across tools

When these capabilities operate in loops — perceiving, reasoning, acting, evaluating — they begin to resemble departments, not tools.

And once you coordinate dozens of these loops, you don't just have automation.

You have a digital workforce.

Now imagine a small team that understands how to design and orchestrate these systems. Two or three people who can:
• Define clear objectives
• Structure agent pipelines
• Connect APIs and data sources
• Monitor system performance
• Iterate on architecture

They don't need to manually execute every task. They design the execution layer.

That is where the leverage lives.

Contrast that with a traditional 100-person organization. There are:
• Meetings to align on strategy
• Manual reporting cycles
• Layered approval processes
• Communication bottlenecks
• Departmental silos
• Fixed quarterly planning cadences

Even if the individuals are talented, the structure introduces latency. And in a world where agents operate 24/7 and adapt continuously, latency becomes a competitive liability.

Small teams don't just move faster. They redesign the operating model entirely.

The key advantage isn't speed alone. It's compounding.

A small team running agent swarms can:
• Launch experiments continuously
• Optimize daily instead of monthly
• Deploy product updates automatically
• Adjust pricing dynamically
• Personalize marketing at scale
• Reallocate resources in real time

Each improvement feeds the next. While a larger organization debates change, the small team iterates dozens of times. Over months, that compounds into a structural gap.

There's also a psychological difference.

Large teams often default to human coordination as the solution. More meetings. More managers. More oversight layers.

Small, technically fluent teams default to system design. Instead of asking, "Who should handle this?" they ask, "What agent should handle this?"

Instead of hiring for execution, they build loops.
Instead of adding people, they refine orchestration.

That mindset is transformative.

This doesn't mean large organizations are doomed. But it does mean their advantage shifts. Scale alone is no longer enough. They must become orchestration-native. If they remain people-heavy and system-light, they will be vulnerable to smaller, more adaptive competitors.

The real revolution isn't just technological. It's structural.

For the first time in history, economic leverage is increasingly decoupled from organizational size.

You don't need 100 people to operate like a 100-person company.

You need:
• A clear objective
• A well-designed agent architecture
• Strong technical fluency
• Continuous measurement and refinement

That's it. The rest can be digital.

We are already seeing early examples of this. Founders running operations that look like entire departments. Small agencies competing with global firms. Product teams shipping faster than established incumbents.

The difference isn't talent density alone. It's system leverage.

The Small Team Revolution isn't about replacing humans. It's about reallocating human energy upward.

Two or three operators can focus on:
• Strategy
• Architecture
• High-level decision-making
• Creative direction

While their agent swarms handle execution at scale.

That combination — human judgment plus continuous autonomous execution — is extremely difficult to compete against with a traditional headcount model.

For decades, the goal was to build bigger teams.

Now the goal may be to build better systems.

And the organizations that understand this shift early will have an outsized advantage.

Because in an agent-driven world, the competitive unit isn't the individual. It isn't even the company.

It's the architecture.

And small teams, unburdened by legacy structures, are often best positioned to design it.`;

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

  // Login
  await page.goto("https://builders.enterprisedna.co", { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.fill("input[type='email']", "sam.mckay@enterprisedna.co.nz");
  await page.fill("input[type='password']", "Pompallier2332");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);

  // Clear overlays
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => { document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove()); });
    await page.waitForTimeout(300);
  }

  // Open post form
  await page.evaluate(() => { document.querySelector('button[aria-label="Create a new post"]').click(); });
  await page.waitForTimeout(3000);

  // Fill content
  await page.fill("textarea[name='content']", POST_CONTENT);
  await page.waitForTimeout(500);

  // Select Technology category via JS
  await page.evaluate(() => {
    const combo = document.querySelector("button[role='combobox']");
    if (combo) combo.click();
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const opt = document.querySelector('[data-value="Technology"]');
    if (opt) opt.click();
  });
  await page.waitForTimeout(500);

  // Click Images button to reveal file input
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Images'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  // Upload image
  const fileInput = await page.$("#image-upload");
  if (fileInput) {
    await fileInput.setInputFiles("/tmp/small-team-rev-2.jpg");
    console.error("Image uploaded");
    await page.waitForTimeout(5000);
  } else {
    console.error("No file input found!");
  }

  await page.screenshot({ path: "/tmp/bb-real-pre-submit.png" });

  // Submit
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Share Post');
    if (btn) btn.click();
  });
  console.error("Clicked Share Post");

  await page.waitForTimeout(8000);
  await page.screenshot({ path: "/tmp/bb-real-post-done.png" });

  const hasPost = await page.evaluate(() => document.body.innerText.includes('scale meant headcount'));
  console.log(JSON.stringify({ ok: true, postVisible: hasPost }));

  await browser.close();
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });

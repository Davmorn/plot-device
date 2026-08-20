// Drives Plot Device (a static, no-build site) with Playwright + headless
// Chromium and proves the main flow works end-to-end: generate -> per-field
// reroll -> fine-tune workshop -> save draft -> drafts list -> compact
// view -> export good ideas. Screenshots land in ./screenshots/.
//
// Usage:
//   node driver.js [baseUrl]
// baseUrl defaults to http://localhost:8123 (see SKILL.md for how to serve it).

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:8123";
const SHOT_DIR = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOT_DIR, { recursive: true });

function shot(page, name) {
  return page.screenshot({ path: path.join(SHOT_DIR, name) });
}

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });

  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("dialog", (d) => d.accept()); // app uses confirm()/alert() for delete + export guard

  // 1. Load
  await page.goto(BASE);
  await page.waitForSelector("#categoryToggles input");
  await shot(page, "01-generator.png");

  // 2. Generate
  await page.click("#generateBtn");
  await page.waitForSelector("#output .result-card");
  await shot(page, "02-generated.png");

  // 3. Per-field reroll (click the dice on the first result card)
  const before = await page.locator("#output .result-card").first().locator(".result-value").textContent();
  await page.locator("#output .result-card").first().locator(".reroll-btn").click();
  const after = await page.locator("#output .result-card").first().locator(".result-value").textContent();
  console.log("reroll:", JSON.stringify({ before, after }));

  // 4. Fine-tune -> workshop, fill one beat, save as draft
  await page.click("#refineBtn");
  await page.waitForSelector("#workshopView:not([hidden])");
  await shot(page, "03-workshop.png");
  await page.locator("#outlineFields textarea").first().fill(
    "Opening image: a lighthouse keeper finds a message in a bottle."
  );
  await page.click("#saveDraftBtn");
  await page.waitForSelector("#draftsView:not([hidden])");
  await shot(page, "04-drafts.png");

  // 5. Back to generator. NOTE: saving a draft clears currentResults but
  // does not re-render #output, so leftover cards/buttons from before the
  // save are inert (see Gotchas in SKILL.md). Regenerate for a live state.
  await page.click("#navGenerator");
  await page.waitForSelector("#generatorView:not([hidden])");
  await page.click("#generateBtn");
  await page.waitForSelector("#output .result-card");

  // 6. Compact view (screenshot-card modal)
  await page.click("#screenshotBtn");
  await page.waitForSelector("#screenshotModal:not([hidden])");
  await shot(page, "05-compact-view.png");
  await page.click("#closeScreenshotBtn");
  await page.waitForSelector("#screenshotModal", { state: "hidden" });

  // 7. Drafts: mark good, export good-ideas.json
  await page.click("#navDrafts");
  await page.locator('#draftsList button:has-text("Mark as good idea")').first().click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("#exportGoodBtn"),
  ]);
  console.log("export filename:", download.suggestedFilename());

  console.log("console errors:", JSON.stringify(consoleErrors));
  if (consoleErrors.length > 0) {
    throw new Error("Console errors during run: " + consoleErrors.join(" | "));
  }

  await browser.close();
  console.log("OK");
})().catch((e) => {
  console.error("DRIVER FAILED:", e);
  process.exit(1);
});

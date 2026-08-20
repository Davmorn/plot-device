---
name: run-plot-device
description: Build, run, and drive Plot Device (the writing-inspiration static site). Use when asked to start, serve, run, or screenshot Plot Device, or to confirm a change works in the real app (generator, workshop, drafts, compact view, export).
---

Plot Device is a static, no-build, no-dependency site (`index.html` +
`data.js` + `script.js` + `style.css`) — no server framework, just files
served flat. Drive it headlessly with the Playwright driver at
`.claude/skills/run-plot-device/driver.js`, which serves the folder,
opens it in Chromium, and runs the full generate → reroll → fine-tune →
save draft → compact view → export flow, saving screenshots as it goes.

All paths below are relative to the repo root.

## Prerequisites

None beyond Node — no `apt-get` packages were needed. `npx playwright
install chromium` downloads Chromium into `~/.cache/ms-playwright/` on
first use; on this machine it was already cached, so no browser deps
had to be installed. If Chromium isn't cached yet, run:

```bash
cd .claude/skills/run-plot-device
npx playwright install chromium
```

## Setup

```bash
cd .claude/skills/run-plot-device
npm install   # installs playwright into this skill dir only, not the app
```

## Build

None — static HTML/CSS/JS, no build step.

## Run (agent path)

1. Serve the repo root as static files (the driver expects port 8123):

```bash
python3 -m http.server 8123 &
timeout 10 bash -c 'until curl -sf http://localhost:8123/index.html >/dev/null; do sleep 0.5; done'
```

2. Run the driver:

```bash
cd .claude/skills/run-plot-device
node driver.js                        # defaults to http://localhost:8123
node driver.js http://localhost:PORT  # or pass a different base URL
```

It exits non-zero (and prints `DRIVER FAILED:`) if any step times out or
the page throws a console error. On success it prints the reroll
before/after values, the exported filename, and `OK`.

Screenshots land in `.claude/skills/run-plot-device/screenshots/`
(gitignored):

| file | what it shows |
|---|---|
| `01-generator.png` | Generator view on load, categories + Generate button |
| `02-generated.png` | Result cards after clicking Generate |
| `03-workshop.png` | Fine-tune workshop view (element fields + beat sheet) |
| `04-drafts.png` | Drafts list after saving a draft from the workshop |
| `05-compact-view.png` | The "Compact view" share-card modal |

3. Stop the server when done:

```bash
lsof -ti:8123 -sTCP:LISTEN | xargs -r kill
```

## Run (human path)

Open `index.html` directly in a browser, or:

```bash
python3 -m http.server 8123
```

then visit `http://localhost:8123`. Nothing to build or install.

## Test

No test suite exists in this repo — the driver above is the only
automated check.

---

## Gotchas

- **The "Compact view" modal covered the whole page on load and ate
  every click, even though it had the `hidden` attribute.**
  `.screenshot-modal { display: flex; ... }` in `style.css` has the same
  specificity as (and comes after) the browser's built-in
  `[hidden] { display: none }` rule, so the class wins and the modal
  renders full-screen regardless of `hidden`. This was in the
  in-progress "Compact view" feature (uncommitted at the time this skill
  was written), not old code. Fixed by adding an explicit
  `.screenshot-modal[hidden] { display: none; }` rule above it in
  `style.css`. If a future edit reintroduces an always-visible
  full-screen overlay, this is the pattern to check for.
- **Saving a draft leaves stale, dead buttons on the generator view.**
  `saveCurrentAsDraft()` (in `script.js`) clears `currentResults = {}`
  after saving, but never re-renders `#output` or re-hides
  `#refineBtn` / `#shareBtn` / `#screenshotBtn`. If you navigate back to
  the Generator tab without clicking Generate again, the previous
  result cards and those three buttons are still on screen and still
  look clickable, but do nothing — `openScreenshotView()`,
  `copyShareLink()`, and `openWorkshop()` all early-return on an empty
  `currentResults`. The driver works around this by clicking
  `#generateBtn` again after returning to the generator view. This is a
  product-decision bug (clear the stale view vs. keep it live) that
  wasn't fixed here — worth a look if drafts/sharing feel broken in
  manual testing.
- **`#exportGoodBtn` shows a JS `alert()` and does nothing if no draft
  is marked "good."** The driver registers a `page.on('dialog', ...)`
  auto-accept handler and marks the first draft as good before
  exporting, to avoid hanging on the alert.
- **Category order in `#output` isn't fixed** — it follows whichever
  categories happen to be checked, so "the first result card" isn't
  reliably the Protagonist card. Don't assume its content by position;
  the driver only checks that the reroll changed *something*.

# Plot Device

🔗 **Live app:** https://davmorn.github.io/plot-device/

Plot Device is a random story-idea generator for writers. Toggle the categories you care about, hit generate, and get a random combination of story elements to spark your next idea.

## Features

- **Random generation** across categories like Protagonist, Setting, Conflict, Twist, Tone, Genre, Antagonist, Key Object, Secondary Character, and Time Period. The Protagonist list also includes well-known characters (Spider-Man, Sherlock Holmes, Frodo Baggins, etc.) alongside original prompts.
- **Selective categories** — pick which categories to roll with, or use "Select all" / "Select none". Your selection is remembered between visits.
- **Per-field reroll** — not happy with one result? Reroll just that category instead of starting over.
- **Workshop / fine-tune view** — take a generated idea further by editing any field directly or rerolling individual suggestions, then fill out a full [Save the Cat!](https://savethecat.com/how-to-write-a-novel) 15-beat outline.
- **Drafts** — save fine-tuned ideas as drafts, stored locally in your browser.
- **Export / import** — export your drafts as a `good-ideas.json` file to keep permanently (e.g. by committing it to the repo), and re-import them later.

## Usage

No build step or dependencies — it's a static site.

Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```bash
python3 -m http.server
```

## Project structure

- `index.html` — page structure and views (Generator, Workshop, Drafts)
- `style.css` — styling
- `data.js` — the category data (protagonists, settings, conflicts, etc.) and beat sheet definitions
- `script.js` — app logic: generating, rerolling, the workshop, and drafts (save/export/import)

## Deployment

The site is deployed via GitHub Pages from the `main` branch.

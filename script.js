const DEFAULT_ACTIVE = ["protagonist", "setting", "conflict"];

function loadActiveKeys() {
  const saved = localStorage.getItem("activeCategories");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fall through to default
    }
  }
  return DEFAULT_ACTIVE;
}

function saveActiveKeys(keys) {
  localStorage.setItem("activeCategories", JSON.stringify(keys));
}

function renderToggles() {
  const container = document.getElementById("categoryToggles");
  const activeKeys = new Set(loadActiveKeys());

  Object.entries(CATEGORIES).forEach(([key, category]) => {
    const label = document.createElement("label");
    label.className = "toggle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.key = key;
    checkbox.checked = activeKeys.has(key);

    const span = document.createElement("span");
    span.textContent = category.label;

    label.appendChild(checkbox);
    label.appendChild(span);
    container.appendChild(label);
  });

  container.addEventListener("change", () => {
    saveActiveKeys(getCheckedKeys());
  });
}

function getCheckedKeys() {
  return Array.from(document.querySelectorAll("#categoryToggles input:checked"))
    .map((el) => el.dataset.key);
}

let currentResults = {}; // key -> currently displayed value

function pickRandom(items, exclude) {
  if (items.length > 1 && exclude !== undefined) {
    let value;
    do {
      value = items[Math.floor(Math.random() * items.length)];
    } while (value === exclude);
    return value;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function generate() {
  const checkedKeys = getCheckedKeys();

  if (checkedKeys.length === 0) {
    currentResults = {};
    document.getElementById("output").innerHTML =
      '<p class="empty">Select at least one category to generate.</p>';
    return;
  }

  currentResults = {};
  checkedKeys.forEach((key) => {
    currentResults[key] = pickRandom(CATEGORIES[key].items);
  });
  renderResults();
}

function rerollOne(key) {
  const category = CATEGORIES[key];
  currentResults[key] = pickRandom(category.items, currentResults[key]);
  renderResults();
}

function renderResults() {
  const output = document.getElementById("output");
  const refineBtn = document.getElementById("refineBtn");
  const shareBtn = document.getElementById("shareBtn");
  output.innerHTML = "";

  const hasResults = Object.keys(currentResults).length > 0;
  refineBtn.hidden = !hasResults;
  shareBtn.hidden = !hasResults;
  document.getElementById("screenshotBtn").hidden = !hasResults;

  Object.entries(currentResults).forEach(([key, value]) => {
    const category = CATEGORIES[key];

    const card = document.createElement("div");
    card.className = "result-card";

    const label = document.createElement("div");
    label.className = "result-label";
    label.textContent = category.label;

    const value_el = document.createElement("div");
    value_el.className = "result-value";
    value_el.textContent = value;

    const reroll_btn = document.createElement("button");
    reroll_btn.className = "reroll-btn";
    reroll_btn.title = `Reroll ${category.label}`;
    reroll_btn.setAttribute("aria-label", `Reroll ${category.label}`);
    reroll_btn.textContent = "⟳";
    reroll_btn.addEventListener("click", () => rerollOne(key));

    card.appendChild(reroll_btn);
    card.appendChild(label);
    card.appendChild(value_el);
    output.appendChild(card);
  });
}

// ---- Sharing ----

let shareStatusTimer = null;

function buildShareUrl() {
  const params = new URLSearchParams();
  Object.entries(currentResults).forEach(([key, value]) => {
    params.set(key, value);
  });
  const url = new URL(window.location.href);
  url.search = params.toString();
  url.hash = "";
  return url.toString();
}

function showShareStatus(message) {
  const statusEl = document.getElementById("shareStatus");
  statusEl.textContent = message;
  clearTimeout(shareStatusTimer);
  shareStatusTimer = setTimeout(() => {
    statusEl.textContent = "";
  }, 4000);
}

async function copyShareLink() {
  if (Object.keys(currentResults).length === 0) return;
  const url = buildShareUrl();

  try {
    await navigator.clipboard.writeText(url);
    showShareStatus("Link copied! Paste it anywhere to share this combo.");
    return;
  } catch (e) {
    // Clipboard API unavailable (e.g. older browser or non-HTTPS) — fall back below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showShareStatus("Link copied! Paste it anywhere to share this combo.");
  } catch (e) {
    showShareStatus(url);
  }
  document.body.removeChild(textarea);
}

function renderScreenshotView() {
  const container = document.getElementById("screenshotItems");
  container.innerHTML = "";

  Object.entries(currentResults).forEach(([key, value]) => {
    const category = CATEGORIES[key];

    const row = document.createElement("div");
    row.className = "screenshot-item";

    const label = document.createElement("span");
    label.className = "screenshot-label";
    label.textContent = category.label;

    const val = document.createElement("span");
    val.className = "screenshot-value";
    val.textContent = value;

    row.appendChild(label);
    row.appendChild(val);
    container.appendChild(row);
  });
}

function openScreenshotView() {
  if (Object.keys(currentResults).length === 0) return;
  renderScreenshotView();
  document.getElementById("screenshotModal").hidden = false;
}

function closeScreenshotView() {
  document.getElementById("screenshotModal").hidden = true;
}

function loadResultsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const found = {};
  Object.keys(CATEGORIES).forEach((key) => {
    const value = params.get(key);
    if (value) found[key] = value;
  });
  return found;
}

// ---- Workshop (fine-tune) view ----

let workshopValues = loadWorkshopValues(); // key -> text, one entry per CATEGORIES key
let outlineValues = loadOutlineValues(); // key -> text, one entry per OUTLINE_FIELDS key

function loadWorkshopValues() {
  try {
    return JSON.parse(localStorage.getItem("workshopValues")) || {};
  } catch (e) {
    return {};
  }
}

function loadOutlineValues() {
  try {
    return JSON.parse(localStorage.getItem("outlineValues")) || {};
  } catch (e) {
    return {};
  }
}

function saveWorkshopValues() {
  localStorage.setItem("workshopValues", JSON.stringify(workshopValues));
}

function saveOutlineValues() {
  localStorage.setItem("outlineValues", JSON.stringify(outlineValues));
}

function showView(name) {
  document.getElementById("generatorView").hidden = name !== "generator";
  document.getElementById("workshopView").hidden = name !== "workshop";
  document.getElementById("draftsView").hidden = name !== "drafts";

  document.getElementById("navGenerator").classList.toggle("active", name === "generator" || name === "workshop");
  document.getElementById("navDrafts").classList.toggle("active", name === "drafts");
}

function openWorkshop() {
  // Freshly rolled categories overwrite their workshop field; anything the
  // user already typed into an un-rolled category is left alone.
  workshopValues = { ...workshopValues, ...currentResults };
  saveWorkshopValues();
  renderWorkshopFields();
  showView("workshop");
}

function renderWorkshopFields() {
  const container = document.getElementById("elementFields");
  container.innerHTML = "";

  Object.entries(CATEGORIES).forEach(([key, category]) => {
    const group = document.createElement("div");
    group.className = "field-group";

    const row = document.createElement("div");
    row.className = "field-label-row";

    const label = document.createElement("label");
    label.textContent = category.label;
    label.setAttribute("for", `field-${key}`);

    const dice_btn = document.createElement("button");
    dice_btn.className = "dice-btn";
    dice_btn.type = "button";
    dice_btn.title = `Random ${category.label} suggestion`;
    dice_btn.setAttribute("aria-label", `Random ${category.label} suggestion`);
    dice_btn.textContent = "🎲";

    row.appendChild(label);
    row.appendChild(dice_btn);

    const textarea = document.createElement("textarea");
    textarea.id = `field-${key}`;
    textarea.rows = 2;
    textarea.value = workshopValues[key] || "";

    textarea.addEventListener("input", () => {
      workshopValues[key] = textarea.value;
      saveWorkshopValues();
    });

    dice_btn.addEventListener("click", () => {
      textarea.value = pickRandom(category.items, textarea.value);
      workshopValues[key] = textarea.value;
      saveWorkshopValues();
    });

    group.appendChild(row);
    group.appendChild(textarea);
    container.appendChild(group);
  });
}

function renderOutlineFields() {
  const container = document.getElementById("outlineFields");
  container.innerHTML = "";

  let lastAct = null;

  OUTLINE_FIELDS.forEach((field) => {
    if (field.act && field.act !== lastAct) {
      lastAct = field.act;
      const actHeading = document.createElement("h3");
      actHeading.className = "act-heading";
      actHeading.textContent = field.act;
      container.appendChild(actHeading);
    }

    const group = document.createElement("div");
    group.className = "field-group";

    const label = document.createElement("label");
    label.textContent = field.label;
    label.setAttribute("for", `outline-${field.key}`);

    const textarea = document.createElement("textarea");
    textarea.id = `outline-${field.key}`;
    textarea.rows = 2;
    textarea.placeholder = field.placeholder;
    textarea.value = outlineValues[field.key] || "";

    textarea.addEventListener("input", () => {
      outlineValues[field.key] = textarea.value;
      saveOutlineValues();
    });

    group.appendChild(label);
    group.appendChild(textarea);
    container.appendChild(group);
  });
}

// ---- Drafts ----

function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem("savedDrafts")) || [];
  } catch (e) {
    return [];
  }
}

function saveDrafts(drafts) {
  localStorage.setItem("savedDrafts", JSON.stringify(drafts));
}

function nonEmptyEntries(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value && value.trim() !== "")
  );
}

function saveCurrentAsDraft() {
  const elements = nonEmptyEntries(workshopValues);
  const outline = nonEmptyEntries(outlineValues);

  if (Object.keys(elements).length === 0 && Object.keys(outline).length === 0) {
    alert("Nothing to save yet — fill in at least one field first.");
    return;
  }

  const drafts = loadDrafts();
  drafts.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "draft",
    elements,
    outline
  });
  saveDrafts(drafts);

  // Clear the workshop scratch space so the next idea starts fresh.
  workshopValues = {};
  outlineValues = {};
  currentResults = {};
  saveWorkshopValues();
  saveOutlineValues();

  renderDrafts();
  showView("drafts");
}

function draftPreview(draft) {
  const elementParts = Object.entries(CATEGORIES)
    .filter(([key]) => draft.elements[key])
    .slice(0, 3)
    .map(([key, category]) => {
      const value = draft.elements[key];
      const trimmed = value.length > 60 ? value.slice(0, 57) + "…" : value;
      return `${category.label}: ${trimmed}`;
    });

  if (elementParts.length > 0) {
    return elementParts.join(" · ");
  }

  const outlineParts = OUTLINE_FIELDS.filter((f) => draft.outline[f.key]).slice(0, 2);
  if (outlineParts.length > 0) {
    return outlineParts
      .map((f) => `${f.label}: ${draft.outline[f.key].slice(0, 60)}`)
      .join(" · ");
  }

  return "(empty draft)";
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function toggleGood(id) {
  const drafts = loadDrafts();
  const draft = drafts.find((d) => d.id === id);
  if (!draft) return;
  draft.status = draft.status === "good" ? "draft" : "good";
  saveDrafts(drafts);
  renderDrafts();
}

function deleteDraft(id) {
  if (!confirm("Delete this draft? This can't be undone.")) return;
  const drafts = loadDrafts().filter((d) => d.id !== id);
  saveDrafts(drafts);
  renderDrafts();
}

function loadDraftIntoWorkshop(id) {
  const draft = loadDrafts().find((d) => d.id === id);
  if (!draft) return;
  workshopValues = { ...draft.elements };
  outlineValues = { ...draft.outline };
  currentResults = {};
  saveWorkshopValues();
  saveOutlineValues();
  renderWorkshopFields();
  renderOutlineFields();
  showView("workshop");
}

function renderDrafts() {
  const container = document.getElementById("draftsList");
  container.innerHTML = "";

  const drafts = loadDrafts().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (drafts.length === 0) {
    container.innerHTML = '<p class="empty">No drafts saved yet. Fine-tune an idea and click "Save as Draft".</p>';
    return;
  }

  drafts.forEach((draft) => {
    const card = document.createElement("div");
    card.className = "draft-card";

    const header = document.createElement("div");
    header.className = "draft-card-header";

    const meta = document.createElement("div");
    meta.className = "draft-meta";
    meta.textContent = formatDate(draft.createdAt);

    header.appendChild(meta);

    if (draft.status === "good") {
      const badge = document.createElement("span");
      badge.className = "good-badge";
      badge.textContent = "⭐ Good idea";
      header.appendChild(badge);
    }

    const preview = document.createElement("div");
    preview.className = "draft-preview";
    preview.textContent = draftPreview(draft);

    const actions = document.createElement("div");
    actions.className = "draft-actions";

    const loadBtn = document.createElement("button");
    loadBtn.className = "small-btn";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => loadDraftIntoWorkshop(draft.id));

    const goodBtn = document.createElement("button");
    goodBtn.className = "small-btn";
    goodBtn.textContent = draft.status === "good" ? "Unmark good idea" : "Mark as good idea";
    goodBtn.addEventListener("click", () => toggleGood(draft.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "small-btn danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteDraft(draft.id));

    actions.appendChild(loadBtn);
    actions.appendChild(goodBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(preview);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function exportGoodIdeas() {
  const goodDrafts = loadDrafts().filter((d) => d.status === "good");
  if (goodDrafts.length === 0) {
    alert("Mark at least one draft as a good idea first.");
    return;
  }

  const blob = new Blob([JSON.stringify(goodDrafts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "good-ideas.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importGoodIdeas(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let imported;
    try {
      imported = JSON.parse(reader.result);
    } catch (e) {
      alert("That file isn't valid JSON.");
      return;
    }
    if (!Array.isArray(imported)) {
      alert("Expected a JSON array of drafts.");
      return;
    }

    const drafts = loadDrafts();
    const existingIds = new Set(drafts.map((d) => d.id));
    let added = 0;

    imported.forEach((item) => {
      if (!item || typeof item !== "object" || !item.id) return;
      if (existingIds.has(item.id)) return;
      drafts.push({
        id: item.id,
        createdAt: item.createdAt || new Date().toISOString(),
        status: "good",
        elements: item.elements || {},
        outline: item.outline || {}
      });
      existingIds.add(item.id);
      added += 1;
    });

    saveDrafts(drafts);
    renderDrafts();
    alert(`Imported ${added} good idea${added === 1 ? "" : "s"}.`);
  };
  reader.readAsText(file);
}

function init() {
  renderToggles();
  renderOutlineFields();

  document.getElementById("generateBtn").addEventListener("click", generate);

  document.getElementById("selectAll").addEventListener("click", () => {
    document.querySelectorAll("#categoryToggles input").forEach((el) => (el.checked = true));
    saveActiveKeys(getCheckedKeys());
  });

  document.getElementById("selectNone").addEventListener("click", () => {
    document.querySelectorAll("#categoryToggles input").forEach((el) => (el.checked = false));
    saveActiveKeys(getCheckedKeys());
  });

  document.getElementById("refineBtn").addEventListener("click", openWorkshop);
  document.getElementById("shareBtn").addEventListener("click", copyShareLink);
  document.getElementById("screenshotBtn").addEventListener("click", openScreenshotView);
  document.getElementById("closeScreenshotBtn").addEventListener("click", closeScreenshotView);
  document.getElementById("screenshotModal").addEventListener("click", (e) => {
    if (e.target.id === "screenshotModal") closeScreenshotView();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeScreenshotView();
  });
  document.getElementById("backBtn").addEventListener("click", () => showView("generator"));
  document.getElementById("saveDraftBtn").addEventListener("click", saveCurrentAsDraft);

  document.getElementById("navGenerator").addEventListener("click", () => showView("generator"));
  document.getElementById("navDrafts").addEventListener("click", () => {
    renderDrafts();
    showView("drafts");
  });

  document.getElementById("exportGoodBtn").addEventListener("click", exportGoodIdeas);
  document.getElementById("importGoodInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) importGoodIdeas(file);
    e.target.value = "";
  });

  showView("generator");

  const sharedResults = loadResultsFromUrl();
  if (Object.keys(sharedResults).length > 0) {
    currentResults = sharedResults;
    saveActiveKeys(Object.keys(sharedResults));
    document.querySelectorAll("#categoryToggles input").forEach((el) => {
      el.checked = Object.prototype.hasOwnProperty.call(sharedResults, el.dataset.key);
    });
    renderResults();
  } else {
    generate();
  }
}

document.addEventListener("DOMContentLoaded", init);

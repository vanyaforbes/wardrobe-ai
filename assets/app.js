/* Wardrobe AI — application logic (vanilla JS, no build step).
   Depends on assets/i18n.js (WA.t, WA.lang) and assets/catalog.js (styles, retailers). */
(() => {
"use strict";
const t = (k, v) => WA.t(k, v);
const L = () => WA.lang;

/* =========================================================================
   Reference data
   ========================================================================= */
const CATS = ["tops", "bottoms", "jackets", "shoes", "accessories", "bags"];
const LEGACY_CAT = { trousers: "bottoms", jeans: "bottoms", dresses: "tops", other: "accessories" };
const catKey = (c) => (CATS.includes(c) ? c : LEGACY_CAT[c] || "accessories");
const COLORS = [
  { id: "black", hex: "#1B1B1E", n: true }, { id: "white", hex: "#F7F7F4", n: true }, { id: "grey", hex: "#9A9CA3", n: true },
  { id: "beige", hex: "#D8C3A0", n: true }, { id: "brown", hex: "#7A4E2D", n: true }, { id: "navy", hex: "#1F2B4D", n: true },
  { id: "denim", hex: "#5B7DB1", n: true }, { id: "khaki", hex: "#7C7B4E", n: true },
  { id: "blue", hex: "#2F5BD3", h: 225, c: 1 }, { id: "lightblue", hex: "#9CC3EC", h: 210, c: 0.6 }, { id: "green", hex: "#2F8A4E", h: 140, c: 0.9 },
  { id: "red", hex: "#D23A2E", h: 5, c: 1 }, { id: "burgundy", hex: "#6E1E2C", h: 345, c: 0.7 }, { id: "pink", hex: "#EDA3B7", h: 340, c: 0.6 },
  { id: "yellow", hex: "#F0C93A", h: 50, c: 1 }, { id: "orange", hex: "#E5772A", h: 25, c: 1 }, { id: "purple", hex: "#6C4AB6", h: 265, c: 0.9 },
];
const COL = Object.fromEntries(COLORS.map((c) => [c.id, c]));
const SEASONS = ["all", "winter", "spring", "summer", "autumn"];
const OCCASIONS = ["everyday", "study", "work", "date", "party", "sport"];
const WEATHER = ["cold", "cool", "warm", "hot"];
const STYLES = WA.STYLE_LIBRARY;
const STYLE = Object.fromEntries(STYLES.map((s) => [s.id, s]));
const styleId = (id) => (STYLE[id] ? id : WA.LEGACY_STYLE[id] && STYLE[WA.LEGACY_STYLE[id]] ? WA.LEGACY_STYLE[id] : null);
const styleF = (id) => (styleId(id) ? STYLE[styleId(id)].f : 0);
const styleName = (id) => (styleId(id) ? STYLE[styleId(id)].name[L()] : "");
const RETAILERS = WA.RETAILERS;
const RET = Object.fromEntries(RETAILERS.map((r) => [r.id, r]));
const RET_HOSTS = { zara: ["zara.com"], bershka: ["bershka.com", "kaspi.kz"], kaspi: ["kaspi.kz"] };

function currentSeason(d = new Date()) {
  const m = d.getMonth();
  return m <= 1 || m === 11 ? "winter" : m <= 4 ? "spring" : m <= 7 ? "summer" : "autumn";
}
const SEASON_WEATHER = { winter: "cold", spring: "cool", summer: "hot", autumn: "cool" };
const colorName = (id) => (COL[id] ? t("color." + id) : "");
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const locale = () => (L() === "ru" ? "ru-RU" : "en-US");
const money = (n) => new Intl.NumberFormat(locale()).format(Math.round(n)) + " ₸";
const fmtDate = (ts, o = { day: "numeric", month: "short" }) => new Date(ts).toLocaleDateString(locale(), o);

/* =========================================================================
   Icons (line icons, no illustrations)
   ========================================================================= */
const svg = (d, w = 1.4) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  all: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  tops: '<path d="M8.5 4L4 6.6l1.6 3.6 2.1-1V20h8.6V9.2l2.1 1L20 6.6 15.5 4c-.7 1.4-2 2.1-3.5 2.1S9.2 5.4 8.5 4z"/>',
  bottoms: '<path d="M7 3.5h10l1.2 17h-4.1L12 10.2 9.9 20.5H5.8z"/><path d="M7 6.5h10"/>',
  jackets: '<path d="M9 3.5L5 6l-1.2 14.5h3.9V11l1.1 1.5v8h6.4v-8l1.1-1.5v9.5h3.9L19 6l-4-2.5-3 4.5z"/><path d="M12 8v12.5"/>',
  shoes: '<path d="M3.5 17.5v-6l4-1 3 3 8.2 2a2.3 2.3 0 0 1 1.8 2.2v.8z"/><path d="M3.5 17.5h17"/>',
  accessories: '<circle cx="12" cy="13" r="5"/><path d="M9.5 8.5L10 4h4l.5 4.5M9.5 17.5L10 21h4l.5-3.5"/>',
  bags: '<path d="M5 8.5h14l-1.2 12H6.2z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  home: '<path d="M4 10.5L12 4l8 6.5V20H4z"/><path d="M10 20v-6h4v6"/>',
  hanger: '<path d="M12 7.2a2 2 0 1 1 2-2"/><path d="M12 7.2v1L3 15.5h18L12 8.2"/>',
  outfits: '<rect x="4" y="3.5" width="7" height="17" rx="1"/><rect x="13" y="3.5" width="7" height="8" rx="1"/><rect x="13" y="13.5" width="7" height="7" rx="1"/>',
  styles: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17"/><path d="M6 6c3.5 2.5 8.5 2.5 12 0M6 18c3.5-2.5 8.5-2.5 12 0"/>',
  shop: '<path d="M4 7h16l-1.4 13H5.4z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  stylist: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  ext: '<path d="M14 5h5v5M19 5l-8 8M10 6H6v12h12v-4"/>',
  upload: '<path d="M12 16V5M7 10l5-5 5 5M5 19h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
const icon = (k, w) => svg(ICON[k] || ICON.hanger, w);

/* =========================================================================
   State & storage
   ========================================================================= */
const state = {
  mode: "loading", // db | local
  items: [], looks: [], products: [], chat: [],
  profile: { name: "", styles: [], sizes: { top: "", bottom: "", shoes: "" } },
  tab: "home", filter: "all", sort: "new", wq: "",
  outTab: "build",
  gen: { occasion: "everyday", season: currentSeason(), weather: SEASON_WEATHER[currentSeason()], style: "", pin: null },
  results: null, buy: null,
  build: { picks: {}, productIds: [], occasion: "everyday", style: "", name: "" },
  sq: "", sgroup: "all",
  shopF: { q: "", store: "", cat: "", min: "", max: "", size: "", color: "", style: "", fav: false },
  sample: null, canSeeImages: false, aiVia: "rules",
  me: { photo: null, busy: false, error: "", profile: null, result: null },
};
let db = null, uid = null;
const COLS = { items: ["wardrobe", "items"], looks: ["looks", "saved"], products: ["shop", "products"], prefs: ["profile", "prefs"] };
const col = (name) => db.doc(`data/users/${uid}/${COLS[name][0]}`).collection(COLS[name][1]);
const LS_KEY = "wardrobe-ai-v1";

function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY); if (!raw) return;
    const d = JSON.parse(raw);
    state.items = d.items || []; state.looks = d.looks || []; state.products = d.products || [];
    if (d.profile) state.profile = normProfile(d.profile);
  } catch (e) {}
}
function lsSave() {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ items: state.items, looks: state.looks, products: state.products, profile: state.profile })); return true; }
  catch (e) { toast(t("toast.storageFull")); return false; }
}
function normProfile(p) {
  return { name: typeof p.name === "string" ? p.name.slice(0, 40) : "", styles: Array.isArray(p.styles) ? p.styles.filter((s) => STYLE[s]) : [], sizes: { top: "", bottom: "", shoes: "", ...(p.sizes || {}) } };
}
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Generic create/update and delete for a collection; works for both account storage and this-browser storage.
async function put(name, obj) {
  const body = { ...obj }; delete body.id;
  for (const k of Object.keys(body)) if (body[k] === undefined || k.startsWith("_")) delete body[k];
  if (state.mode === "db") return col(name).doc(obj.id).set(body);
  const list = state[name]; const i = list.findIndex((x) => x.id === obj.id);
  if (i >= 0) list[i] = { ...obj }; else list.push({ ...obj });
  lsSave(); render();
}
async function del(name, id) {
  if (state.mode === "db") return col(name).doc(id).delete();
  state[name] = state[name].filter((x) => x.id !== id); lsSave(); render();
}
async function saveProfile() {
  if (state.mode === "db") { try { await col("prefs").doc("main").set({ ...state.profile }); } catch (e) { toast(t("toast.saveFailed")); } }
  else lsSave();
}

function setStatus() {
  const el = document.getElementById("status"); if (!el) return;
  el.textContent = state.mode === "db" ? t("status.synced") : state.mode === "local" ? t("status.local") : t("status.loading");
}
async function initStorage() {
  lsLoad();
  const fallback = () => { if (state.mode !== "db") { state.mode = "local"; setStatus(); render(); } };
  const timer = setTimeout(fallback, 10000);
  try {
    if (!window.claude || !window.claude.use) { clearTimeout(timer); fallback(); return; }
    const [d, u] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!d || !u) { clearTimeout(timer); fallback(); return; }
    const id = await u.id();
    if (!id) { clearTimeout(timer); fallback(); return; }
    db = d; uid = id;
    let first = true;
    col("items").onSnapshot((snap) => {
      if (first) { clearTimeout(timer); first = false; state.mode = "db"; setStatus(); }
      state.items = snap.docs.map((s) => ({ id: s.id, ...s.data() })); render();
    }, () => { clearTimeout(timer); fallback(); });
    col("looks").onSnapshot((snap) => { state.looks = snap.docs.map((s) => ({ id: s.id, ...s.data() })); render(); }, () => {});
    col("products").onSnapshot((snap) => { state.products = snap.docs.map((s) => ({ id: s.id, ...s.data() })); render(); }, () => {});
    col("prefs").onSnapshot((snap) => {
      const m = snap.docs.find((s) => s.id === "main");
      if (m) state.profile = normProfile(m.data());
      if (!state.profile.name) { (async () => { try { const nm = typeof u.name === "function" ? await u.name() : ""; if (nm) { state.profile.name = String(nm).split(/\s+/)[0]; render(); } } catch (e) {} })(); }
      render();
    }, () => {});
  } catch (e) { clearTimeout(timer); fallback(); }
}

/* =========================================================================
   AI: Claude (inside claude.ai) or our own proxy (GitHub Pages), else rules
   ========================================================================= */
// Cloudflare Worker URL that forwards to Gemini. Empty = built-in styling rules only.
const AI_URL = "https://wardrobe-ai.azizabden24.workers.dev/";
const blobToBase64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] || ""); r.onerror = rej; r.readAsDataURL(blob); });
function proxySample() {
  return {
    limits: async () => ({ images: true }),
    json: async (prompt, o = {}) => {
      const images = [];
      for (const b of o.images || []) images.push({ mime: b.type || "image/jpeg", data: await blobToBase64(b) });
      const r = await fetch(AI_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, images }) });
      if (!r.ok) { const e = new Error("ai"); e.code = r.status === 429 ? "rate_limited" : "upstream"; throw e; }
      return r.json();
    },
  };
}
async function initAI() {
  try {
    if (!window.claude || !window.claude.use) {
      if (AI_URL) { state.sample = proxySample(); state.canSeeImages = true; state.aiVia = "proxy"; render(); }
      return;
    }
    const s = await window.claude.use("sample");
    if (!s) return;
    state.sample = s; state.aiVia = "claude";
    const lim = await s.limits().catch(() => null);
    state.canSeeImages = !!(lim && lim.images);
    render();
  } catch (e) {}
}
function aiErrorText(e) {
  const c = e && e.code;
  if (c === "not_granted" || c === "sampling_disabled" || c === "not_declared" || c === "capability_disabled") return t("ai.unavailable");
  if (c === "rate_limited") return t("ai.rateLimited");
  if (c === "cancelled") return "";
  return t("ai.failed");
}

/* =========================================================================
   Wardrobe helpers
   ========================================================================= */
const items = () => state.items.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
const hasItems = () => state.items.length > 0;
const itemById = (id) => state.items.find((x) => x.id === id);
const productById = (id) => state.products.find((x) => x.id === id);
const nounOf = (cat) => t("noun." + catKey(cat));
const itemName = (it) => it.name || `${cap(colorName(it.color))} ${nounOf(it.category)}`.trim();
const productName = (p) => p.name || `${p.brand || RET[p.retailer]?.name || ""}`;

/* ---------- matching (colour wheel + style profile) ---------- */
const V = {
  mul: (M, v) => [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]],
  rot: (deg) => { const r = (deg * Math.PI) / 180; return [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r)]; },
  len: (v) => Math.hypot(v[0], v[1]),
  dist: (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]),
  cos: (u, v) => { const l = V.len(u) * V.len(v); return l ? (u[0] * v[0] + u[1] * v[1]) / l : 0; },
};
function colorVec(id) { const c = COL[id]; if (!c || c.n) return [0, 0]; const r = (c.h * Math.PI) / 180; return [c.c * Math.cos(r), c.c * Math.sin(r)]; }
const HARMONY = [{ deg: 0, w: 0.8, k: "tonal" }, { deg: 30, w: 0.9, k: "analogous" }, { deg: -30, w: 0.9, k: "analogous" }, { deg: 120, w: 0.75, k: "triadic" }, { deg: -120, w: 0.75, k: "triadic" }, { deg: 180, w: 0.95, k: "complementary" }];
function harmonyOf(a, b) {
  const u = colorVec(a), v = colorVec(b);
  if (!V.len(u) || !V.len(v)) return { score: 1, kind: null };
  let best = { score: 0, kind: null };
  for (const H of HARMONY) { const s = H.w * Math.pow(Math.max(0, V.cos(V.mul(V.rot(H.deg), u), v)), 8); if (s > best.score) best = { score: s, kind: H }; }
  return { score: 0.15 + 0.85 * best.score, kind: best.score > 0.3 ? best.kind : null };
}
const WARMTH = { summer: -0.8, spring: -0.15, all: 0, autumn: 0.35, winter: 0.85 };
const OCC_X = { sport: -0.85, everyday: -0.2, study: -0.15, party: -0.05, date: 0.3, work: 0.6 };
const WEATHER_Y = { cold: 0.75, cool: 0.3, warm: -0.2, hot: -0.7 };
const clamp1 = (x) => Math.max(-1, Math.min(1, x));
function itemVec(it) { let y = WARMTH[it.season] ?? 0; if (catKey(it.category) === "jackets") y += 0.3; return [clamp1(styleF(it.style)), clamp1(y)]; }
function outfitVec(list) {
  let sx = 0, sy = 0, sw = 0;
  for (const it of list) { const w = ["accessories", "bags"].includes(catKey(it.category)) ? 0.5 : 1; const v = itemVec(it); sx += v[0] * w; sy += v[1] * w; sw += w; }
  return sw ? [sx / sw, sy / sw] : [0, 0];
}
function contextTarget(o) {
  if (o.target) return o.target;
  let x = OCC_X[o.occasion] ?? 0;
  if (o.style && STYLE[o.style]) x = 0.4 * x + 0.6 * STYLE[o.style].f;
  return [x, WEATHER_Y[o.weather] ?? 0];
}
const seasonOk = (it, season) => !season || it.season === "all" || it.season === season;
function occasionOk(it, occ) {
  const k = catKey(it.category);
  if (k === "shoes" || k === "accessories" || k === "bags") return occ !== "sport" || ["sporty", "athleisure"].includes(styleId(it.style)) || it.occasion === "sport";
  return it.occasion === occ || Math.abs(styleF(it.style) - (OCC_X[occ] ?? 0)) <= 0.6;
}
const isMain = (it) => !["accessories", "bags"].includes(catKey(it.category));
function scoreOutfit(list, o) {
  const colors = list.map((i) => i.color);
  let pairs = 0, sum = 0;
  for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) { sum += harmonyOf(colors[i], colors[j]).score; pairs++; }
  const harmony = pairs ? sum / pairs : 1;
  const accents = colors.filter((c) => COL[c] && !COL[c].n).length;
  const fs = list.filter(isMain).map((i) => styleF(i.style));
  const spread = fs.length ? Math.max(...fs) - Math.min(...fs) : 0;
  const fit = Math.max(0, 1 - V.dist(outfitVec(list), contextTarget(o)) / 1.6);
  let score = 22 + harmony * 33 + fit * 33;
  score += spread <= 0.35 ? 10 : spread <= 0.8 ? 5 : -12;
  if (accents > 2) score -= 10;
  if (o.occasion) score += list.filter((i) => i.occasion === o.occasion).length * 1.5;
  if (o.style) score += list.filter((i) => styleId(i.style) === o.style).length * 4;
  if (state.profile.styles.length) score += list.filter((i) => state.profile.styles.includes(styleId(i.style))).length * 2;
  if (o.prefer) score += list.filter((i) => o.prefer.includes(i.color)).length * 4;
  if (o.avoid) score -= list.filter((i) => o.avoid.includes(i.color)).length * 6;
  score -= list.filter((i) => !seasonOk(i, o.season)).length * 6;
  return { score: Math.max(0, Math.min(100, Math.round(score))), spread };
}
// Reasons are built at render time so they follow the selected language.
function explain(list, o) {
  const out = [];
  const neutrals = [...new Set(list.filter((i) => COL[i.color]?.n).map((i) => colorName(i.color)))];
  const accentIds = [...new Set(list.filter((i) => COL[i.color] && !COL[i.color].n).map((i) => i.color))];
  if (!accentIds.length) out.push(t("why.neutral", { colors: neutrals.join(", ") || "—" }));
  else if (accentIds.length === 1) out.push(t("why.oneAccent", { color: colorName(accentIds[0]) }));
  else { const h = harmonyOf(accentIds[0], accentIds[1]); out.push(h.kind ? t("why.harmony", { a: cap(colorName(accentIds[0])), b: colorName(accentIds[1]), kind: t("harmony." + h.kind.k) }) : t("why.bold", { a: cap(colorName(accentIds[0])), b: colorName(accentIds[1]) })); }
  const { spread } = scoreOutfit(list, o);
  const sts = [...new Set(list.filter(isMain).map((i) => styleName(i.style)).filter(Boolean))];
  if (spread <= 0.35 && sts.length) out.push(t("why.oneStyle", { style: sts[0] }));
  else if (spread <= 0.8) out.push(t("why.mix", { styles: sts.join(" + ") || "—" }));
  else out.push(t("why.clash"));
  if (list.some((i) => catKey(i.category) === "jackets") && (o.weather === "cold" || o.weather === "cool")) out.push(t("why.layer." + o.weather));
  const off = list.filter((i) => !seasonOk(i, o.season));
  if (o.season) out.push(off.length ? t("why.offSeason", { item: itemName(off[0]) }) : t("why.season", { season: t("season." + o.season) }));
  return out;
}

/* ---------- outfit generator ---------- */
function generate(o, count = 3) {
  const all = items();
  const pool = (pred, strict) => all.filter((i) => pred(i) && (!strict || ((!o.occasion || occasionOk(i, o.occasion)) && seasonOk(i, o.season))));
  const pick = (pred) => { const s = pool(pred, true); return (s.length ? s : pool(pred, false)).slice(0, 12); };
  let tops = pick((i) => catKey(i.category) === "tops" && i.category !== "dresses");
  let dresses = pick((i) => i.category === "dresses");
  let bottoms = pick((i) => catKey(i.category) === "bottoms");
  let shoes = pick((i) => catKey(i.category) === "shoes");
  let jackets = o.weather === "cold" || o.weather === "cool" ? pick((i) => catKey(i.category) === "jackets") : [];
  const accs = pick((i) => ["accessories", "bags"].includes(catKey(i.category)));
  const pin = o.pin ? itemById(o.pin) : null;
  if (pin) {
    const k = catKey(pin.category);
    if (pin.category === "dresses") { dresses = [pin]; tops = []; bottoms = []; }
    else if (k === "tops") { tops = [pin]; dresses = []; }
    else if (k === "bottoms") { bottoms = [pin]; dresses = []; }
    else if (k === "shoes") shoes = [pin];
    else if (k === "jackets") jackets = [pin];
  }
  const missing = [];
  if (!(tops.length && bottoms.length) && !dresses.length) { if (!tops.length) missing.push(t("need.top")); if (!bottoms.length) missing.push(t("need.bottom")); }
  if (!shoes.length) missing.push(t("need.shoes"));
  if (missing.length) return { error: t("gen.missing", { list: missing.join(", ") }) };
  const bases = [];
  for (const a of tops) for (const b of bottoms) bases.push([a, b]);
  for (const d of dresses) bases.push([d]);
  const combos = [];
  for (const base of bases) for (const sh of shoes) for (const j of jackets.length ? jackets : [null]) {
    const list = [base[0]]; if (j) list.push(j); list.push(...base.slice(1), sh);
    let best = { list, s: scoreOutfit(list, o).score };
    for (const a of accs) { const w = [...list, a]; const s = scoreOutfit(w, o).score; if (s >= best.s) best = { list: w, s }; }
    combos.push(best);
  }
  if (pin && ["accessories", "bags"].includes(catKey(pin.category))) combos.forEach((c) => { if (!c.list.includes(pin)) { c.list.push(pin); c.s = scoreOutfit(c.list, o).score; } });
  combos.sort((a, b) => b.s - a.s);
  const chosen = [];
  for (const c of combos) {
    if (chosen.length >= count) break;
    const ids = new Set(c.list.map((i) => i.id));
    if (!chosen.some((x) => x.list.filter((i) => ids.has(i.id)).length >= Math.min(ids.size, x.list.length) - (pin ? 0 : 1))) chosen.push(c);
  }
  for (const c of combos) { if (chosen.length >= count) break; if (!chosen.includes(c)) chosen.push(c); }
  const keys = ["look.main", "look.alt", "look.bold"];
  return { looks: chosen.map((c, i) => ({ titleKey: keys[i] || "look.option", itemIds: c.list.map((x) => x.id), productIds: [], score: c.s, occasion: o.occasion, season: o.season, weather: o.weather, style: o.style || "" })) };
}

/* ---------- what to buy next ---------- */
function buySuggestion(o) {
  const tgt = contextTarget(o);
  const r = generate(o, 1);
  const all = items();
  const missingCat = ["tops", "bottoms", "shoes"].find((c) => !all.some((i) => catKey(i.category) === c));
  let w = tgt, look = [];
  if (!r.error) {
    look = r.looks[0].itemIds.map(itemById).filter((i) => i && isMain(i));
    const n = look.length, v = outfitVec(look);
    w = [clamp1((n + 1) * tgt[0] - n * v[0]), clamp1((n + 1) * tgt[1] - n * v[1])];
  }
  const cat = missingCat || ((o.weather === "cold" || o.weather === "cool") && w[1] > 0.45 && !all.some((i) => catKey(i.category) === "jackets") ? "jackets" : "tops");
  const nounKey = { tops: w[1] > 0.3 ? "knit" : w[0] > 0.3 ? "shirt" : "tee", bottoms: w[0] > 0.3 ? "trousers" : "jeans", jackets: w[1] > 0.6 ? "coat" : "jacket", shoes: w[0] > 0.3 ? "boots" : "sneakers" }[cat] || "tee";
  let color = (o.prefer || []).find((c) => !look.some((i) => i.color === c));
  if (!color) {
    const accent = look.find((i) => V.len(colorVec(i.color)));
    if (accent) { const tg = V.mul(V.rot(180), colorVec(accent.color)); color = COLORS.filter((c) => !c.n).sort((a, b) => V.cos(colorVec(b.id), tg) - V.cos(colorVec(a.id), tg))[0].id; }
    else color = w[1] > 0.2 ? "beige" : "white";
  }
  const st = STYLES.slice().sort((a, b) => Math.abs(a.f - w[0]) - Math.abs(b.f - w[0]))[0];
  return { cat, color, nounKey, style: o.style || st.id, missing: !!missingCat };
}
const buyQuery = (b) => `${t("color." + b.color)} ${t("buy." + b.nounKey)}`;

/* =========================================================================
   Photos: compress on the device
   ========================================================================= */
function loadImage(file) {
  return new Promise((res, rej) => { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { res(img); URL.revokeObjectURL(url); }; img.onerror = () => { rej(new Error("bad")); URL.revokeObjectURL(url); }; img.src = url; });
}
async function compress(file) {
  if (!file.type.startsWith("image/")) throw new Error(t("photo.notImage"));
  if (file.size > 20 * 1024 * 1024) throw new Error(t("photo.tooBig"));
  let img; try { img = await loadImage(file); } catch (e) { throw new Error(t("photo.cantOpen")); }
  let max = 900, q = 0.8, dataUrl = "", blob = null;
  for (let a = 0; a < 6; a++) {
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
    dataUrl = c.toDataURL("image/jpeg", q); blob = await new Promise((r) => c.toBlob(r, "image/jpeg", q));
    if (dataUrl.length < 170000) break;
    max = Math.round(max * 0.82); q = Math.max(0.55, q - 0.06);
  }
  return { dataUrl, blob };
}

/* =========================================================================
   Rendering helpers
   ========================================================================= */
const main = document.getElementById("main");
const LOOKS = new Map(); let lookSeq = 0;
const regLook = (l) => { const k = "L" + ++lookSeq; LOOKS.set(k, l); return k; };
const optList = (ids, val, label, any) => (any ? `<option value="">${esc(any)}</option>` : "") + ids.map((id) => `<option value="${id}" ${id === val ? "selected" : ""}>${esc(label(id))}</option>`).join("");
const styleOptions = (val, any) => {
  const pref = state.profile.styles;
  const ordered = [...pref, ...STYLES.map((s) => s.id).filter((id) => !pref.includes(id))];
  return optList(ordered, val, (id) => STYLE[id].name[L()], any);
};
function placeholder(cat, label) { return `<div class="ph">${icon(catKey(cat), 1.1)}${label ? `<span>${esc(label)}</span>` : ""}</div>`; }
function thumb(obj, kind) {
  if (obj.img) return `<img src="${esc(obj.img)}" alt="${esc(kind === "p" ? productName(obj) : itemName(obj))}" loading="lazy">`;
  return placeholder(obj.category, kind === "p" ? (RET[obj.retailer]?.name || "") : t("cat." + catKey(obj.category)));
}
function emptyState({ icon: ic = "hanger", title, text, actions = "" }) {
  return `<div class="empty"><span class="ring">${icon(ic, 1.2)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${actions ? `<div class="btn-row">${actions}</div>` : ""}</div>`;
}
function itemCard(it, { actions = true } = {}) {
  const c = COL[it.color];
  return `<article class="item">
    <button class="media" data-open="${esc(it.id)}" aria-label="${esc(t("aria.open", { name: itemName(it) }))}">${thumb(it)}</button>
    ${actions ? `<div class="acts"><button class="icon-btn" data-open="${esc(it.id)}" aria-label="${esc(t("aria.edit", { name: itemName(it) }))}" title="${esc(t("btn.edit"))}">${icon("edit", 1.6)}</button><button class="icon-btn danger" data-del="${esc(it.id)}" aria-label="${esc(t("aria.delete", { name: itemName(it) }))}" title="${esc(t("btn.delete"))}">${icon("trash", 1.6)}</button></div>` : ""}
    <div class="info"><div class="name">${esc(itemName(it))}</div>
      <div class="tags">${it.brand ? `<span class="tag">${esc(it.brand)}</span>` : `<span class="tag">${esc(t("cat." + catKey(it.category)))}</span>`}${c ? `<span class="tag"><span class="sw" style="background:${c.hex}"></span>${esc(colorName(it.color))}</span>` : ""}${it.size ? `<span class="tag">${esc(it.size)}</span>` : ""}</div></div>
  </article>`;
}
function productCard(p) {
  const r = RET[p.retailer];
  return `<article class="item product">
    <div class="media">${thumb(p, "p")}<span class="badge lav pos">${esc(t("shop.manual"))}</span></div>
    <div class="acts"><button class="icon-btn" data-pfav="${esc(p.id)}" aria-pressed="${!!p.favorite}" aria-label="${esc(t("aria.fav"))}" title="${esc(t("aria.fav"))}">${icon("heart", 1.6)}</button><button class="icon-btn" data-pedit="${esc(p.id)}" aria-label="${esc(t("btn.edit"))}" title="${esc(t("btn.edit"))}">${icon("edit", 1.6)}</button></div>
    <div class="info"><div class="name">${esc(productName(p))}</div>
      <div class="sub">${esc([p.brand, r?.name].filter(Boolean).join(" · "))}${p.category ? " · " + esc(t("cat." + catKey(p.category))) : ""}</div>
      ${p.priceKzt ? `<div class="price">${money(p.priceKzt)}</div><div class="sub">${esc(t("shop.checked", { date: fmtDate(p.checkedAt || p.createdAt) }))}</div>` : `<div class="sub">${esc(t("shop.priceOnSite"))}</div>`}
      ${p.sizes ? `<div class="sub">${esc(t("shop.sizesNoted", { sizes: p.sizes }))}</div>` : ""}
      ${p.url ? `<a class="link" style="justify-self:start;margin-top:6px" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(t("shop.open", { store: r?.name || "" }))} ↗</a>` : ""}
    </div>
  </article>`;
}
function collage(list, prods = []) {
  const ordered = [...list.filter(isMain), ...prods.map((p) => ({ ...p, _p: true })), ...list.filter((i) => !isMain(i))];
  const n = ordered.length; const shown = ordered.slice(0, 3);
  if (!n) return `<div class="collage n1"><div class="c">${placeholder("tops")}</div></div>`;
  return `<div class="collage ${n === 1 ? "n1" : n === 2 ? "n2" : ""}">${shown.map((o, k) => `<div class="c">${thumb(o, o._p ? "p" : "i")}${o._p ? `<span class="badge lav shop-tag">${esc(t("badge.shop"))}</span>` : ""}${k === 2 && n > 3 ? `<span class="badge more">+${n - 3}</span>` : ""}</div>`).join("")}</div>`;
}
const lookItems = (l) => (l.itemIds || []).map(itemById).filter(Boolean);
const lookProducts = (l) => (l.productIds || []).map(productById).filter(Boolean);
function lookMeta(l) {
  const parts = [];
  if (l.occasion && OCCASIONS.includes(l.occasion)) parts.push(t("occ." + l.occasion));
  if (l.style && STYLE[l.style]) parts.push(STYLE[l.style].name[L()]);
  else if (l.season && SEASONS.includes(l.season)) parts.push(t("season." + l.season));
  return parts.map(cap).join(" · ") || t("look.label");
}
function lookTitle(l) {
  if (l.titleKey) return t(l.titleKey);
  const p = String(l.title || t("look.untitled")).split(" · ");
  return p.length > 1 ? p.slice(1).join(" · ") : p[0];
}
function lookWhy(l) { if (l.aiWhy) return [l.aiWhy]; const its = lookItems(l); return its.length ? explain(its, l) : []; }
function lookCard(l, { saved = false, savable = true } = {}) {
  const its = lookItems(l), prods = lookProducts(l);
  if (!its.length && !prods.length) return "";
  const k = regLook({ ...l, _saved: saved, _savable: savable });
  return `<article class="look">
    <div style="position:relative"><button class="collage-btn" data-look="${k}" aria-label="${esc(t("aria.lookDetails"))}">${collage(its, prods)}</button>
      ${saved ? `<button class="icon-btn fav-pos" data-lfav="${esc(l.id)}" aria-pressed="${!!l.favorite}" aria-label="${esc(t("aria.fav"))}" title="${esc(t("aria.fav"))}">${icon("heart", 1.6)}</button>` : ""}</div>
    <div class="look-meta"><span class="eyebrow">${esc(lookMeta(l))}</span>${l.score != null ? `<span class="match" title="${esc(t("look.matchHint"))}">${esc(t("look.match", { n: l.score }))}</span>` : ""}</div>
    <h3 class="look-title">${esc(lookTitle(l))}</h3>
    <div class="look-actions"><button class="btn sm" data-look="${k}">${esc(t("btn.details"))}</button>${saved ? `<button class="btn sm danger" data-unsave="${esc(l.id)}">${esc(t("btn.remove"))}</button>` : savable ? `<button class="btn sm primary" data-save="${k}">${esc(t("btn.saveLook"))}</button>` : ""}</div>
  </article>`;
}
const lookBody = (l) => {
  const o = { itemIds: l.itemIds || [], productIds: l.productIds || [], score: l.score ?? null, occasion: l.occasion || "", season: l.season || "", weather: l.weather || "", style: l.style || "", favorite: !!l.favorite };
  if (l.titleKey) o.titleKey = l.titleKey; if (l.title) o.title = l.title; if (l.aiWhy) o.aiWhy = l.aiWhy;
  return o;
};
function greeting() { const h = new Date().getHours(); return t(h < 5 ? "greet.evening" : h < 12 ? "greet.morning" : h < 18 ? "greet.afternoon" : "greet.evening"); }

/* =========================================================================
   Screens
   ========================================================================= */
function renderHome() {
  const n = state.items.length, nm = state.profile.name;
  const dateStr = fmtDate(Date.now(), { weekday: "long", day: "numeric", month: "long" });
  const daily = n ? generate({ ...state.gen, pin: null }, 3) : null;
  const myStyles = state.profile.styles;
  const steps = [
    { done: n > 0, title: t("home.step1"), text: t("home.step1t"), act: `data-act="add"` },
    { done: myStyles.length > 0, title: t("home.step2"), text: t("home.step2t"), act: `data-go="styles"` },
    { done: state.chat.length > 0, title: t("home.step3"), text: t("home.step3t"), act: `data-go="stylist"` },
  ];
  return `<section class="screen">
    <div class="hello">
      <span class="eyebrow">${esc(cap(dateStr))} · ${esc(cap(t("season." + currentSeason())))}</span>
      <h1 class="display">${esc(greeting())}${nm ? ", " + esc(nm) : ""}.<br><em>${esc(n ? t("home.titleHas") : t("home.titleEmpty"))}</em></h1>
      <p class="lede">${esc(n ? t("home.ledeHas") : t("home.ledeEmpty"))}</p>
      <div class="btn-row" style="margin-top:8px;max-width:520px"><button class="btn primary" data-act="add">${icon("plus", 1.6)}${esc(t("btn.addItem"))}</button><button class="btn" data-go="${n ? "outfits" : "styles"}">${esc(n ? t("btn.buildLook") : t("btn.exploreStyles"))}</button></div>
    </div>
    <div class="stats">
      <div class="stat"><b>${n}</b><span>${esc(t("stat.items"))}</span></div>
      <div class="stat"><b>${state.looks.length}</b><span>${esc(t("stat.looks"))}</span></div>
      <div class="stat"><b>${myStyles.length}</b><span>${esc(t("stat.styles"))}</span></div>
    </div>
    ${steps.some((s) => !s.done) ? `<div><div class="sec-h"><h2>${esc(t("home.getStarted"))}</h2></div><div class="steps">${steps.map((s, i) => `<button class="step ${s.done ? "done" : ""}" ${s.act}><i>${s.done ? "✓" : "0" + (i + 1)}</i><b>${esc(s.title)}</b><span>${esc(s.text)}</span></button>`).join("")}</div></div>` : ""}
    ${daily && !daily.error ? `<div><div class="sec-h"><h2>${esc(t("home.recommended"))}</h2><button class="link" data-go="outfits">${esc(t("btn.allLooks"))}</button></div><div class="rail looks-rail">${daily.looks.map((l) => lookCard(l)).join("")}</div></div>`
      : daily && daily.error ? `<div class="banner"><span>${esc(daily.error)}</span><button class="btn sm primary" data-act="add">${esc(t("btn.addItem"))}</button></div>` : ""}
    <div class="cta">
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:10px"><span class="eyebrow">${esc(t("nav.stylist"))}</span><h2>${esc(t("home.ctaTitle"))}</h2><p>${esc(t("home.ctaText"))}</p></div>
      <button class="fake-input" data-go="stylist"><span>${esc(t("home.ctaPlaceholder"))}</span><i>${icon("arrow", 1.8)}</i></button>
    </div>
    ${myStyles.length ? `<div><div class="sec-h"><h2>${esc(t("home.yourStyles"))}</h2><button class="link" data-go="styles">${esc(t("btn.edit"))}</button></div><div class="chips">${myStyles.map((s) => `<button class="chip" data-style="${s}">${esc(STYLE[s].name[L()])}</button>`).join("")}</div></div>` : ""}
    ${n ? `<div><div class="sec-h"><h2>${esc(t("home.recent"))}</h2><button class="link" data-go="wardrobe">${esc(t("nav.wardrobe"))}</button></div><div class="rail">${items().slice(0, 6).map((it) => itemCard(it, { actions: false })).join("")}</div></div>` : ""}
    <div><div class="sec-h"><h2>${esc(t("home.shopTitle"))}</h2><button class="link" data-go="shop">${esc(t("nav.shop"))}</button></div>
      <div class="chips">${RETAILERS.map((r) => `<button class="chip" data-go="shop">${esc(r.name)}</button>`).join("")}</div><p class="note" style="margin-top:12px">${esc(t("home.shopText"))}</p></div>
  </section>`;
}

const SORTS = ["new", "old", "name", "color", "brand"];
function sortItems(list) {
  const l = list.slice();
  const idx = (c) => COLORS.findIndex((x) => x.id === c);
  if (state.sort === "old") l.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  else if (state.sort === "name") l.sort((a, b) => itemName(a).localeCompare(itemName(b), locale()));
  else if (state.sort === "color") l.sort((a, b) => idx(a.color) - idx(b.color));
  else if (state.sort === "brand") l.sort((a, b) => (a.brand || "￿").localeCompare(b.brand || "￿", locale()));
  else l.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return l;
}
function renderWardrobe() {
  if (state.mode === "loading") return `<section class="screen"><div><span class="eyebrow">${esc(t("ward.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.wardrobe"))}</h1></div><div class="grid">${[0, 1, 2, 3].map(() => `<div class="skeleton" style="aspect-ratio:3/4"></div>`).join("")}</div></section>`;
  const all = items();
  if (!all.length) return `<section class="screen">
    <div><span class="eyebrow">${esc(t("ward.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.wardrobe"))}</h1></div>
    ${emptyState({ icon: "hanger", title: t("ward.emptyTitle"), text: t("ward.emptyText"), actions: `<button class="btn primary" data-act="add">${icon("camera", 1.6)}${esc(t("btn.addFirst"))}</button><button class="btn" data-act="add-manual">${esc(t("btn.addManual"))}</button>` })}
  </section>`;
  const q = state.wq.trim().toLowerCase();
  const match = (i) => !q || [itemName(i), i.brand, i.description, colorName(i.color), t("cat." + catKey(i.category))].some((s) => s && String(s).toLowerCase().includes(q));
  const inCat = (c) => all.filter((i) => catKey(i.category) === c);
  const active = CATS.includes(state.filter) ? state.filter : null;
  const tile = (id, n) => `<button class="cat" data-filter="${id}" aria-pressed="${(state.filter === id) || (!active && id === "all")}">${icon(id, 1.2)}<b>${esc(id === "all" ? t("ward.all") : t("cat." + id))}</b><span>${n}</span></button>`;
  let body;
  if (active) {
    const list = sortItems(inCat(active).filter(match));
    body = list.length ? `<div class="grid">${list.map((it) => itemCard(it)).join("")}</div>`
      : emptyState({ icon: active, title: t("ward.catEmpty", { cat: t("cat." + active) }), text: q ? t("ward.noMatch") : t("ward.catEmptyText"), actions: q ? "" : `<button class="btn primary" data-act="add">${icon("plus", 1.6)}${esc(t("btn.addItem"))}</button>` });
  } else {
    body = CATS.map((c) => { const list = sortItems(inCat(c).filter(match)); return list.length ? `<div class="group"><div class="sec-h"><h2>${esc(t("cat." + c))}<small>${list.length}</small></h2><button class="link" data-filter="${c}">${esc(t("btn.viewAll"))}</button></div><div class="grid">${list.map((it) => itemCard(it)).join("")}</div></div>` : ""; }).join("") || emptyState({ icon: "search", title: t("ward.noMatchTitle"), text: t("ward.noMatch") });
  }
  const shown = active ? inCat(active).length : all.length;
  return `<section class="screen">
    <div class="page-head"><div><span class="eyebrow">${esc(t("ward.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.wardrobe"))}</h1></div>
      <button class="btn primary" data-act="add">${icon("plus", 1.6)}${esc(t("btn.addItem"))}</button></div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:18px">
      <div class="cats" role="group" aria-label="${esc(t("ward.categories"))}">${tile("all", all.length)}${CATS.map((c) => tile(c, inCat(c).length)).join("")}</div>
      <div class="toolbar">
        <span class="count">${esc(t("ward.count", { n: shown }))}${active ? " · " + esc(t("cat." + active)) : ""}</span>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <div class="search" style="min-width:200px">${icon("search", 1.6)}<input type="search" id="w-q" value="${esc(state.wq)}" placeholder="${esc(t("ward.search"))}" aria-label="${esc(t("ward.search"))}" style="min-height:38px"></div>
          <label class="inline-field">${esc(t("ward.sort"))}<select id="w-sort">${optList(SORTS, state.sort, (s) => t("sort." + s))}</select></label>
        </div>
      </div>
    </div>
    <div id="w-body">${body}</div>
  </section>`;
}

function renderOutfits() {
  const tabs = [["build", t("out.tabBuild")], ["ideas", t("out.tabIdeas")], ["saved", `${t("out.tabSaved")} · ${state.looks.length}`], ["fav", `${t("out.tabFav")} · ${state.looks.filter((l) => l.favorite).length}`]];
  let body = "";
  const noItems = !hasItems();
  if ((state.outTab === "build" || state.outTab === "ideas") && noItems) {
    body = emptyState({ icon: "outfits", title: t("out.emptyTitle"), text: t("out.emptyText"), actions: `<button class="btn primary" data-go="wardrobe">${esc(t("btn.toWardrobe"))}</button>` });
  } else if (state.outTab === "build") body = renderBuilder();
  else if (state.outTab === "ideas") body = renderIdeas();
  else {
    const list = state.looks.filter((l) => state.outTab === "saved" || l.favorite).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const cards = list.map((l) => lookCard(l, { saved: true })).join("");
    body = cards ? `<div class="lookbook">${cards}</div>` : emptyState({ icon: state.outTab === "fav" ? "heart" : "outfits", title: t(state.outTab === "fav" ? "out.favEmpty" : "out.savedEmpty"), text: t(state.outTab === "fav" ? "out.favEmptyText" : "out.savedEmptyText") });
  }
  return `<section class="screen">
    <div><span class="eyebrow">${esc(t("out.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.outfits"))}</h1><p class="lede">${esc(t("out.lede"))}</p></div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:24px"><div class="tabs" role="tablist">${tabs.map(([id, label]) => `<button role="tab" data-otab="${id}" aria-selected="${state.outTab === id}">${esc(label)}</button>`).join("")}</div>${body}</div>
  </section>`;
}
const SLOTS = [
  { id: "top", cat: (i) => catKey(i.category) === "tops" }, { id: "bottom", cat: (i) => catKey(i.category) === "bottoms" },
  { id: "outer", cat: (i) => catKey(i.category) === "jackets" }, { id: "shoes", cat: (i) => catKey(i.category) === "shoes" },
  { id: "acc", cat: (i) => catKey(i.category) === "accessories" }, { id: "bag", cat: (i) => catKey(i.category) === "bags" },
];
function buildList() { return SLOTS.map((s) => itemById(state.build.picks[s.id])).filter(Boolean); }
function renderBuilder() {
  const B = state.build;
  const list = buildList(), prods = B.productIds.map(productById).filter(Boolean);
  const o = { occasion: B.occasion, style: B.style, season: currentSeason(), weather: SEASON_WEATHER[currentSeason()] };
  const score = list.length >= 2 ? scoreOutfit(list, o).score : null;
  const why = list.length >= 2 ? explain(list, o) : [];
  const slot = (s) => {
    const opts = items().filter(s.cat);
    return `<div class="slot"><div class="slot-h"><b>${esc(t("slot." + s.id))}</b>${B.picks[s.id] ? `<button class="link" data-unpick="${s.id}">${esc(t("btn.clear"))}</button>` : `<span class="note">${opts.length}</span>`}</div>
      ${opts.length ? `<div class="pick-rail">${opts.map((i) => `<button class="pick" data-pick="${s.id}" data-id="${esc(i.id)}" aria-pressed="${B.picks[s.id] === i.id}" title="${esc(itemName(i))}" aria-label="${esc(itemName(i))}">${thumb(i)}</button>`).join("")}</div>` : `<div class="pick-empty">${esc(t("slot.none"))}</div>`}</div>`;
  };
  const shopProds = state.products.slice().sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  return `<div class="builder">
    <div class="panel" style="gap:22px">${SLOTS.map(slot).join("")}
      ${shopProds.length ? `<div class="slot"><div class="slot-h"><b>${esc(t("slot.shop"))}</b><span class="badge lav">${esc(t("badge.shop"))}</span></div><div class="pick-rail">${shopProds.map((p) => `<button class="pick" data-pprod="${esc(p.id)}" aria-pressed="${B.productIds.includes(p.id)}" title="${esc(productName(p))}" aria-label="${esc(productName(p))}">${thumb(p, "p")}</button>`).join("")}</div></div>` : ""}
    </div>
    <div class="preview-col"><div class="panel">
      <span class="eyebrow">${esc(t("out.preview"))}</span>
      ${list.length || prods.length ? collage(list, prods) : `<div class="pick-empty" style="text-align:center;padding:40px 14px">${esc(t("out.pickHint"))}</div>`}
      ${score != null ? `<div class="look-meta"><span class="match">${esc(t("look.match", { n: score }))}</span></div>` : ""}
      ${why.length ? `<ul class="why">${why.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : ""}
      <div class="two"><div class="field"><label for="b-occ">${esc(t("f.occasion"))}</label><select id="b-occ">${optList(OCCASIONS, B.occasion, (x) => cap(t("occ." + x)))}</select></div>
        <div class="field"><label for="b-sty">${esc(t("f.style"))}</label><select id="b-sty">${styleOptions(B.style, t("f.anyStyle"))}</select></div></div>
      <div class="field"><label for="b-name">${esc(t("f.lookName"))}</label><input type="text" id="b-name" maxlength="60" value="${esc(B.name)}" placeholder="${esc(t("f.lookNamePh"))}"></div>
      <div class="btn-row"><button class="btn" data-act="b-clear" ${list.length || prods.length ? "" : "disabled"}>${esc(t("btn.clear"))}</button><button class="btn primary" data-act="b-save" ${list.length + prods.length >= 2 ? "" : "disabled"}>${esc(t("btn.saveLook"))}</button></div>
      <button class="btn ghost block" data-act="b-auto">${icon("stylist", 1.5)}${esc(t("out.autofill"))}</button>
    </div></div>
  </div>`;
}
function renderIdeas() {
  const g = state.gen, pin = g.pin ? itemById(g.pin) : null;
  const res = state.results || generate({ ...g }, 3);
  return `<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:32px">
    <form class="panel gen" id="gen-form">
      <div class="field"><label for="g-occ">${esc(t("f.occasion"))}</label><select id="g-occ">${optList(OCCASIONS, g.occasion, (x) => cap(t("occ." + x)))}</select></div>
      <div class="field"><label for="g-sea">${esc(t("f.season"))}</label><select id="g-sea">${optList(SEASONS.filter((s) => s !== "all"), g.season, (x) => cap(t("season." + x)))}</select></div>
      <div class="field"><label for="g-sty">${esc(t("f.style"))}</label><select id="g-sty">${styleOptions(g.style, t("f.anyStyle"))}</select></div>
      <div class="field full"><span class="lbl">${esc(t("f.weather"))}</span><div class="seg" role="group" aria-label="${esc(t("f.weather"))}">${WEATHER.map((w) => `<button type="button" data-weather="${w}" aria-pressed="${g.weather === w}">${esc(t("weather." + w))}</button>`).join("")}</div></div>
      ${pin ? `<div class="pin full"><div class="thumb" style="position:relative;overflow:hidden">${thumb(pin)}</div><span>${esc(t("out.builtAround"))} <b>${esc(itemName(pin))}</b></span><button type="button" class="x" data-unpin aria-label="${esc(t("btn.clear"))}">×</button></div>` : ""}
      <button class="btn primary full" type="submit">${icon("stylist", 1.5)}${esc(t("btn.styleMe"))}</button>
    </form>
    <div id="gen-out">
      <div class="sec-h"><h2>${esc(t("out.styledForYou"))}</h2></div>
      ${res.error ? `<div class="banner"><span>${esc(res.error)}</span><button class="btn sm primary" data-act="add">${esc(t("btn.addItem"))}</button></div>` : `<div class="lookbook">${res.looks.map((l) => lookCard(l)).join("")}</div>`}
    </div>
    <div>${state.buy ? renderBuy(state.buy) : `<button class="btn block ghost" data-act="buy">${icon("shop", 1.5)}${esc(t("out.whatToBuy"))}</button>`}</div>
  </div>`;
}
function storeLinks(q) {
  return `<div class="quick-links">${RETAILERS.map((r) => `<a class="btn sm" href="${esc(r.search(q, L()))}" target="_blank" rel="noopener">${esc(r.name)} ${icon("ext", 1.6)}</a>`).join("")}</div>`;
}
function renderBuy(b) {
  const q = buyQuery(b);
  const matches = state.products.filter((p) => catKey(p.category) === b.cat).slice(0, 4);
  return `<div class="panel">
    <span class="eyebrow">${esc(b.missing ? t("buy.missing") : t("buy.complete"))}</span>
    <h3 style="font-family:var(--f-display);font-size:30px;line-height:1.08">${esc(t("buy.title"))}</h3>
    <span style="display:inline-flex;align-items:center;gap:8px;font-size:16px;font-weight:500"><span class="sw" style="background:${COL[b.color].hex};width:12px;height:12px"></span>${esc(cap(q))}</span>
    <p class="note">${esc(t("buy.text", { style: STYLE[b.style]?.name[L()] || "" }))}</p>
    ${storeLinks(q)}
    ${matches.length ? `<div class="field"><span class="lbl">${esc(t("buy.fromCatalog"))}</span><div class="grid">${matches.map(productCard).join("")}</div></div>` : ""}
    <p class="note" style="font-size:12.5px">${esc(t("buy.disclaimer"))}</p>
  </div>`;
}

function filteredStyles() {
  const q = state.sq.trim().toLowerCase();
  return STYLES.filter((s) => (state.sgroup === "all" || (state.sgroup === "mine" ? state.profile.styles.includes(s.id) : s.group === state.sgroup))
    && (!q || [s.name.en, s.name.ru, s.desc.en, s.desc.ru, ...s.traits.en, ...s.traits.ru].some((x) => x.toLowerCase().includes(q))));
}
function moodboard(s) { return `<div class="mood" aria-hidden="true">${s.palette.map((c) => `<i style="background:${c}"></i>`).join("")}</div>`; }
function styleCard(s) {
  const sel = state.profile.styles.includes(s.id);
  return `<article class="style-card ${sel ? "sel" : ""}">
    ${moodboard(s)}
    <div class="row"><h3>${esc(s.name[L()])}</h3><button class="icon-btn" data-sel="${s.id}" aria-pressed="${sel}" aria-label="${esc(t(sel ? "styles.unselect" : "styles.select"))}" title="${esc(t(sel ? "styles.unselect" : "styles.select"))}">${icon(sel ? "check" : "plus", 1.8)}</button></div>
    <p>${esc(s.desc[L()])}</p>
    <div class="tags">${s.cats.slice(0, 4).map((c) => `<span class="tag">${esc(t("cat." + c))}</span>`).join("")}</div>
    <button class="btn sm" data-style="${s.id}">${esc(t("btn.details"))}</button>
  </article>`;
}
function renderStyles() {
  const groups = ["all", ...WA.STYLE_GROUPS, "mine"];
  const list = filteredStyles();
  return `<section class="screen">
    <div class="page-head"><div><span class="eyebrow">${esc(t("styles.eyebrow"))}</span><h1 class="page-title">${esc(t("styles.title"))}</h1><p class="lede">${esc(t("styles.lede"))}</p></div>
      <span class="badge beige">${esc(t("styles.selectedN", { n: state.profile.styles.length }))}</span></div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:14px">
      <div class="search">${icon("search", 1.6)}<input type="search" id="s-q" value="${esc(state.sq)}" placeholder="${esc(t("styles.search"))}" aria-label="${esc(t("styles.search"))}"></div>
      <div class="chips scroll" role="group">${groups.map((g) => `<button class="chip" data-sgroup="${g}" aria-pressed="${state.sgroup === g}">${esc(t("sgroup." + g))}${g === "mine" ? ` <small>${state.profile.styles.length}</small>` : ""}</button>`).join("")}</div>
    </div>
    <div id="s-grid">${list.length ? `<div class="style-grid">${list.map(styleCard).join("")}</div>` : emptyState({ icon: "search", title: t("styles.noneTitle"), text: t(state.sgroup === "mine" ? "styles.noneMine" : "styles.none") })}</div>
  </section>`;
}

function shopFiltered() {
  const F = state.shopF, q = F.q.trim().toLowerCase();
  return state.products.filter((p) => (!F.store || p.retailer === F.store) && (!F.cat || catKey(p.category) === F.cat)
    && (!F.min || (p.priceKzt && p.priceKzt >= +F.min)) && (!F.max || (p.priceKzt && p.priceKzt <= +F.max))
    && (!F.size || String(p.sizes || "").toLowerCase().split(/[\s,;/]+/).includes(F.size.toLowerCase()))
    && (!F.color || p.color === F.color) && (!F.style || p.style === F.style) && (!F.fav || p.favorite)
    && (!q || [p.name, p.brand, RET[p.retailer]?.name].some((s) => s && s.toLowerCase().includes(q))))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
function shopGrid() {
  const list = shopFiltered();
  if (!state.products.length) return emptyState({ icon: "shop", title: t("shop.emptyTitle"), text: t("shop.emptyText"), actions: `<button class="btn primary" data-act="p-add">${icon("plus", 1.6)}${esc(t("shop.addProduct"))}</button><button class="btn" data-act="p-import">${icon("upload", 1.6)}${esc(t("shop.import"))}</button>` });
  return list.length ? `<div class="grid">${list.map(productCard).join("")}</div>` : emptyState({ icon: "search", title: t("shop.noMatchTitle"), text: t("shop.noMatch") });
}
function renderShop() {
  const F = state.shopF;
  const q = F.q.trim() || t("shop.defaultQuery");
  return `<section class="screen">
    <div class="page-head"><div><span class="eyebrow">${esc(t("shop.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.shop"))}</h1><p class="lede">${esc(t("shop.lede"))}</p></div></div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:14px">
      <div class="search">${icon("search", 1.6)}<input type="search" id="sh-q" value="${esc(F.q)}" placeholder="${esc(t("shop.search"))}" aria-label="${esc(t("shop.search"))}"></div>
      <div class="retailers" id="sh-ret">${RETAILERS.map((r) => `<div class="retailer">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3>${esc(r.name)}</h3><span class="badge">${esc(t("shop.linksOnly"))}</span></div>
        <p>${esc(r.status[L()])}</p>
        <div class="quick-links"><a class="btn sm primary" data-rsearch="${r.id}" href="${esc(r.search(q, L()))}" target="_blank" rel="noopener">${esc(r.searchLabel[L()])} ${icon("ext", 1.6)}</a><a class="btn sm" href="${esc(r.home(L()))}" target="_blank" rel="noopener">${esc(r.homeLabel ? r.homeLabel[L()] : t("shop.visit"))} ${icon("ext", 1.6)}</a></div>
      </div>`).join("")}</div>
    </div>
    <div>
      <div class="sec-h"><h2>${esc(t("shop.catalog"))}<small>${state.products.length}</small></h2><div style="display:flex;gap:14px"><button class="link" data-act="p-import">${esc(t("shop.import"))}</button><button class="link" data-act="p-add">${esc(t("shop.addProduct"))}</button></div></div>
      <p class="note" style="margin:-6px 0 18px">${esc(t("shop.catalogNote"))}</p>
      ${state.products.length ? `<div class="panel filters-panel" style="margin-bottom:24px">
        <div class="field"><label for="sf-store">${esc(t("f.store"))}</label><select id="sf-store" data-sf="store">${optList(RETAILERS.map((r) => r.id), F.store, (id) => RET[id].name, t("f.all"))}</select></div>
        <div class="field"><label for="sf-cat">${esc(t("f.category"))}</label><select id="sf-cat" data-sf="cat">${optList(CATS, F.cat, (c) => t("cat." + c), t("f.all"))}</select></div>
        <div class="field wide"><span class="lbl">${esc(t("f.price"))}</span><div class="price-range"><input type="number" inputmode="numeric" min="0" id="sf-min" data-sf="min" value="${esc(F.min)}" placeholder="${esc(t("f.from"))}" aria-label="${esc(t("f.from"))}">–<input type="number" inputmode="numeric" min="0" id="sf-max" data-sf="max" value="${esc(F.max)}" placeholder="${esc(t("f.to"))}" aria-label="${esc(t("f.to"))}"></div></div>
        <div class="field"><label for="sf-size">${esc(t("f.size"))}</label><input type="text" id="sf-size" data-sf="size" value="${esc(F.size)}" placeholder="M, 42…"></div>
        <div class="field"><label for="sf-color">${esc(t("f.color"))}</label><select id="sf-color" data-sf="color">${optList(COLORS.map((c) => c.id), F.color, (c) => cap(colorName(c)), t("f.all"))}</select></div>
        <div class="field"><label for="sf-style">${esc(t("f.style"))}</label><select id="sf-style" data-sf="style">${styleOptions(F.style, t("f.all"))}</select></div>
        <div class="field" style="align-self:end"><button class="chip" data-act="sf-fav" aria-pressed="${F.fav}" style="min-height:46px;justify-content:center">${icon("heart", 1.6)}${esc(t("shop.favOnly"))}</button></div>
        <div class="field" style="align-self:end"><button class="btn ghost" data-act="sf-reset">${esc(t("btn.reset"))}</button></div>
      </div>` : ""}
      <div id="sh-grid">${shopGrid()}</div>
    </div>
  </section>`;
}

const PROMPTS = ["today", "smart", "match", "uni", "similar"];
function renderStylist() {
  const its = items().slice(0, 12);
  const via = state.aiVia === "claude" ? t("stylist.viaClaude") : state.aiVia === "proxy" ? t("stylist.viaProxy") : t("stylist.viaRules");
  return `<section class="screen">
    <div><span class="eyebrow">${esc(t("stylist.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.stylist"))}</h1></div>
    <div class="stylist">
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:28px;min-width:0">
        <div class="thread" id="chat-list">
          <div class="m-ai"><span class="mono" aria-hidden="true">W</span><div class="body"><p class="text">${esc(t("stylist.hello", { name: state.profile.name ? ", " + state.profile.name : "" }))}</p>${hasItems() ? "" : `<p class="note">${esc(t("stylist.noItems"))}</p>`}</div></div>
          ${state.chat.map(renderMsg).join("")}
        </div>
        <div class="prompts">${(state.chat.length ? PROMPTS.slice(0, 3) : PROMPTS).map((k) => `<button data-tip="${esc(t("prompt." + k))}"><span>${esc(t("promptk." + k))}</span><b>${esc(t("prompt." + k))}</b></button>`).join("")}</div>
      </div>
      <aside class="side">
        <div class="panel">
          <div class="persona"><span class="mono" aria-hidden="true">W</span><div><b>${esc(t("stylist.name"))}</b><span class="sub">${esc(via)}</span></div></div>
          ${state.profile.styles.length ? `<div class="field"><span class="lbl">${esc(t("home.yourStyles"))}</span><div class="chips">${state.profile.styles.map((s) => `<span class="chip" style="cursor:default">${esc(STYLE[s].name[L()])}</span>`).join("")}</div></div>` : `<button class="btn sm" data-go="styles">${esc(t("btn.exploreStyles"))}</button>`}
          ${its.length ? `<div class="field"><span class="lbl">${esc(t("stylist.wardrobe"))}</span><div class="mini-rail">${its.map((i) => `<button data-ask="${esc(i.id)}" title="${esc(t("prompt.withItem", { item: itemName(i) }))}" aria-label="${esc(t("prompt.withItem", { item: itemName(i) }))}">${thumb(i)}</button>`).join("")}</div></div>` : `<button class="btn sm primary" data-act="add">${icon("plus", 1.6)}${esc(t("btn.addFirst"))}</button>`}
        </div>
        ${renderMe()}
      </aside>
    </div>
    <div class="chat-pad"></div>
  </section>`;
}
function renderMsg(m) {
  if (m.role === "user") return `<div class="m-user">${esc(m.text)}</div>`;
  if (m.loading) return `<div class="m-ai loading"><span class="mono" aria-hidden="true">W</span><div class="body"><p class="text">${esc(t("stylist.thinking"))} <span class="typing"><i></i><i></i><i></i></span></p></div></div>`;
  const text = m.textKey ? t(m.textKey, m.vars || {}) : m.text;
  const looks = (m.looks || []).map((l) => lookCard(l, { savable: true })).join("");
  const links = (m.searches || []).filter((s) => RET[s.retailer]);
  return `<div class="m-ai"><span class="mono" aria-hidden="true">W</span><div class="body"><p class="text">${esc(text)}</p>${m.note ? `<p class="note">${esc(m.note)}</p>` : ""}
    ${looks ? `<div class="lookbook">${looks}</div>` : ""}
    ${links.length ? `<div class="store-links"><span class="lbl">${esc(t("stylist.inStores"))}</span><div class="quick-links">${links.map((s) => `<a class="btn sm" href="${esc(RET[s.retailer].search(s.query, L()))}" target="_blank" rel="noopener">${esc(RET[s.retailer].name)}: ${esc(s.query)} ${icon("ext", 1.6)}</a>`).join("")}</div><span class="note" style="font-size:12.5px">${esc(t("stylist.linksNote"))}</span></div>` : ""}
  </div></div>`;
}

/* ---------- outfit from a photo ---------- */
async function analyzeSelfie(blob) {
  const prompt = `You are a stylist. The photo shows a person who wants help choosing clothes. Do not try to identify who it is, and do not judge their looks or body.
Determine: undertone (warm|cool|neutral), contrast (low|medium|high), style_x (-1 sporty..1 formal, from how they are dressed), warmth_y (-1 very light..1 very warm), best_colors (up to 5 ids), avoid_colors (up to 3 ids), summary (2 short sentences in ${L() === "ru" ? "Russian" : "English"}).
Colour ids: ${COLORS.map((c) => c.id).join(", ")}
If there is no person in the photo, return {"no_person": true}.
Otherwise return only JSON: {"undertone":"","contrast":"","style_x":0,"warmth_y":0,"best_colors":[],"avoid_colors":[],"summary":""}`;
  const r = await state.sample.json(prompt, { images: [blob] });
  if (r && r.no_person) return { noPerson: true };
  const num = (x) => (Number.isFinite(+x) ? clamp1(+x) : 0);
  const ids = (a, n) => (Array.isArray(a) ? a.filter((x) => COL[x]).slice(0, n) : []);
  return { undertone: ["warm", "cool", "neutral"].includes(r.undertone) ? r.undertone : "neutral", contrast: ["low", "medium", "high"].includes(r.contrast) ? r.contrast : "medium", p: [num(r.style_x), num(r.warmth_y)], best: ids(r.best_colors, 5), avoid: ids(r.avoid_colors, 3), summary: typeof r.summary === "string" ? r.summary.slice(0, 400) : "" };
}
function meOpts(p) { const g = state.gen; const tg = contextTarget(g); return { occasion: g.occasion, season: g.season, weather: g.weather, style: g.style, target: [0.5 * p.p[0] + 0.5 * tg[0], 0.5 * p.p[1] + 0.5 * tg[1]], prefer: p.best, avoid: p.avoid }; }
function renderMe() {
  const M = state.me, can = state.sample && state.canSeeImages;
  let body = "";
  if (M.photo) {
    body += `<div class="me-row"><img src="${M.photo}" alt=""><div style="min-width:0;display:grid;gap:8px">`;
    if (M.busy) body += `<span class="upload-state"><span class="spinner"></span>${esc(t("me.busy"))}</span>`;
    else if (M.error) body += `<span class="err">${esc(M.error)}</span>`;
    else if (M.profile) body += `<div class="tags"><span class="tag">${esc(t("me.undertone"))}: ${esc(t("me.u." + M.profile.undertone))}</span><span class="tag">${esc(t("me.contrast"))}: ${esc(t("me.c." + M.profile.contrast))}</span></div><div class="tags">${M.profile.best.map((c) => `<span class="tag"><span class="sw" style="background:${COL[c].hex}"></span>${esc(colorName(c))}</span>`).join("")}</div>${M.profile.summary ? `<span class="note">${esc(M.profile.summary)}</span>` : ""}`;
    body += `</div></div>`;
    if (M.result && !M.busy) body += M.result.error ? `<div class="banner">${esc(M.result.error)}</div>` : `<div class="lookbook" style="grid-template-columns:1fr">${M.result.looks.map((l) => lookCard(l)).join("")}</div>`;
  }
  return `<div class="panel"><div style="display:grid;grid-template-columns:minmax(0,1fr);gap:6px"><span class="eyebrow">${esc(t("me.title"))}</span><p style="font-size:14px;color:var(--ink-2)">${esc(t("me.text"))}</p></div>${body}
    <button class="btn ${M.photo ? "" : "primary"} block" data-act="selfie" ${can && !M.busy && hasItems() ? "" : "disabled"}>${icon("camera", 1.6)}${esc(M.photo ? t("me.another") : t("me.choose"))}</button>
    ${!can ? `<p class="note" style="font-size:12.5px">${esc(t("me.needsAI"))}</p>` : !hasItems() ? `<p class="note" style="font-size:12.5px">${esc(t("me.needsItems"))}</p>` : ""}</div>`;
}

function renderProfile() {
  const P = state.profile;
  const aiRow = state.aiVia === "claude" ? ["ok", t("prof.aiClaude")] : state.aiVia === "proxy" ? ["ok", t("prof.aiProxy")] : ["warn", t("prof.aiRules")];
  const rows = [
    [state.mode === "db" ? "ok" : "warn", t("prof.storage"), state.mode === "db" ? t("prof.storageDb") : t("prof.storageLocal")],
    [aiRow[0], t("prof.ai"), aiRow[1]],
    ["warn", t("prof.stores"), t("prof.storesText")],
    ["warn", t("prof.auth"), t("prof.authText")],
  ];
  return `<section class="screen">
    <div><span class="eyebrow">${esc(t("prof.eyebrow"))}</span><h1 class="page-title">${esc(t("nav.profile"))}</h1></div>
    <div class="builder" style="align-items:start">
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:20px;min-width:0">
        <div class="panel">
          <div class="field"><label for="p-name">${esc(t("prof.name"))}</label><input type="text" id="p-name" maxlength="40" value="${esc(P.name)}" placeholder="${esc(t("prof.namePh"))}"></div>
          <div class="field"><span class="lbl">${esc(t("prof.language"))}</span><div class="seg" style="grid-template-columns:1fr 1fr" role="group"><button type="button" data-lang="en" aria-pressed="${L() === "en"}">English</button><button type="button" data-lang="ru" aria-pressed="${L() === "ru"}">Русский</button></div></div>
          <div class="three">
            <div class="field"><label for="p-top">${esc(t("prof.sizeTop"))}</label><input type="text" id="p-top" data-psize="top" maxlength="10" value="${esc(P.sizes.top)}" placeholder="M"></div>
            <div class="field"><label for="p-bottom">${esc(t("prof.sizeBottom"))}</label><input type="text" id="p-bottom" data-psize="bottom" maxlength="10" value="${esc(P.sizes.bottom)}" placeholder="30"></div>
            <div class="field"><label for="p-shoes">${esc(t("prof.sizeShoes"))}</label><input type="text" id="p-shoes" data-psize="shoes" maxlength="10" value="${esc(P.sizes.shoes)}" placeholder="42"></div>
          </div>
          <p class="note">${esc(t("prof.sizesNote"))}</p>
        </div>
        <div class="panel">
          <div class="sec-h" style="margin:0"><h2>${esc(t("home.yourStyles"))}</h2><button class="link" data-go="styles">${esc(t("btn.edit"))}</button></div>
          ${P.styles.length ? `<div class="chips">${P.styles.map((s) => `<button class="chip" data-style="${s}">${esc(STYLE[s].name[L()])}</button>`).join("")}</div>` : `<p class="note">${esc(t("prof.noStyles"))}</p>`}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:20px;min-width:0">
        <div class="panel"><div class="stats" style="border:0"><div class="stat"><b>${state.items.length}</b><span>${esc(t("stat.items"))}</span></div><div class="stat"><b>${state.looks.length}</b><span>${esc(t("stat.looks"))}</span></div><div class="stat"><b>${state.products.length}</b><span>${esc(t("stat.products"))}</span></div></div></div>
        <div class="panel"><span class="eyebrow">${esc(t("prof.status"))}</span><div class="status-list">${rows.map(([c, a, b]) => `<div class="status-row"><i class="${c}"></i><div><b>${esc(a)}</b><span>${esc(b)}</span></div></div>`).join("")}</div></div>
      </div>
    </div>
  </section>`;
}

/* =========================================================================
   Router & render
   ========================================================================= */
const TABS = ["home", "wardrobe", "outfits", "styles", "shop", "stylist", "profile"];
const ALIASES = { looks: "outfits", chat: "stylist" };
function render() {
  LOOKS.clear();
  const tb = state.tab;
  main.innerHTML = tb === "wardrobe" ? renderWardrobe() : tb === "outfits" ? renderOutfits() : tb === "styles" ? renderStyles() : tb === "shop" ? renderShop() : tb === "stylist" ? renderStylist() : tb === "profile" ? renderProfile() : renderHome();
  document.querySelectorAll("[data-tab]").forEach((a) => { if (a.dataset.tab === tb) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  document.getElementById("composer").hidden = tb !== "stylist";
  const av = document.getElementById("avatar"); if (av) { if (state.profile.name) av.textContent = state.profile.name[0].toUpperCase(); else av.innerHTML = icon("user", 1.5).replace("<svg", '<svg width="17" height="17"'); av.setAttribute("aria-label", t("nav.profile")); }
  if (av && !state.profile.name) av.innerHTML = icon("user", 1.5);
}
function route() {
  let h = location.hash.replace("#", "");
  h = ALIASES[h] || h;
  state.tab = TABS.includes(h) ? h : "home";
  render(); window.scrollTo(0, 0);
}
function go(tab) { if (location.hash === "#" + tab) route(); else location.hash = tab; }
window.addEventListener("hashchange", route);

function applyStaticText() {
  document.documentElement.lang = L();
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelectorAll("[data-setlang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.setlang === L()));
  setStatus();
}
function setLang(l) {
  if (l === L()) return;
  const y = window.scrollY;
  if (draft) readDraft(); else if (sheetProduct) readProduct();
  const imp = document.getElementById("imp-json")?.value;
  WA.setLang(l); applyStaticText(); render();
  if (draft) drawSheet(); else if (sheetLook) drawLookSheet(sheetLook); else if (sheetStyle) drawStyleSheet(sheetStyle); else if (sheetProduct) drawProductSheet();
  if (imp && document.getElementById("imp-json")) document.getElementById("imp-json").value = imp;
  window.scrollTo(0, y);
}

/* =========================================================================
   Sheets: item, look, style, product
   ========================================================================= */
const sheetRoot = document.getElementById("sheet-root");
let draft = null, draftBlob = null, sheetLook = null, sheetStyle = null, sheetProduct = null, sheetExtra = {};
const shell = (title, inner) => `<div class="overlay" id="overlay"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="grab"></div><div class="wrap"><div class="sheet-h"><h2 id="sheet-title">${title}</h2><button class="x" data-close aria-label="${esc(t("btn.close"))}">×</button></div>${inner}</div></div></div>`;
const resetSheets = () => { draft = null; sheetLook = null; sheetStyle = null; sheetProduct = null; sheetExtra = {}; };
function closeSheet() { sheetRoot.innerHTML = ""; resetSheets(); document.body.style.overflow = ""; }
const openSheet = (html) => { sheetRoot.innerHTML = html; document.body.style.overflow = "hidden"; };

function openItem(id, extra = {}) {
  const ex = id ? itemById(id) : null;
  resetSheets();
  draft = ex ? { ...ex } : { id: newId(), name: "", category: CATS.includes(state.filter) ? state.filter : "tops", color: "black", brand: "", size: "", description: "", season: "all", style: state.profile.styles[0] || "casual", occasion: "everyday", img: "", createdAt: Date.now() };
  draftBlob = null;
  drawSheet(extra);
  if (!ex && extra.pickPhoto) document.getElementById("file").click();
}
function drawSheet(extra) {
  if (extra) sheetExtra = extra; else extra = sheetExtra;
  const d = draft, isNew = !state.items.some((i) => i.id === d.id);
  const curStyle = styleId(d.style) || "";
  openSheet(shell(esc(isNew ? t("item.new") : t("item.edit")), `
    ${extra.processing ? `<div class="drop"><span class="upload-state"><span class="spinner"></span>${esc(t("photo.processing"))}</span></div>`
      : d.img ? `<div class="preview"><img src="${esc(d.img)}" alt=""><div class="btn-row"><button class="btn sm" data-act="photo">${icon("camera", 1.6)}${esc(t("btn.replacePhoto"))}</button><button class="btn sm" data-act="rm-photo">${esc(t("btn.removePhoto"))}</button></div></div>`
      : `<button class="drop" data-act="photo">${icon("upload", 1.4)}<b>${esc(t("photo.choose"))}</b><span>${esc(t("photo.hint"))}</span></button>`}
    ${extra.uploaded ? `<p class="ok">${esc(t("photo.ready"))}</p>` : ""}
    ${extra.error ? `<p class="err">${esc(extra.error)}</p>` : ""}
    ${d.img && state.sample && state.canSeeImages && draftBlob ? `<button class="btn block" data-act="ai-tag" ${extra.busy ? "disabled" : ""}>${extra.busy ? `<span class="spinner"></span>${esc(t("item.recognising"))}` : `${icon("stylist", 1.5)}${esc(t("item.aiFill"))}`}</button>` : ""}
    ${extra.aiNote ? `<p class="note">${esc(extra.aiNote)}</p>` : ""}
    <div class="field"><label for="f-name">${esc(t("f.name"))}</label><input type="text" id="f-name" value="${esc(d.name)}" placeholder="${esc(itemName({ ...d, name: "" }))}" maxlength="60"></div>
    <div class="two">
      <div class="field"><label for="f-cat">${esc(t("f.category"))}</label><select id="f-cat">${optList(CATS, catKey(d.category), (c) => t("cat." + c))}</select></div>
      <div class="field"><label for="f-brand">${esc(t("f.brand"))}</label><input type="text" id="f-brand" value="${esc(d.brand || "")}" maxlength="40" placeholder="ZARA, Bershka…"></div>
    </div>
    <div class="field"><span class="lbl">${esc(t("f.color"))} · <span class="color-name" id="color-name">${esc(colorName(d.color))}</span></span><div class="colors" role="group" aria-label="${esc(t("f.color"))}">${COLORS.map((c) => `<button type="button" data-color="${c.id}" aria-pressed="${d.color === c.id}" aria-label="${esc(colorName(c.id))}" title="${esc(colorName(c.id))}" style="background:${c.hex}"></button>`).join("")}</div></div>
    <div class="two">
      <div class="field"><label for="f-size">${esc(t("f.size"))}</label><input type="text" id="f-size" value="${esc(d.size || "")}" maxlength="12" placeholder="M, 42, 30/32"></div>
      <div class="field"><label for="f-sty">${esc(t("f.style"))}</label><select id="f-sty">${styleOptions(curStyle, curStyle ? "" : "—")}</select></div>
    </div>
    <div class="two">
      <div class="field"><label for="f-sea">${esc(t("f.season"))}</label><select id="f-sea">${optList(SEASONS, d.season, (x) => cap(t("season." + x)))}</select></div>
      <div class="field"><label for="f-occ">${esc(t("f.occasion"))}</label><select id="f-occ">${optList(OCCASIONS, d.occasion, (x) => cap(t("occ." + x)))}</select></div>
    </div>
    <div class="field"><label for="f-desc">${esc(t("f.description"))}</label><textarea id="f-desc" maxlength="300" placeholder="${esc(t("f.descPh"))}">${esc(d.description || "")}</textarea></div>
    <button class="btn primary block" data-act="save" ${extra.saving || extra.processing ? "disabled" : ""}>${extra.saving ? `<span class="spinner"></span>${esc(t("btn.saving"))}` : esc(isNew ? t("btn.addToWardrobe") : t("btn.saveChanges"))}</button>
    ${isNew ? "" : `<button class="btn block" data-act="pin">${icon("outfits", 1.5)}${esc(t("item.buildWith"))}</button>`}
    ${isNew ? "" : extra.confirmDelete ? `<div class="confirm"><span>${esc(t("item.confirmDelete", { name: itemName(d) }))}</span><div class="btn-row"><button class="btn" data-act="cancel-del">${esc(t("btn.keep"))}</button><button class="btn danger" data-act="del">${icon("trash", 1.6)}${esc(t("btn.delete"))}</button></div></div>` : `<button class="btn danger block ghost" data-act="ask-del">${icon("trash", 1.6)}${esc(t("item.delete"))}</button>`}`));
  if (extra.confirmDelete) requestAnimationFrame(() => sheetRoot.querySelector(".confirm")?.scrollIntoView({ block: "nearest" }));
}
function readDraft() {
  if (!draft) return;
  const v = (id) => document.getElementById(id)?.value;
  if (!document.getElementById("f-name")) return;
  draft.name = (v("f-name") || "").trim().slice(0, 60);
  draft.category = v("f-cat") || draft.category; draft.brand = (v("f-brand") || "").trim().slice(0, 40);
  draft.size = (v("f-size") || "").trim().slice(0, 12); draft.style = v("f-sty") || draft.style;
  draft.season = v("f-sea") || draft.season; draft.occasion = v("f-occ") || draft.occasion;
  draft.description = (v("f-desc") || "").trim().slice(0, 300);
}
function drawLookSheet(l) {
  resetSheets(); sheetLook = l;
  const its = lookItems(l), prods = lookProducts(l), why = lookWhy(l);
  openSheet(shell(esc(lookTitle(l)), `
    <div class="look-meta"><span class="eyebrow">${esc(lookMeta(l))}</span>${l.score != null ? `<span class="match">${esc(t("look.match", { n: l.score }))}</span>` : ""}</div>
    ${collage(its, prods)}
    ${its.length ? `<div class="field"><span class="lbl">${esc(t("look.owned", { n: its.length }))}</span><div class="look-items">${its.map((i) => `<figure><div class="media">${thumb(i)}</div><figcaption>${esc(itemName(i))}</figcaption></figure>`).join("")}</div></div>` : ""}
    ${prods.length ? `<div class="field"><span class="lbl">${esc(t("look.fromStores", { n: prods.length }))}</span><div class="look-items">${prods.map((p) => `<figure><div class="media">${thumb(p, "p")}</div><figcaption>${esc(productName(p))}${p.priceKzt ? " · " + money(p.priceKzt) : ""}</figcaption>${p.url ? `<a class="link" style="justify-self:start" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(RET[p.retailer]?.name || "")} ↗</a>` : ""}</figure>`).join("")}</div></div>` : ""}
    ${why.length ? `<div class="field"><span class="lbl">${esc(t("look.why"))}</span><ul class="why">${why.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>` : ""}
    <div class="btn-row">${l._saved ? `<button class="btn" data-sfav aria-pressed="${!!l.favorite}">${icon("heart", 1.6)}${esc(l.favorite ? t("btn.unfav") : t("btn.fav"))}</button><button class="btn danger" data-sunsave="${esc(l.id)}">${icon("trash", 1.6)}${esc(t("btn.remove"))}</button>` : l._savable ? `<button class="btn primary" data-ssave>${esc(t("btn.saveLook"))}</button>` : ""}<button class="btn" data-close>${esc(t("btn.close"))}</button></div>`));
}
function drawStyleSheet(id) {
  resetSheets(); sheetStyle = id;
  const s = STYLE[id], sel = state.profile.styles.includes(id);
  openSheet(shell(esc(s.name[L()]), `<div class="style-detail" style="display:grid;grid-template-columns:minmax(0,1fr);gap:16px">
    ${moodboard(s)}
    <p style="color:var(--ink-2)">${esc(s.desc[L()])}</p>
    <div class="field"><span class="lbl">${esc(t("styles.traits"))}</span><ul class="list">${s.traits[L()].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="field"><span class="lbl">${esc(t("styles.cats"))}</span><div class="chips">${s.cats.map((c) => `<span class="chip" style="cursor:default">${icon(c, 1.3).replace("<svg", '<svg width="16" height="16"')}${esc(t("cat." + c))}</span>`).join("")}</div></div>
    <div class="field"><span class="lbl">${esc(t("styles.examples"))}</span><ul class="list">${s.outfits[L()].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="btn-row"><button class="btn ${sel ? "" : "primary"}" data-ssel="${id}">${icon(sel ? "check" : "plus", 1.8)}${esc(t(sel ? "styles.selected" : "styles.select"))}</button><button class="btn" data-sbuild="${id}">${icon("outfits", 1.5)}${esc(t("styles.build"))}</button></div>
  </div>`));
}
function drawProductSheet(p, extra = {}) {
  if (p) { resetSheets(); sheetProduct = p; } else p = sheetProduct;
  if (extra.mode === "import" || p.mode === "import") {
    sheetProduct = { mode: "import" };
    openSheet(shell(esc(t("shop.importTitle")), `
      <p class="note">${esc(t("shop.importText"))}</p>
      <pre style="margin:0;white-space:pre-wrap;font-size:12px;color:var(--ink-2);background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:12px;overflow-x:auto">[{"name":"…","brand":"ZARA","retailer":"zara","priceKzt":19990,"category":"tops","sizes":"S, M","color":"white","style":"minimalism","url":"https://www.zara.com/kz/…"}]</pre>
      <div class="field"><label for="imp-json">JSON</label><textarea id="imp-json" style="min-height:160px;font-family:ui-monospace,Menlo,monospace;font-size:13px">${esc(extra.json || "")}</textarea></div>
      ${extra.error ? `<p class="err">${esc(extra.error)}</p>` : ""}
      <button class="btn primary block" data-act="imp-run">${icon("upload", 1.6)}${esc(t("shop.importRun"))}</button>`));
    return;
  }
  const isNew = !state.products.some((x) => x.id === p.id);
  openSheet(shell(esc(isNew ? t("shop.addProduct") : t("shop.editProduct")), `
    <p class="note">${esc(t("shop.addText"))}</p>
    ${extra.processing ? `<div class="drop"><span class="upload-state"><span class="spinner"></span>${esc(t("photo.processing"))}</span></div>` : p.img ? `<div class="preview"><img src="${esc(p.img)}" alt=""><div class="btn-row"><button class="btn sm" data-act="p-photo">${esc(t("btn.replacePhoto"))}</button><button class="btn sm" data-act="p-rmphoto">${esc(t("btn.removePhoto"))}</button></div></div>` : `<button class="drop" data-act="p-photo">${icon("upload", 1.4)}<b>${esc(t("shop.photo"))}</b><span>${esc(t("shop.photoHint"))}</span></button>`}
    <div class="two"><div class="field"><label for="p-ret">${esc(t("f.store"))}</label><select id="p-ret">${optList(RETAILERS.map((r) => r.id), p.retailer, (id) => RET[id].name)}</select></div>
      <div class="field"><label for="p-brand">${esc(t("f.brand"))}</label><input type="text" id="p-brand" maxlength="40" value="${esc(p.brand || "")}"></div></div>
    <div class="field"><label for="p-nm">${esc(t("f.name"))}</label><input type="text" id="p-nm" maxlength="80" value="${esc(p.name || "")}"></div>
    <div class="field"><label for="p-url">${esc(t("shop.url"))}</label><input type="url" id="p-url" value="${esc(p.url || "")}" placeholder="https://"></div>
    <div class="two"><div class="field"><label for="p-price">${esc(t("shop.priceKzt"))}</label><input type="number" inputmode="numeric" min="0" id="p-price" value="${esc(p.priceKzt || "")}"></div>
      <div class="field"><label for="p-sizes">${esc(t("shop.sizes"))}</label><input type="text" id="p-sizes" maxlength="40" value="${esc(p.sizes || "")}" placeholder="S, M, L"></div></div>
    <div class="three"><div class="field"><label for="p-cat">${esc(t("f.category"))}</label><select id="p-cat">${optList(CATS, catKey(p.category || "tops"), (c) => t("cat." + c))}</select></div>
      <div class="field"><label for="p-color">${esc(t("f.color"))}</label><select id="p-color">${optList(COLORS.map((c) => c.id), p.color, (c) => cap(colorName(c)), "—")}</select></div>
      <div class="field"><label for="p-style">${esc(t("f.style"))}</label><select id="p-style">${styleOptions(p.style || "", "—")}</select></div></div>
    ${extra.error ? `<p class="err">${esc(extra.error)}</p>` : ""}
    <button class="btn primary block" data-act="p-save">${esc(isNew ? t("shop.addToCatalog") : t("btn.saveChanges"))}</button>
    ${isNew ? "" : extra.confirmDelete ? `<div class="confirm"><span>${esc(t("shop.confirmDelete"))}</span><div class="btn-row"><button class="btn" data-act="p-keep">${esc(t("btn.keep"))}</button><button class="btn danger" data-act="p-del">${esc(t("btn.delete"))}</button></div></div>` : `<button class="btn danger ghost block" data-act="p-askdel">${icon("trash", 1.6)}${esc(t("btn.delete"))}</button>`}`));
}
function readProduct() {
  const p = sheetProduct; if (!p || p.mode === "import" || !document.getElementById("p-ret")) return;
  const v = (id) => document.getElementById(id)?.value ?? "";
  p.retailer = v("p-ret"); p.brand = v("p-brand").trim().slice(0, 40); p.name = v("p-nm").trim().slice(0, 80); p.url = v("p-url").trim();
  const pr = parseInt(v("p-price"), 10); p.priceKzt = Number.isFinite(pr) && pr > 0 ? pr : null;
  p.sizes = v("p-sizes").trim().slice(0, 40); p.category = v("p-cat"); p.color = v("p-color"); p.style = v("p-style");
}
// Product links must point to the retailer's own site, so the catalog only ever sends people to official pages.
function validProduct(p) {
  if (!p.name) return t("shop.errName");
  if (!RET[p.retailer]) return t("shop.errStore");
  let u; try { u = new URL(p.url); } catch (e) { return t("shop.errUrl"); }
  if (u.protocol !== "https:") return t("shop.errUrl");
  const hosts = RET_HOSTS[p.retailer] || [];
  if (!hosts.some((h) => u.hostname === h || u.hostname.endsWith("." + h))) return t("shop.errHost", { hosts: hosts.join(", ") });
  return "";
}
function cleanProduct(raw, prev = {}) {
  const pr = parseInt(raw.priceKzt, 10);
  const p = { id: prev.id || newId(), name: String(raw.name || "").trim().slice(0, 80), brand: String(raw.brand || "").trim().slice(0, 40), retailer: String(raw.retailer || "").trim().toLowerCase(), url: String(raw.url || "").trim(),
    priceKzt: Number.isFinite(pr) && pr > 0 ? pr : null, sizes: String(raw.sizes || "").trim().slice(0, 40), category: CATS.includes(raw.category) ? raw.category : "tops",
    color: COL[raw.color] ? raw.color : "", style: STYLE[raw.style] ? raw.style : "", img: typeof raw.img === "string" && raw.img.startsWith("data:image/") ? raw.img : (prev.img || ""),
    favorite: !!prev.favorite, createdAt: prev.createdAt || Date.now(), source: "manual" };
  if (p.priceKzt) p.checkedAt = prev.priceKzt === p.priceKzt && prev.checkedAt ? prev.checkedAt : Date.now();
  return p;
}

let photoTarget = "item";
document.getElementById("file").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0]; e.target.value = "";
  if (photoTarget === "product") {
    if (!f || !sheetProduct) return;
    readProduct(); drawProductSheet(null, { processing: true });
    try { const { dataUrl } = await compress(f); sheetProduct.img = dataUrl; drawProductSheet(); }
    catch (err) { drawProductSheet(null, { error: err.message }); }
    return;
  }
  if (!f || !draft) return;
  readDraft(); drawSheet({ processing: true });
  try { const { dataUrl, blob } = await compress(f); draft.img = dataUrl; draftBlob = blob; drawSheet({ uploaded: true }); }
  catch (err) { drawSheet({ error: err.message }); }
});

sheetRoot.addEventListener("click", async (e) => {
  if (e.target.id === "overlay") return closeSheet();
  const b = e.target.closest("button"); if (!b) return;
  if (b.hasAttribute("data-close")) return closeSheet();
  if (sheetStyle) {
    if (b.dataset.ssel) { toggleStyle(b.dataset.ssel); drawStyleSheet(b.dataset.ssel); }
    else if (b.dataset.sbuild) { state.gen.style = b.dataset.sbuild; state.build.style = b.dataset.sbuild; state.results = null; state.outTab = "ideas"; closeSheet(); go("outfits"); }
    return;
  }
  if (sheetLook) {
    const l = sheetLook;
    if (b.hasAttribute("data-ssave")) { b.disabled = true; try { await put("looks", { ...lookBody(l), id: newId(), createdAt: Date.now() }); toast(t("toast.lookSaved")); closeSheet(); } catch (err) { b.disabled = false; toast(t("toast.saveFailed")); } }
    else if (b.hasAttribute("data-sfav")) { const s = state.looks.find((x) => x.id === l.id); if (s) { await toggleFav(s); drawLookSheet({ ...state.looks.find((x) => x.id === l.id) || s, _saved: true }); } }
    else if (b.dataset.sunsave) { try { await del("looks", b.dataset.sunsave); toast(t("toast.lookRemoved")); closeSheet(); } catch (err) { toast(t("toast.removeFailed")); } }
    return;
  }
  if (sheetProduct) return productSheetClick(b);
  if (!draft) return;
  if (b.dataset.color) {
    draft.color = b.dataset.color;
    sheetRoot.querySelectorAll("[data-color]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.color === draft.color));
    document.getElementById("color-name").textContent = colorName(draft.color); return;
  }
  const act = b.dataset.act; readDraft();
  if (act === "photo") { photoTarget = "item"; document.getElementById("file").click(); }
  else if (act === "rm-photo") { draft.img = ""; draftBlob = null; drawSheet({}); }
  else if (act === "ask-del") drawSheet({ confirmDelete: true });
  else if (act === "cancel-del") drawSheet({});
  else if (act === "del") { const name = itemName(draft); try { await del("items", draft.id); for (const k of Object.keys(state.build.picks)) if (state.build.picks[k] === draft.id) delete state.build.picks[k]; closeSheet(); toast(t("toast.deleted", { name })); } catch (err) { drawSheet({ error: t("err.delete") }); } }
  else if (act === "pin") { state.gen.pin = draft.id; state.results = generate(state.gen); state.outTab = "ideas"; closeSheet(); go("outfits"); }
  else if (act === "ai-tag") {
    drawSheet({ busy: true });
    try {
      const r = await classifyPhoto(draftBlob);
      for (const k of ["category", "color", "season", "style", "occasion"]) if (r[k]) draft[k] = r[k];
      if (r.name && !draft.name) draft.name = r.name;
      drawSheet({ aiNote: t("item.aiDone") });
    } catch (err) { drawSheet({ aiNote: aiErrorText(err) || t("item.aiFailed") }); }
  }
  else if (act === "save") {
    drawSheet({ saving: true });
    const item = { ...draft }; const isNew = !state.items.some((i) => i.id === item.id);
    try { await put("items", item); closeSheet(); if (state.tab !== "wardrobe") go("wardrobe"); toast(isNew ? t("toast.added") : t("toast.saved")); }
    catch (err) { drawSheet({ error: err && err.code === "quota_exceeded" ? t("err.quota") : t("err.save") }); }
  }
});
async function productSheetClick(b) {
  const act = b.dataset.act;
  if (act === "imp-run") {
    const raw = document.getElementById("imp-json").value;
    let arr; try { arr = JSON.parse(raw); } catch (e) { return drawProductSheet(null, { mode: "import", json: raw, error: t("shop.errJson") }); }
    if (!Array.isArray(arr)) arr = [arr];
    let ok = 0, bad = 0;
    for (const r of arr.slice(0, 200)) { const p = cleanProduct(r || {}); if (validProduct(p)) bad++; else { try { await put("products", p); ok++; } catch (e) { bad++; } } }
    closeSheet(); toast(t("shop.imported", { ok, bad })); return;
  }
  readProduct();
  const p = sheetProduct;
  if (act === "p-photo") { photoTarget = "product"; document.getElementById("file").click(); }
  else if (act === "p-rmphoto") { p.img = ""; drawProductSheet(); }
  else if (act === "p-askdel") drawProductSheet(null, { confirmDelete: true });
  else if (act === "p-keep") drawProductSheet();
  else if (act === "p-del") { try { await del("products", p.id); closeSheet(); toast(t("toast.productRemoved")); } catch (e) { drawProductSheet(null, { error: t("err.delete") }); } }
  else if (act === "p-save") {
    const prev = state.products.find((x) => x.id === p.id) || {};
    const clean = cleanProduct(p, { ...prev, id: p.id, img: p.img, createdAt: prev.createdAt });
    clean.img = p.img || "";
    const err = validProduct(clean); if (err) return drawProductSheet(null, { error: err });
    try { await put("products", clean); closeSheet(); toast(t("toast.productSaved")); } catch (e) { drawProductSheet(null, { error: t("err.save") }); }
  }
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheetRoot.innerHTML) closeSheet(); });

async function classifyPhoto(blob) {
  const prompt = `The photo shows one clothing item. Pick values STRICTLY from the lists.
category: ${CATS.join(", ")}
color (main colour): ${COLORS.map((c) => c.id).join(", ")}
season: ${SEASONS.join(", ")}
style: ${STYLES.map((s) => s.id).join(", ")}
occasion: ${OCCASIONS.join(", ")}
brand: the brand if a label or logo is clearly visible, otherwise ""
name: a short ${L() === "ru" ? "Russian" : "English"} name (2-3 words).
Return only JSON: {"category":"","color":"","season":"","style":"","occasion":"","brand":"","name":""}`;
  const r = await state.sample.json(prompt, { images: [blob], modelTier: "quick" });
  const ok = (v, list) => (typeof v === "string" && list.includes(v) ? v : null);
  if (r && typeof r.brand === "string" && r.brand && !draft.brand) draft.brand = r.brand.slice(0, 40);
  return { category: ok(r.category, CATS), color: ok(r.color, COLORS.map((c) => c.id)), season: ok(r.season, SEASONS), style: ok(r.style, STYLES.map((s) => s.id)), occasion: ok(r.occasion, OCCASIONS), name: typeof r.name === "string" ? r.name.slice(0, 60) : "" };
}

/* =========================================================================
   Stylist conversation
   ========================================================================= */
function parseRequest(text) {
  const s = text.toLowerCase();
  const o = { occasion: "everyday", season: currentSeason(), weather: SEASON_WEATHER[currentSeason()], style: "", pin: null };
  const occRules = [[/universit|college|class|school|lecture|study|универ|учеб|учёб|школ|пар[аыу]/, "study"], [/work|office|interview|meeting|работ|офис|собеседован/, "work"], [/date|romantic|dinner|свидан|ужин/, "date"], [/party|club|birthday|celebrat|вечерин|клуб|день рожд/, "party"], [/sport|gym|workout|training|run|спорт|зал|трениров/, "sport"]];
  for (const [re, oc] of occRules) if (re.test(s)) { o.occasion = oc; break; }
  if (/cold|freez|winter|snow|холод|мороз|зим|снег/.test(s)) { o.weather = "cold"; if (/winter|snow|зим|снег/.test(s)) o.season = "winter"; }
  else if (/cool|rain|wind|chilly|прохлад|дожд|ветер/.test(s)) o.weather = "cool";
  else if (/hot|summer|heat|жар|лет|зной/.test(s)) { o.weather = "hot"; o.season = "summer"; }
  else if (/warm|spring|тепл|весн/.test(s)) o.weather = "warm";
  for (const st of STYLES) if ([st.name.en, st.name.ru, st.id.replace("_", " ")].some((n) => s.includes(n.toLowerCase()))) { o.style = st.id; break; }
  const catRules = [[/dress|плать/, "dresses"], [/trouser|pants|slacks|jean|denim|брюк|джинс|штан/, "bottoms"], [/jacket|coat|blazer|bomber|parka|куртк|пальто|пиджак|бомбер/, "jackets"], [/sneaker|trainer|boot|shoe|loafer|кроссов|кед|ботин|туфл|обув|лофер/, "shoes"], [/bag|backpack|сумк|рюкзак/, "bags"], [/t-shirt|tee|shirt|sweater|jumper|turtleneck|hoodie|top|blouse|футболк|рубашк|свитер|джемпер|водолазк|худи|топ|блуз/, "tops"], [/scarf|cap|hat|belt|шарф|кепк|шапк|ремень/, "accessories"]];
  let cat = null; for (const [re, c] of catRules) if (re.test(s)) { cat = c; break; }
  const sn = s.replace(/ё/g, "е");
  const ruStem = (id) => { const r = WA.I18N.ru["color." + id].toLowerCase().replace(/ё/g, "е"); return r.length > 5 ? r.slice(0, -2) : r; };
  const color = COLORS.find((c) => s.includes(c.id) || s.includes(t("color." + c.id).toLowerCase()) || sn.includes(ruStem(c.id)));
  if (cat || color) {
    const cand = items().find((i) => (!cat || (cat === "dresses" ? i.category === "dresses" : catKey(i.category) === cat)) && (!color || i.color === color.id));
    if (cand) o.pin = cand.id;
  }
  const stores = RETAILERS.filter((r) => s.includes(r.id) || s.includes(r.name.toLowerCase()) || (r.id === "kaspi" && s.includes("каспи")) || (r.id === "zara" && s.includes("зара")) || (r.id === "bershka" && s.includes("бершк")));
  const storeIntent = stores.length > 0 || /similar|buy|shop|store|похож|купить|докуп|магазин/.test(s);
  const count = /three|3|три/.test(s) ? 3 : /\bone\b|1|один|одн/.test(s) ? 1 : 2;
  return { o, count, cat, color: color?.id || null, stores: stores.length ? stores.map((r) => r.id) : RETAILERS.map((r) => r.id), storeIntent };
}
function wardrobeForAI() { return items().map((i) => ({ id: i.id, name: itemName(i), category: catKey(i.category), color: i.color, brand: i.brand || undefined, size: i.size || undefined, style: styleId(i.style) || undefined, season: i.season, occasion: i.occasion, description: i.description || undefined })); }
function productsForAI() { return state.products.slice(0, 60).map((p) => ({ id: p.id, name: productName(p), store: RET[p.retailer]?.name, category: catKey(p.category), color: p.color || undefined, style: p.style || undefined, price_kzt_as_entered: p.priceKzt || undefined, sizes_as_entered: p.sizes || undefined })); }

async function askStylist(text) {
  state.chat.push({ role: "user", text });
  const pending = { role: "ai", loading: true };
  state.chat.push(pending); render(); scrollChat();
  const { o, count, cat, color, stores, storeIntent } = parseRequest(text);
  const ruled = hasItems() ? generate(o, 3) : { error: t("gen.noItems") };
  if (state.sample) {
    try {
      const history = state.chat.filter((m) => !m.loading).slice(-8).map((m) => `${m.role === "user" ? "User" : "Stylist"}: ${m.text || (m.textKey ? t(m.textKey, m.vars || {}) : "")}`).join("\n");
      const prompt = `You are the personal AI stylist of the Wardrobe AI app (users in Almaty, Kazakhstan). Reply in ${L() === "ru" ? "Russian" : "English"}, warmly and briefly (2-4 sentences).
Rules:
- OWNED items are the user's wardrobe; STORE products were added manually to the catalog by the user (price and sizes "as entered", not live). Clearly distinguish them: never present a store product as owned.
- Never invent items or products. Refer to them only by id. You do not have live store inventory or prices; never claim stock availability.
- An outfit = top + bottom + shoes (or a dress + shoes), outerwear when it is cold, optional accessory/bag. You may add store products to an outfit only if they fit.
- If the user asks to find something in stores (ZARA, Bershka, Kaspi), return short search queries in store_searches (retailer: zara | bershka | kaspi) in the reply language.
- Respect the user's preferred styles when they fit the request.
Preferred styles: ${JSON.stringify(state.profile.styles)}
Today: ${new Date().toLocaleDateString("en-US")}, season: ${currentSeason()}.
OWNED wardrobe: ${JSON.stringify(wardrobeForAI())}
STORE catalog (manual): ${JSON.stringify(productsForAI())}
Algorithm hint (may build on it): ${JSON.stringify((ruled.looks || []).map((l) => ({ item_ids: l.itemIds, score: l.score })))}
Conversation:
${history}
Return only JSON: {"reply":"","outfits":[{"title":"","item_ids":[],"product_ids":[],"why":""}],"store_searches":[{"retailer":"","query":""}]}`;
      const r = await state.sample.json(prompt, { cache: false });
      const looks = (Array.isArray(r.outfits) ? r.outfits : []).slice(0, 4).map((x) => {
        const ids = (Array.isArray(x.item_ids) ? x.item_ids : []).filter((id) => itemById(id));
        const pids = (Array.isArray(x.product_ids) ? x.product_ids : []).filter((id) => productById(id));
        const its = ids.map(itemById);
        return { title: String(x.title || t("look.untitled")).slice(0, 60), itemIds: ids, productIds: pids, score: its.length >= 2 ? scoreOutfit(its, o).score : null, aiWhy: x.why ? String(x.why).slice(0, 300) : "", occasion: o.occasion, season: o.season, weather: o.weather, style: o.style };
      }).filter((l) => l.itemIds.length + l.productIds.length >= 2);
      const searches = (Array.isArray(r.store_searches) ? r.store_searches : []).filter((x) => x && RET[x.retailer] && x.query).slice(0, 4).map((x) => ({ retailer: x.retailer, query: String(x.query).slice(0, 60) }));
      Object.assign(pending, { text: String(r.reply || "…"), looks, searches, loading: false });
      render(); scrollChat(); return;
    } catch (e) {
      if (e && e.code === "cancelled") { state.chat.pop(); render(); return; }
      pending.note = aiErrorText(e);
    }
  }
  // Rule-based answer (no AI available)
  pending.loading = false;
  const pinIt = o.pin ? itemById(o.pin) : null;
  if (storeIntent) {
    const q = pinIt ? `${colorName(pinIt.color)} ${nounOf(pinIt.category)}`.trim() : [color ? colorName(color) : "", cat ? t("noun." + (cat === "dresses" ? "dress" : cat)) : "", o.style ? STYLE[o.style].name[L()] : ""].filter(Boolean).join(" ") || buyQuery(buySuggestion(o));
    const matchQ = pinIt ? pinIt : null;
    const pmatch = state.products.filter((p) => (!cat || catKey(p.category) === (cat === "dresses" ? "tops" : cat)) && (!color || p.color === color) && stores.includes(p.retailer)).slice(0, 2);
    pending.textKey = matchQ ? "rules.storesFor" : "rules.stores";
    pending.vars = { item: matchQ ? itemName(matchQ) : q };
    pending.searches = stores.map((id) => ({ retailer: id, query: q }));
    if (pmatch.length && !ruled.error) pending.looks = [{ ...ruled.looks[0], productIds: pmatch.map((p) => p.id), titleKey: "look.withStore" }];
  } else if (ruled.error) { pending.textKey = "rules.missing"; pending.vars = { msg: ruled.error }; }
  else {
    pending.looks = ruled.looks.slice(0, count);
    pending.textKey = pinIt ? "rules.around" : "rules.for";
    pending.vars = { item: pinIt ? itemName(pinIt).toLowerCase() : "", occ: t("occ." + o.occasion), weather: t("weather." + o.weather).toLowerCase(), style: o.style ? STYLE[o.style].name[L()] : "" };
    if (o.style) pending.textKey += "Style";
  }
  render(); scrollChat();
}
function scrollChat() { requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })); }

/* =========================================================================
   Events
   ========================================================================= */
function toggleStyle(id) {
  const s = state.profile.styles;
  state.profile.styles = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
  saveProfile(); render();
}
async function toggleFav(l) { try { await put("looks", { ...l, favorite: !l.favorite }); } catch (e) { toast(t("toast.saveFailed")); } }

main.addEventListener("click", async (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const d = b.dataset;
  if (d.open) return openItem(d.open);
  if (d.del) return openItem(d.del, { confirmDelete: true });
  if (d.look) { const l = LOOKS.get(d.look); if (l) drawLookSheet(l); return; }
  if (d.go) return go(d.go);
  if (d.act === "add") return openItem(null, { pickPhoto: true });
  if (d.act === "add-manual") return openItem(null);
  if (d.filter) { state.filter = state.filter === d.filter && d.filter !== "all" ? "all" : d.filter; render(); if (b.classList.contains("link")) window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (d.otab) { state.outTab = d.otab; return render(); }
  if (d.weather) { state.gen.weather = d.weather; main.querySelectorAll("[data-weather]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.weather === state.gen.weather)); return; }
  if (b.hasAttribute("data-unpin")) { state.gen.pin = null; state.results = null; return render(); }
  if (d.pick) { const B = state.build; B.picks[d.pick] = B.picks[d.pick] === d.id ? undefined : d.id; if (!B.picks[d.pick]) delete B.picks[d.pick]; return render(); }
  if (d.unpick) { delete state.build.picks[d.unpick]; return render(); }
  if (d.pprod) { const P = state.build.productIds; state.build.productIds = P.includes(d.pprod) ? P.filter((x) => x !== d.pprod) : [...P, d.pprod].slice(-3); return render(); }
  if (d.act === "b-clear") { state.build = { ...state.build, picks: {}, productIds: [], name: "" }; return render(); }
  if (d.act === "b-auto") {
    const r = generate({ occasion: state.build.occasion, style: state.build.style, season: currentSeason(), weather: SEASON_WEATHER[currentSeason()] }, 1);
    if (r.error) return toast(r.error);
    const picks = {};
    for (const id of r.looks[0].itemIds) { const it = itemById(id); const sl = SLOTS.find((s) => s.cat(it) && !picks[s.id]); if (sl) picks[sl.id] = id; }
    state.build.picks = picks; return render();
  }
  if (d.act === "b-save") {
    const B = state.build, list = buildList();
    const o = { occasion: B.occasion, style: B.style, season: currentSeason(), weather: SEASON_WEATHER[currentSeason()] };
    const look = { id: newId(), createdAt: Date.now(), itemIds: list.map((i) => i.id), productIds: B.productIds.slice(), score: list.length >= 2 ? scoreOutfit(list, o).score : null, occasion: B.occasion, season: o.season, weather: o.weather, style: B.style, favorite: false };
    if (B.name.trim()) look.title = B.name.trim().slice(0, 60); else look.titleKey = "look.mine";
    b.disabled = true;
    try { await put("looks", look); toast(t("toast.lookSaved")); state.build = { ...B, picks: {}, productIds: [], name: "" }; render(); } catch (err) { b.disabled = false; toast(t("toast.saveFailed")); }
    return;
  }
  if (d.tip) return send(d.tip);
  if (d.ask) { const it = itemById(d.ask); if (it) { input.value = t("prompt.withItem", { item: itemName(it).toLowerCase() }); input.focus(); input.dispatchEvent(new Event("input")); } return; }
  if (d.act === "buy") { state.buy = buySuggestion({ ...state.gen, pin: null }); return render(); }
  if (d.act === "selfie") return document.getElementById("selfie").click();
  if (d.save) {
    const l = LOOKS.get(d.save); if (!l) return;
    b.disabled = true;
    try { await put("looks", { ...lookBody(l), id: newId(), createdAt: Date.now() }); toast(t("toast.lookSaved")); b.textContent = t("btn.saved"); }
    catch (err) { b.disabled = false; toast(t("toast.saveFailed")); }
    return;
  }
  if (d.unsave) { try { await del("looks", d.unsave); toast(t("toast.lookRemoved")); } catch (err) { toast(t("toast.removeFailed")); } return; }
  if (d.lfav) { const l = state.looks.find((x) => x.id === d.lfav); if (l) await toggleFav(l); return; }
  if (d.sel) return toggleStyle(d.sel);
  if (d.style) return drawStyleSheet(d.style);
  if (d.sgroup) { state.sgroup = d.sgroup; return render(); }
  if (d.lang) return setLang(d.lang);
  if (d.act === "p-add") { photoTarget = "product"; return drawProductSheet({ id: newId(), retailer: state.shopF.store || "zara", category: state.shopF.cat || "tops", name: "", brand: "", url: "" }); }
  if (d.act === "p-import") return drawProductSheet({ mode: "import" }, { mode: "import" });
  if (d.pedit) { const p = state.products.find((x) => x.id === d.pedit); if (p) drawProductSheet({ ...p }); return; }
  if (d.pfav) { const p = state.products.find((x) => x.id === d.pfav); if (p) { try { await put("products", { ...p, favorite: !p.favorite }); } catch (err) { toast(t("toast.saveFailed")); } } return; }
  if (d.act === "sf-fav") { state.shopF.fav = !state.shopF.fav; b.setAttribute("aria-pressed", state.shopF.fav); document.getElementById("sh-grid").innerHTML = shopGrid(); return; }
  if (d.act === "sf-reset") { state.shopF = { q: state.shopF.q, store: "", cat: "", min: "", max: "", size: "", color: "", style: "", fav: false }; return render(); }
});
// Text inputs update only their own results so the keyboard keeps focus.
main.addEventListener("input", (e) => {
  const el = e.target;
  if (el.id === "s-q") { state.sq = el.value; const list = filteredStyles(); document.getElementById("s-grid").innerHTML = list.length ? `<div class="style-grid">${list.map(styleCard).join("")}</div>` : emptyState({ icon: "search", title: t("styles.noneTitle"), text: t("styles.none") }); return; }
  if (el.id === "w-q") { state.wq = el.value; const tmp = document.createElement("div"); tmp.innerHTML = renderWardrobe(); const nb = tmp.querySelector("#w-body"); if (nb) document.getElementById("w-body").innerHTML = nb.innerHTML; return; }
  if (el.id === "sh-q") {
    state.shopF.q = el.value;
    const q = el.value.trim() || t("shop.defaultQuery");
    document.querySelectorAll("[data-rsearch]").forEach((a) => { a.href = RET[a.dataset.rsearch].search(q, L()); });
    document.getElementById("sh-grid").innerHTML = shopGrid(); return;
  }
  if (el.dataset.sf && (el.tagName === "INPUT")) { state.shopF[el.dataset.sf] = el.value; document.getElementById("sh-grid").innerHTML = shopGrid(); return; }
  if (el.id === "b-name") { state.build.name = el.value; return; }
});
main.addEventListener("change", (e) => {
  const el = e.target;
  if (el.id === "g-occ") { state.gen.occasion = el.value; state.buy = null; }
  if (el.id === "g-sea") { state.gen.season = el.value; state.buy = null; }
  if (el.id === "g-sty") { state.gen.style = el.value; state.buy = null; }
  if (el.id === "w-sort") { state.sort = el.value; render(); }
  if (el.id === "b-occ") { state.build.occasion = el.value; render(); }
  if (el.id === "b-sty") { state.build.style = el.value; render(); }
  if (el.dataset.sf && el.tagName === "SELECT") { state.shopF[el.dataset.sf] = el.value; document.getElementById("sh-grid").innerHTML = shopGrid(); }
  if (el.id === "p-name") { state.profile.name = el.value.trim().slice(0, 40); saveProfile(); render(); toast(t("toast.saved")); }
  if (el.dataset.psize) { state.profile.sizes[el.dataset.psize] = el.value.trim().slice(0, 10); saveProfile(); toast(t("toast.saved")); }
});
main.addEventListener("submit", (e) => {
  if (e.target.id !== "gen-form") return;
  e.preventDefault();
  state.buy = null; state.results = generate(state.gen); render();
  requestAnimationFrame(() => document.getElementById("gen-out")?.scrollIntoView({ behavior: "smooth", block: "start" }));
});
document.getElementById("selfie").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0]; e.target.value = "";
  if (!f || !state.sample) return;
  const M = state.me; Object.assign(M, { busy: true, error: "", profile: null, result: null });
  let blob;
  try { const c = await compress(f); M.photo = c.dataUrl; blob = c.blob; } catch (err) { M.busy = false; M.error = err.message; return render(); }
  render();
  try {
    const prof = await analyzeSelfie(blob);
    if (prof.noPerson) M.error = t("me.noPerson");
    else { M.profile = prof; M.result = generate(meOpts(prof), 2); }
  } catch (err) { M.error = aiErrorText(err) || t("me.failed"); }
  M.busy = false; render();
});
document.querySelectorAll("[data-setlang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setlang)));

const input = document.getElementById("chat-input");
let busy = false;
async function send(text) {
  text = (text || "").trim(); if (!text || busy) return;
  busy = true; input.value = ""; input.style.height = "";
  try { await askStylist(text); } finally { busy = false; }
}
document.getElementById("chat-send").addEventListener("click", () => send(input.value));
input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } });
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 140) + "px"; });

let toastTimer;
function toast(text) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); el.textContent = text;
  document.body.appendChild(el); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 2400);
}

applyStaticText();
route();
initStorage();
initAI();
})();

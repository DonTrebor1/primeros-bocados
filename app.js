"use strict";
/* Primeros Bocados · cliente */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const FOOD = Object.fromEntries(FOODS.map(f => [f.id, f]));
const RECIPE = Object.fromEntries(RECIPES.map(r => [r.id, r]));

/* ---------- iconos de alimentos ---------- */
const EMO = {
  platano:"🍌",aguacate:"🥑",manzana:"🍎",pera:"🍐",melocoton:"🍑",mango:"🥭",fresa:"🍓",arandanos:"🫐",frambuesa:"🫐",uva:"🍇",sandia:"🍉",melon:"🍈",mandarina:"🍊",kiwi:"🥝",cereza:"🍒",pina:"🍍",
  tomate:"🍅",pepino:"🥒",pimiento:"🫑",berenjena:"🍆",cebolla:"🧅",ajo:"🧄",zanahoria:"🥕",patata:"🥔",boniato:"🍠",brocoli:"🥦",maiz:"🌽",champinon:"🍄",lechuga:"🥬",col:"🥬",espinacas:"🥬",acelga:"🥬",
  huevo:"🥚",pollo:"🍗",pavo:"🍗",ternera:"🥩",cerdo:"🥩",cordero:"🥩",merluza:"🐟",salmon:"🐟",sardina:"🐟",lubina:"🐟",bacalao:"🐟",atun:"🐟",boqueron:"🐟",gamba:"🦐",mejillon:"🦪",calamar:"🦑",
  yogur:"🥛",kefir:"🥛",leche_vaca:"🥛",queso_fresco:"🧀",mozzarella:"🧀",queso_curado:"🧀",requeson:"🧀",mantequilla:"🧈",cacahuete:"🥜",almendra:"🌰",avellana:"🌰",nuez:"🌰",anacardo:"🌰",pistacho:"🌰",
  pan:"🍞",pasta:"🍝",arroz:"🍚",avena:"🥣",cuscus:"🥣",quinoa:"🥣",polenta:"🌽",mijo:"🥣",lentejas:"🫘",garbanzos:"🫘",alubias:"🫘",hummus:"🫘",edamame:"🫛",
  aceite:"🫒",aceitunas:"🫒",miel:"🍯",sal:"🧂",azucar:"🍬",zumo:"🧃",palomitas:"🍿",embutido:"🥓",hierbas:"🌿",calabaza:"🎃",calabacin:"🥒",
  coliflor:"🥦",judia:"🫛",guisantes:"🫛",esparrago:"🌱",alcachofa:"🌿",puerro:"🧅",sesamo:"🌾",chia:"🌾",girasol:"🌻",higado:"🥩",conejo:"🍗",algas:"🌿"
  ,albaricoque:"🍑",nectarina:"🍑",moras:"🫐",grosellas:"🍒",pomelo:"🍊",limon:"🍋",coco:"🥥",pasas:"🍇",orejones:"🍑",platano_macho:"🍌",membrillo:"🍐",chirivia:"🥕",apio:"🥬",hinojo:"🌿",kale:"🥬",canonigos:"🥬",rucula:"🥬",borraja:"🥬",endibia:"🥬",
  calcots:"🧅",setas:"🍄",okra:"🫛",pak_choi:"🥬",tomate_cherry:"🍅",ajo_tierno:"🧄",cebolleta:"🧅",coles_bruselas:"🥬",yuca:"🥔",arroz_integral:"🍚",trigo_sarraceno:"🌾",centeno:"🌾",cebada:"🌾",espelta:"🌾",bulgur:"🥣",amaranto:"🌾",tortitas_arroz:"🍘",
  pochas:"🫘",habas:"🫛",azukis:"🫘",guisante_seco:"🫛",soja_texturizada:"🫘",altramuz:"🫘",tempeh:"🫘",pato:"🍗",codorniz:"🍗",huevo_codorniz:"🥚",carne_caza:"🥩",morcilla:"🌭",huevo_crudo:"🥚",rape:"🐟",gallo:"🐟",lenguado:"🐟",caballa:"🐟",trucha:"🐟",jurel:"🐟",rodaballo:"🐟",bonito:"🐟",
  pulpo:"🐙",sepia:"🦑",almeja:"🦪",langostino:"🦐",cangrejo:"🦀",surimi:"🦀",anchoa_salazon:"🐟",salmon_ahumado:"🐟",pez_espada:"🐟",pescado_crudo:"🍣",manchego_tierno:"🧀",queso_cabra:"🧀",ricotta:"🧀",cuajada:"🥛",mato:"🧀",yogur_griego:"🥛",nata:"🥛",queso_azul:"🧀",leche_cabra:"🥛",petit_suisse:"🥛",
  lino:"🌾",canamo:"🌾",pipas_calabaza:"🎃",agua:"💧",caldo_casero:"🍲",cacao:"🍫",aceite_girasol:"🌻",aceite_coco:"🥥",bebida_avena:"🥛",bebida_soja:"🥛",bebida_arroz:"🥛",cafe_te:"☕",frutos_secos_enteros:"🌰",caramelos:"🍬",gominolas:"🍬",refrescos:"🥤",ultraprocesados:"🍪",patatas_bolsa:"🥔",leche_cruda:"🥛",brotes_crudos:"🌱"
};
const CAT_BG = { fruta:"--tomato-soft", verdura:"--kiwi-soft", cereal:"--banana-soft", legumbre:"--peach-soft", carne:"--peach-soft", pescado:"--blueberry-soft", lacteo:"--blueberry-soft", semilla:"--banana-soft", otros:"--sunk", evitar:"--sunk" };
const CAT_SOLID = { fruta:"var(--tomato)", verdura:"var(--kiwi)", cereal:"var(--banana)", legumbre:"var(--peach)", carne:"var(--melon)", pescado:"var(--blueberry)", lacteo:"var(--grape)", semilla:"#C98A4B", otros:"var(--muted)" };
const AL_EMO = { huevo:"🥚",cacahuete:"🥜",leche:"🥛",trigo:"🍞",pescado:"🐟",sesamo:"🌾",almendra:"🌰",anacardo:"🌰",avellana:"🌰",nuez:"🌰",pistacho:"🌰",soja:"🫘",crustaceo:"🦐",molusco:"🦪" };
/* imagen por categoría para los alimentos sin dibujo propio y los añadidos por la familia */
const CAT_EMO = { fruta:"🍎", verdura:"🥕", cereal:"🌾", legumbre:"🫘", carne:"🍗", pescado:"🐟", lacteo:"🧀", semilla:"🌰", otros:"🍽️", evitar:"🚫" };
const foodEmo = f => EMO[f.id] || (f.custom ? "🍽️" : CAT_EMO[f.c] || "🍽️");
function emo(f, cls) {
  return `<span class="${cls}" style="--tile-bg:var(${CAT_BG[f.c] || "--sunk"})" aria-hidden="true">${foodEmo(f)}</span>`;
}

/* ---------- estado ---------- */
const S = {
  data: null, babyId: null, view: "home", foodFilter: "todos", foodCat: "", foodQ: "",
  calMonth: null, selDay: null, moreTab: "ideas", recStage: 0, online: true, authMode: "login"
};
const LS = k => "pb:" + k;
const lsGet = k => { try { return JSON.parse(localStorage.getItem(LS(k)) || "null"); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(LS(k), JSON.stringify(v)); } catch (e) {} };

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayISO = () => iso(new Date());
const parseISO = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtDate = s => parseISO(s).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
const fmtLong = s => parseISO(s).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const baby = () => S.data?.babies.find(b => b.id === S.babyId) || S.data?.babies[0] || null;
const entries = () => (S.data?.entries || []).filter(e => e.baby === baby()?.id);
function ageMonths(b = baby()) {
  if (!b?.birth) return null;
  const bd = parseISO(b.birth), n = new Date();
  let m = (n.getFullYear() - bd.getFullYear()) * 12 + (n.getMonth() - bd.getMonth());
  if (n.getDate() < bd.getDate()) m--;
  return Math.max(0, m);
}
function ageText(b = baby()) {
  if (!b?.birth) return "sin fecha";
  const m = ageMonths(b), bd = parseISO(b.birth), n = new Date();
  if (m >= 24) return `${Math.floor(m / 12)} años`;
  const anchor = new Date(bd.getFullYear(), bd.getMonth() + m, bd.getDate());
  const w = Math.floor((n - anchor) / (7 * 864e5));
  const ms = m === 1 ? "1 mes" : `${m} meses`;
  return w > 0 ? `${ms} y ${w} sem.` : ms;
}
const stageIdx = () => { const m = ageMonths() ?? 6; return m < 9 ? 0 : m < 12 ? 1 : 2; };
const STAGES = ["6 a 9 meses", "9 a 12 meses", "12 meses +"];
const LIKE = { 1: "No le gustó", 2: "Normal", 3: "Le encantó" };
const LIKE_E = { 1: "😖", 2: "😐", 3: "😋" };
const RX = { none: "Sin reacción", mild: "Reacción leve", severe: "Reacción fuerte" };

function foodInfo(id) {
  if (FOOD[id]) return FOOD[id];
  const c = S.data?.custom.find(x => x.id === id);
  return { id, n: c?.n || "Alimento", c: "otros", a: c?.a || "", ch: 0, fe: 0, m: 6, p: ["", "", ""], t: "", custom: true };
}
function triedMap() {
  const m = {};
  for (const e of entries()) (m[e.food] ||= []).push(e);
  for (const k in m) m[k].sort((a, b) => (a.date < b.date ? 1 : -1));
  return m;
}
const countable = id => FOOD[id]?.c !== "evitar" && FOOD[id]?.c !== "otros";
const triedCount = tm => Object.keys(tm).filter(id => FOOD[id] ? countable(id) : true).length;
function allergenStatus(k, tm) {
  const list = [];
  for (const id in tm) if (foodInfo(id).a === k) list.push(...tm[id]);
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  const rx = list.filter(e => e.reaction && e.reaction !== "none");
  const days = new Set(list.filter(e => e.reaction === "none").map(e => e.date)).size;
  let st = "pend";
  if (rx.length) st = "rx"; else if (days >= 3) st = "ok"; else if (days > 0) st = "curso";
  const last = list[0]?.date;
  const stale = st === "ok" && last && (Date.now() - parseISO(last)) / 864e5 > 10;
  return { st, n: Math.min(days, 3), last, stale, rx: rx[0], first: list[list.length - 1]?.date };
}
/* aviso si se introduce un alérgeno nuevo menos de 3 días después de otro alérgeno nuevo */
function spacingWarn(k, date, isEdit) {
  const tm = triedMap();
  if (isEdit || allergenStatus(k, tm).st !== "pend") return "";
  const d0 = parseISO(date);
  const recent = ALLERGEN_ORDER.filter(o => o !== k).map(o => ({ o, first: allergenStatus(o, tm).first }))
    .filter(x => x.first && Math.abs((d0 - parseISO(x.first)) / 864e5) < 3);
  if (!recent.length) return "";
  const names = recent.map(x => ALLERGENS[x.o].n).join(", ");
  return `<div class="note c1"><b>Mejor esperar un poco.</b> Hace menos de 3 días que empezasteis con ${esc(names)}. Si introducís dos alérgenos nuevos tan seguidos, ante una reacción no sabréis cuál ha sido.</div>`;
}
function nextAllergen(tm) {
  const all = ALLERGEN_ORDER.map(k => ({ k, ...allergenStatus(k, tm) }));
  return all.find(a => a.st === "curso") || all.find(a => a.st === "pend") || all.find(a => a.stale) || null;
}

/* ---------- API ---------- */
async function api(method, url, body, isForm) {
  try { return await Local.handle(method, url, body); }
  catch (e) { if (e?.error) throw e; console.error(e); throw { error: "No se pudo guardar en el móvil. Comprueba que queda espacio." }; }
}
function setOnline(v) { S.online = v; const d = $("#syncdot"); if (d) { d.classList.toggle("off", !v); d.title = v ? "Sincronizado" : "Sin conexión"; } }

let rev = null;
const PHOTO = {};
async function loadState() {
  const d = await api("GET", "/api/state");
  for (const e of d.entries) if (e.photo && !PHOTO[e.photo]) PHOTO[e.photo] = await Local.photoURL(e.photo);
  S.data = d; rev = d.rev;
  lsSet("state", d);
  if (!S.data.babies.find(b => b.id === S.babyId)) S.babyId = S.data.babies[0]?.id || null;
  render();
}
async function poll() {
  if (!S.data || document.hidden) return;
  try { const r = await api("GET", "/api/rev"); if (r.rev !== rev) await loadState(); } catch (e) {}
}

async function mutate(fn, after) {
  try { await fn(); await loadState(); if (after) toast(after); }
  catch (e) { toast(e?.error || "No se pudo guardar."); try { await loadState(); } catch (x) {} }
}

/* ---------- arranque ---------- */
async function boot() {
  S.babyId = lsGet("baby");
  try { await loadState(); }
  catch (e) { $("#root").innerHTML = `<main class="auth"><div class="hello"><h1>Primeros Bocados</h1><p class="err">Este navegador no permite guardar datos. Abre la app en Chrome sin modo incógnito.</p></div></main>`; return; }
  // pide al navegador que no borre los datos aunque falte espacio
  try { if (navigator.storage?.persist) { const p = await navigator.storage.persisted(); if (!p) await navigator.storage.persist(); } } catch (e) {}
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
}

function renderAuth() { boot(); }

/* ---------- estructura ---------- */
const TABS = [["home", "Inicio", "🏡", "var(--kiwi)"], ["foods", "Alimentos", "🍓", "var(--tomato)"], ["log", "Diario", "📒", "var(--blueberry)"], ["allergens", "Alérgenos", "🛡️", "var(--grape)"], ["more", "Más", "🧺", "var(--banana)"]];
function shell() {
  if ($("#app")) return;
  $("#root").innerHTML = `<header class="top"><div class="in">
      <div class="logo"><img class="mark" src="icons/icon.svg" alt="">Bocados</div>
      <button class="baby-pill" id="babypill" aria-label="Cambiar de bebé"></button>
      <span class="syncdot" id="syncdot" title="Sincronizado"></span>
    </div></header>
    <main class="wrap" id="app"></main>
    <nav class="tabs" aria-label="Secciones">${TABS.map(([k, n, i, c]) => `<button data-v="${k}" style="--tab-c:${c}"><span class="ic" aria-hidden="true">${i}</span>${n}</button>`).join("")}</nav>`;
  $("#babypill").onclick = openBabies;
}

function render() {
  if (!S.data) return;
  shell();
  setOnline(S.online);
  const b = baby();
  if (b) lsSet("baby", b.id);
  $("#babypill").innerHTML = b ? `<span class="av">${esc(b.name.charAt(0).toUpperCase())}</span><span class="txt"><b>${esc(b.name)}</b><small>${esc(ageText(b))}</small></span>` : `<span class="av">+</span><span class="txt"><b>Añadir bebé</b></span>`;
  $$(".tabs button").forEach(x => x.setAttribute("aria-current", x.dataset.v === S.view ? "page" : "false"));
  const v = $("#app");
  const keepScroll = v.dataset.v === S.view ? scrollY : 0;
  v.dataset.v = S.view;
  if (!b) v.innerHTML = vNoBaby();
  else v.innerHTML = ({ home: vHome, foods: vFoods, log: vLog, allergens: vAllergens, more: vMore })[S.view](triedMap());
  afterRender();
  if (keepScroll) scrollTo(0, keepScroll);
  currentSheet?.refresh?.();
  if (b && !S.data.tourDone && tourStep < 0 && !tourAsked) { tourAsked = true; setTimeout(startTour, 400); }
}

function vNoBaby() {
  return `<div class="stack"><div class="stick c-banana stack" style="margin-top:0">
    <p class="fruits-row">🥕 🍐 🥚</p>
    <h2 class="h2">¡Hola!</h2>
    <p><b>Paso 1:</b> añade a tu bebé. Con su fecha de nacimiento la app ajusta los cortes y lo que conviene esperar. Después te enseño la app en un tutorial corto.</p>
    <label class="field">Nombre<input class="inp" id="nb-name" autocomplete="off"></label>
    <label class="field">Fecha de nacimiento<input class="inp" id="nb-birth" type="date" max="${todayISO()}"></label>
    <button class="btn go block" data-act="add-baby">Añadir bebé</button></div></div>`;
}

/* ---------- inicio ---------- */
const GROUPS = [
  { k: "fruta", n: "Fruta", c: "var(--tomato)", goal: 5, test: f => f.c === "fruta" },
  { k: "verdura", n: "Verdura", c: "var(--kiwi)", goal: 5, test: f => f.c === "verdura" },
  { k: "prot", n: "Proteína", c: "var(--melon)", goal: 4, test: f => ["carne", "pescado", "legumbre"].includes(f.c) },
  { k: "cereal", n: "Cereal", c: "var(--banana)", goal: 3, test: f => f.c === "cereal" },
  { k: "lacteo", n: "Lácteo", c: "var(--grape)", goal: 2, test: f => f.c === "lacteo" },
  { k: "fe", n: "Con hierro", c: "var(--peach)", goal: 6, test: f => !!f.fe }
];
function vHome(tm) {
  const n = triedCount(tm), goal = 100, pct = Math.min(1, n / goal);
  const age = ageMonths(), st = stageIdx(), b = baby();
  const byCat = {};
  for (const id in tm) { const f = foodInfo(id); if (FOOD[id] && !countable(id)) continue; byCat[f.c] = (byCat[f.c] || 0) + 1; }
  const catOrder = ["fruta", "verdura", "cereal", "legumbre", "carne", "pescado", "lacteo", "semilla", "otros"];
  let out = `<div class="stack">`;
  const lastB = S.data.lastBackup, nEnt = entries().length;
  if (nEnt >= 5 && (!lastB || (Date.now() - parseISO(lastB)) / 864e5 > 14)) out += `<button class="stick c-peach" style="text-align:left" data-act="go-backup">💾 ${lastB ? "Hace más de dos semanas de tu última copia de seguridad." : "Aún no has guardado ninguna copia de seguridad."} <b>Guardar copia ahora</b></button>`;
  if (!b.birth) out += `<button class="stick c-peach" style="text-align:left" data-act="edit-baby">Añade la fecha de nacimiento de ${esc(b.name)} para ajustar las recomendaciones a su edad. <b>Añadir ahora</b></button>`;
  // contador tipo cuenco
  const arc = 2 * Math.PI * 44 * 0.5;
  out += `<section class="stick c-banana"><div class="hero">
    <div class="bowl"><svg viewBox="0 0 112 112" aria-hidden="true">
      <path d="M12 60 A44 44 0 0 0 100 60" fill="none" stroke="var(--card)" stroke-width="14" stroke-linecap="round"/>
      <path d="M12 60 A44 44 0 0 0 100 60" fill="none" stroke="var(--kiwi)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${arc}" stroke-dashoffset="${arc * (1 - pct)}"/>
      <path d="M12 60 A44 44 0 0 0 100 60" fill="none" stroke="var(--line)" stroke-width="2.5" stroke-dasharray="0" opacity=".9"/>
      <text x="56" y="30" text-anchor="middle" font-size="26">${n >= 100 ? "🏆" : n >= 50 ? "🌟" : n >= 10 ? "🥄" : "🍼"}</text>
    </svg><div class="n num">${n}<small>de ${goal}</small></div></div>
    <div><p class="label">Primeros 100 alimentos</p><h2 class="h2" style="margin:2px 0 8px">${n === 0 ? "¡A por el primero!" : n < 10 ? "Buen comienzo" : n < 50 ? "Va cogiendo ritmo" : n < 100 ? "Gran variedad" : "¡Objetivo cumplido!"}</h2>
    <span class="stagechip">🥄 ${STAGES[st]}</span></div></div>
    ${n ? `<div class="catbar" role="img" aria-label="Alimentos probados por grupo">${catOrder.filter(c => byCat[c]).map(c => `<i style="width:${(byCat[c] / n) * 100}%;background:${CAT_SOLID[c]}"></i>`).join("")}</div>
    <div class="legend">${catOrder.filter(c => byCat[c]).map(c => `<span><b style="background:${CAT_SOLID[c]}"></b>${CATS[c].n} ${byCat[c]}</span>`).join("")}</div>` : ""}
  </section>`;

  // variedad semanal
  const week = entries().filter(e => (Date.now() - parseISO(e.date)) / 864e5 < 7);
  const wf = [...new Set(week.map(e => e.food))].map(foodInfo);
  out += `<section class="stick"><div class="row"><div class="grow"><p class="label">Últimos 7 días</p><h2 class="h3">Variedad de la semana</h2></div><span class="tag ok num">${wf.length} distintos</span></div>
    <div class="vbars">${GROUPS.map(g => { const c = wf.filter(g.test).length; const max = Math.max(g.goal * 1.5, c); return `<div class="vbar"><span>${g.n}</span><span class="track"><span class="fill" style="display:block;width:${(c / max) * 100}%;background:${g.c}"></span><span class="goal" style="left:${(g.goal / max) * 100}%"></span></span><span class="v">${c}/${g.goal}</span></div>`; }).join("")}</div>
    <p class="small muted" style="margin-top:10px">La raya marca un objetivo orientativo de alimentos distintos por semana.</p></section>`;

  // sugerencias
  const avail = FOODS.filter(f => countable(f.id) && !tm[f.id] && f.m <= (age ?? 6));
  const seed = parseInt(todayISO().replace(/-/g, ""), 10);
  const iron = avail.filter(f => f.fe), rest = avail.filter(f => !f.fe && !f.a);
  const pick = (arr, k) => (arr.length ? arr[(seed * (k + 7)) % arr.length] : null);
  const a1 = pick(iron, 1), a2 = pick(rest, 2), a3 = pick(rest.filter(f => f.c !== a2?.c && f.id !== a2?.id), 3);
  const sugs = [a1, a2, a3].filter(Boolean);
  out += `<div class="section-h"><h2>Hoy podríais probar</h2></div>`;
  out += sugs.length ? `<div class="sugs">${sugs.map(f => ftile(f, tm)).join("")}</div>` : `<div class="stick empty"><span class="big">🎉</span>Ya ha probado todo lo de su etapa.</div>`;
  const later = (b.lists.later || []).map(foodInfo).filter(f => !tm[f.id]).slice(0, 4);
  if (later.length) out += `<div class="stick"><p class="label">Apuntados para probar</p><div class="list">${later.map(f => foodLi(f, tm)).join("")}</div></div>`;

  // alérgeno
  const na = nextAllergen(tm);
  if (na) {
    const a = ALLERGENS[na.k];
    const msg = na.st === "curso" ? `Lleváis ${na.n} de 3 días. Seguid ofreciéndolo en días distintos.` : na.stale ? "Hace más de 10 días que no lo toma. Toca repetirlo para mantenerlo." : "Es el siguiente alérgeno por introducir.";
    out += `<div class="section-h"><h2>Alérgeno en marcha</h2></div><section class="stick c-grape"><div class="row"><span style="font-size:36px" aria-hidden="true">${AL_EMO[na.k]}</span><div class="grow"><h3 class="h3">${esc(a.n)}</h3><p class="small">${msg}</p></div></div>
      <p style="margin:10px 0 12px">${esc(a.how)}</p><div class="wrap-row"><button class="btn grape sm" data-addfood="${a.food}">Registrar hoy</button><button class="btn sm" data-go="allergens">Ver plan</button></div></section>`;
  }

  // recientes
  const recent = [...entries()].sort((x, y) => (y.date + y.ts > x.date + x.ts ? 1 : -1)).slice(0, 5);
  out += `<div class="section-h"><h2>Últimos registros</h2><button class="btn sm go" data-act="new-entry">+ Añadir</button></div>`;
  out += recent.length ? `<div class="stick" style="padding-block:4px"><div class="list">${recent.map(entryLi).join("")}</div></div>` : `<div class="stick empty"><span class="big">📒</span>Cuando registréis una comida aparecerá aquí, en el móvil de los dos.</div>`;
  out += `<p class="foot">Información general basada en pautas de la AEP y AESAN. No sustituye el consejo de vuestra pediatra.</p></div>`;
  return out;
}
function marks(f) {
  const m = [];
  if (f.a) m.push(`<i class="m-al" title="Alérgeno"></i>`);
  if (f.fe) m.push(`<i class="m-fe" title="Rico en hierro"></i>`);
  if (f.ch === 2) m.push(`<i class="m-c2" title="Riesgo alto de atragantamiento"></i>`);
  else if (f.ch === 1) m.push(`<i class="m-c1" title="Riesgo medio de atragantamiento"></i>`);
  return m.join("");
}
function ftile(f, tm) {
  const age = ageMonths();
  const wait = f.m > 6 && age != null && age < f.m;
  return `<button class="ftile${wait ? " wait" : ""}" data-food="${esc(f.id)}">${emo(f, "emo")}<span class="nm">${esc(f.n)}</span><span class="marks">${marks(f)}</span>${tm[f.id] ? `<span class="tick" aria-label="Probado">✓</span>` : ""}</button>`;
}
function tags(f) {
  const t = [];
  if (f.a) t.push(`<span class="tag al">${esc(ALLERGENS[f.a]?.n || "Alérgeno")}</span>`);
  if (f.fe) t.push(`<span class="tag fe">Hierro</span>`);
  if (f.ch === 2) t.push(`<span class="tag c2">Riesgo alto</span>`); else if (f.ch === 1) t.push(`<span class="tag c1">Riesgo medio</span>`);
  const age = ageMonths();
  if (f.m > 6 && (age == null || age < f.m)) t.push(`<span class="tag wait">Desde ${f.m >= 24 ? Math.round(f.m / 12) + " años" : f.m + " meses"}</span>`);
  return t.join("");
}
function foodLi(f, tm) {
  return `<button class="li" data-food="${esc(f.id)}">${emo(f, "emo")}<span class="grow"><span class="t">${esc(f.n)}${tm[f.id] ? " ✓" : ""}</span><span class="tags">${tags(f)}</span></span></button>`;
}
function memberName(id) { return S.data.family.members.find(m => m.id === id)?.name?.split(" ")[0] || ""; }
function entryLi(e) {
  const f = foodInfo(e.food), who = memberName(e.by);
  return `<button class="li" data-entry="${esc(e.id)}">${e.photo ? `<img class="thumb" src="${PHOTO[e.photo] || ""}" alt="" loading="lazy">` : emo(f, "emo")}
    <span class="grow"><span class="t">${esc(f.n)} ${e.liked ? LIKE_E[e.liked] : ""}</span><span class="s" style="display:block">${fmtDate(e.date)}${who ? " · " + esc(who) : ""}</span>${e.notes ? `<span class="s" style="display:block;font-style:italic">${esc(e.notes)}</span>` : ""}</span>
    ${e.reaction && e.reaction !== "none" ? `<span class="tag rx">${e.reaction === "severe" ? "Reacción fuerte" : "Reacción"}</span>` : ""}</button>`;
}

/* ---------- alimentos ---------- */
const CAT_ORDER = ["fruta", "verdura", "cereal", "legumbre", "carne", "pescado", "lacteo", "semilla", "otros", "evitar"];
function vFoods(tm) {
  const q = norm(S.foodQ.trim());
  const fav = baby().lists.fav || [], later = baby().lists.later || [];
  const all = [...FOODS, ...S.data.custom.map(c => foodInfo(c.id))];
  const list = all.filter(f => {
    if (q && !norm(f.n).includes(q)) return false;
    if (S.foodCat && f.c !== S.foodCat) return false;
    switch (S.foodFilter) {
      case "no": return !tm[f.id] && countable(f.id);
      case "si": return !!tm[f.id];
      case "fav": return fav.includes(f.id);
      case "later": return later.includes(f.id);
      case "al": return !!f.a;
      case "fe": return !!f.fe;
      case "edad": { const a = ageMonths() ?? 6; return f.m <= a && f.c !== "evitar"; }
    }
    return true;
  }).sort((a, b) => (CAT_ORDER.indexOf(a.c) - CAT_ORDER.indexOf(b.c)) || a.n.localeCompare(b.n, "es"));
  const F = [["todos", "Todos"], ["edad", "Para su edad"], ["no", "Sin probar"], ["si", "Probados"], ["fav", "❤️ Favoritos"], ["later", "⏰ Más tarde"], ["al", "Alérgenos"], ["fe", "Hierro"]];
  return `<div class="stack">
    <input class="search" id="food-q" type="search" placeholder="🔍  Buscar entre ${all.length} alimentos" value="${esc(S.foodQ)}" autocomplete="off" aria-label="Buscar alimento">
    <div class="chips" role="group" aria-label="Filtro">${F.map(([k, n]) => `<button class="chip" data-ff="${k}" aria-pressed="${S.foodFilter === k}">${n}</button>`).join("")}</div>
    <div class="chips" role="group" aria-label="Grupo"><button class="chip" data-fc="" aria-pressed="${!S.foodCat}">Todos los grupos</button>${Object.entries(CATS).map(([k, c]) => `<button class="chip" data-fc="${k}" aria-pressed="${S.foodCat === k}">${c.n}</button>`).join("")}</div>
    <div class="row small muted" style="font-weight:700;flex-wrap:wrap;gap:4px 12px"><span class="num">${list.length} resultados</span><span class="row" style="gap:4px"><i class="m-al" style="width:10px;height:10px;border-radius:50%;border:1.5px solid var(--line);display:inline-block"></i>alérgeno</span><span class="row" style="gap:4px"><i class="m-fe" style="width:10px;height:10px;border-radius:50%;border:1.5px solid var(--line);display:inline-block"></i>hierro</span><span class="row" style="gap:4px"><i class="m-c2" style="width:10px;height:10px;border-radius:50%;border:1.5px solid var(--line);display:inline-block"></i>atragantamiento</span></div>
    ${list.length ? `<div class="fgrid">${list.map(f => ftile(f, tm)).join("")}</div>` : `<div class="stick empty"><span class="big">🤷</span>Nada con ese filtro.${q ? `<br><button class="btn sm go" style="margin-top:12px" data-act="new-custom">Añadir «${esc(S.foodQ.trim())}»</button>` : ""}</div>`}
  </div>`;
}

/* ---------- diario ---------- */
function vLog(tm) {
  if (!S.calMonth) { const n = new Date(); S.calMonth = iso(new Date(n.getFullYear(), n.getMonth(), 1)); }
  if (!S.selDay) S.selDay = todayISO();
  const m0 = parseISO(S.calMonth), start = new Date(m0);
  start.setDate(1 - ((m0.getDay() + 6) % 7));
  const byDay = {};
  for (const e of entries()) (byDay[e.date] ||= []).push(e);
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (i >= 35 && d.getMonth() !== m0.getMonth()) break;
    const k = iso(d), es = byDay[k] || [];
    const pips = es.slice(0, 3).map(e => `<i class="pip${e.reaction && e.reaction !== "none" ? " rx" : foodInfo(e.food).a ? " al" : ""}"></i>`).join("");
    cells += `<button class="${d.getMonth() !== m0.getMonth() ? "out " : ""}${k === todayISO() ? "today " : ""}${k === S.selDay ? "sel" : ""}" data-day="${k}" aria-label="${fmtDate(k)}, ${es.length} registros">${d.getDate()}<span class="pips">${pips}</span></button>`;
  }
  const day = (byDay[S.selDay] || []).sort((a, b) => a.ts - b.ts);
  const week = new Set(entries().filter(e => (Date.now() - parseISO(e.date)) / 864e5 < 7).map(e => e.food)).size;
  return `<div class="stack">
    <div class="mini2"><div class="stick minis c-kiwi"><div class="v">${triedCount(tm)}</div><div class="k">alimentos probados</div></div><div class="stick minis c-blueberry"><div class="v">${week}</div><div class="k">distintos esta semana</div></div></div>
    <section class="stick"><div class="cal-h"><button class="iconbtn" data-cal="-1" aria-label="Mes anterior">‹</button><h3>${(m => m.charAt(0).toUpperCase() + m.slice(1))(m0.toLocaleDateString("es-ES", { month: "long" }))} ${m0.getFullYear()}</h3><button class="iconbtn" data-cal="1" aria-label="Mes siguiente">›</button></div>
      <div class="cal">${["L", "M", "X", "J", "V", "S", "D"].map(d => `<span class="dow">${d}</span>`).join("")}${cells}</div></section>
    <div class="section-h"><h2 style="text-transform:capitalize">${fmtDate(S.selDay)}</h2><button class="btn sm go" data-act="new-entry" data-date="${S.selDay}">+ Añadir</button></div>
    <div class="stick" style="padding-block:4px">${day.length ? `<div class="list">${day.map(entryLi).join("")}</div>` : `<div class="empty">Nada registrado este día.</div>`}</div>
    <div class="wrap-row"><button class="btn sm sun" data-act="report">🩺 Informe para la pediatra</button><button class="btn sm" data-act="export">Exportar CSV</button></div>
  </div>`;
}

/* ---------- alérgenos ---------- */
function vAllergens(tm) {
  const rows = ALLERGEN_ORDER.map(k => ({ k, ...allergenStatus(k, tm) }));
  const okN = rows.filter(r => r.st === "ok").length;
  const pill = { pend: `<span class="tag wait">Pendiente</span>`, curso: `<span class="tag al">En curso</span>`, ok: `<span class="tag ok">Tolerado</span>`, rx: `<span class="tag rx">Reacción</span>` };
  return `<div class="stack">
    <section class="stick c-grape"><p class="label">Plan de alérgenos</p><h2 class="h2" style="margin:2px 0 6px"><span class="num">${okN}</span> de ${rows.length} tolerados</h2>
    <p>Un alérgeno nuevo cada vez, por la mañana. Se marca como tolerado tras <b>3 días</b> distintos sin reacción. Después, mantenedlo un par de veces por semana.</p></section>
    <section class="stick" style="padding-block:4px">${rows.map(r => {
      const a = ALLERGENS[r.k];
      const sub = r.st === "rx" ? `Reacción el ${fmtDate(r.rx.date)}. Hablad con la pediatra antes de repetir.` : r.last ? `Última vez: ${fmtDate(r.last)}${r.stale ? " · toca repetir" : ""}` : esc(a.how);
      return `<div class="al-row"><span class="emo" aria-hidden="true">${AL_EMO[r.k]}</span><div><div class="row" style="gap:8px;flex-wrap:wrap"><b>${esc(a.n)}</b>${pill[r.st]}</div><div class="small muted">${sub}</div><div class="dots3 ${r.st === "ok" ? "ok" : r.st === "rx" ? "rx" : ""}">${[0, 1, 2].map(i => `<i class="${i < r.n || (r.st === "rx" && i === 0) ? "on" : ""}"></i>`).join("")}</div></div><button class="iconbtn" data-addfood="${a.food}" aria-label="Registrar ${esc(a.n)}">+</button></div>`;
    }).join("")}</section>
    <div class="note sos"><b>Llamad al 112</b> si aparece hinchazón de labios o lengua, dificultad para respirar, vómitos repetidos, palidez o decaimiento.</div>
  </div>`;
}

/* ---------- más ---------- */
function vMore(tm) {
  const T = [["ideas", "Ideas"], ["compra", "Compra"], ["guias", "Guías"], ["hitos", "Hitos"], ["familia", "Ajustes"]];
  let body = "";
  if (S.moreTab === "ideas") {
    const st = S.recStage, list = RECIPES.filter(r => st === 0 || r.age <= st);
    body = `<div class="chips">${[[0, "Todas"], [6, "Desde 6 meses"], [9, "Desde 9 meses"]].map(([k, n]) => `<button class="chip" data-rs="${k}" aria-pressed="${st === k}">${n}</button>`).join("")}</div>
    <div class="stick" style="padding-block:4px"><div class="list">${list.map(r => {
      const als = [...new Set(r.foods.map(id => FOOD[id]?.a).filter(Boolean))];
      return `<button class="li" data-recipe="${r.id}"><span class="emo" style="--tile-bg:var(--banana-soft)" aria-hidden="true">${foodEmo(FOOD[r.foods[0]])}</span><span class="grow"><span class="t">${esc(r.n)}</span><span class="s" style="display:block">Desde ${r.age} meses · ${r.time}</span><span class="tags">${als.map(a => `<span class="tag al">${esc(ALLERGENS[a].n)}</span>`).join("")}</span></span></button>`;
    }).join("")}</div></div>`;
  } else if (S.moreTab === "compra") {
    const items = S.data.shopping, pend = items.filter(i => !i.done), done = items.filter(i => i.done);
    body = `<form class="row" id="shopf"><input class="inp grow" id="shop-in" placeholder="Añadir a la lista" autocomplete="off"><button class="btn go" type="submit">Añadir</button></form>
    <div class="stick" style="padding-block:4px">${items.length ? [...pend, ...done].map(i => `<div class="shop-item ${i.done ? "done" : ""}"><button class="cb ${i.done ? "on" : ""}" data-shop="${esc(i.id)}" aria-pressed="${i.done}" aria-label="${esc(i.text)}">${i.done ? "✓" : ""}</button><span class="t grow">${esc(i.text)}</span><button class="btn plain sm" data-shopdel="${esc(i.id)}" aria-label="Quitar ${esc(i.text)}">✕</button></div>`).join("") : `<div class="empty"><span class="big">🛒</span>Lista vacía. Desde una receta podéis añadir todos sus ingredientes de golpe.</div>`}</div>
    ${done.length ? `<button class="btn sm" data-act="shop-clear">Quitar los comprados</button>` : ""}`;
  } else if (S.moreTab === "guias") {
    body = `<div class="stick" style="padding-block:2px">${GUIDES.map(g => `<details class="g"><summary>${esc(g.n)}</summary><div class="gb">${g.h}</div></details>`).join("")}</div>`;
  } else if (S.moreTab === "hitos") {
    const n = triedCount(tm), es = [...entries()].sort((a, b) => (a.date < b.date ? -1 : 1));
    const auto = { primera: es[0]?.date, primer_alergeno: es.find(e => foodInfo(e.food).a)?.date, diez: n >= 10, cincuenta: n >= 50, cien: n >= 100 };
    const ms = baby().milestones || {};
    body = `<div class="stick" style="padding-block:4px">${MILESTONES.map(m => {
      const isAuto = m.id in auto, val = isAuto ? auto[m.id] : ms[m.id], on = !!val;
      return `<div class="ms"><button class="cb ${on ? "on" : ""}" ${isAuto ? "disabled" : ""} data-ms="${m.id}" aria-pressed="${on}" aria-label="${esc(m.n)}">${on ? "✓" : ""}</button><div class="grow"><b>${esc(m.n)}</b><div class="small muted">${on ? (typeof val === "string" ? fmtLong(val) : "Conseguido") : isAuto ? "Se marca solo" : "Toca para marcarlo hoy"}</div></div></div>`;
    }).join("")}</div>`;
  } else {
    const lb = S.data.lastBackup;
    body = `<section class="stick c-kiwi stack" style="margin-top:0"><div><p class="label">Tus datos</p><h2 class="h3">Todo se guarda en este móvil</h2></div>
      <p>Cada vez que guardas un registro, una foto o un cambio, queda guardado al momento en el móvil, también sin internet.</p>
      <p>Para no perderlo si cambias de móvil o se borran los datos de Chrome, guarda de vez en cuando una <b>copia de seguridad</b> (un archivo que puedes mandarte por WhatsApp, email o Drive).</p>
      <p class="small"><b>Última copia:</b> ${lb ? fmtLong(lb) : "nunca"}</p>
      <div class="wrap-row"><button class="btn go" data-act="backup">💾 Guardar copia</button><label class="btn">📂 Recuperar copia<input type="file" accept="application/json,.json" id="restore" hidden></label></div></section>
    <section class="stick"><div class="row"><h2 class="h3 grow">Bebés</h2><button class="btn sm" data-act="add-baby-sheet">+ Añadir</button></div>
      <div class="list">${S.data.babies.map(b => `<button class="li" data-editbaby="${esc(b.id)}"><span class="emo" style="--tile-bg:var(--banana)">${esc(b.name.charAt(0))}</span><span class="grow"><span class="t">${esc(b.name)}</span><span class="s" style="display:block">${b.birth ? fmtLong(b.birth) + " · " + esc(ageText(b)) : "Sin fecha de nacimiento"}</span></span><span class="small muted">Editar</span></button>`).join("")}</div></section>
    <p class="foot"><button class="linkbtn" data-act="tour">¿Algo no quedó claro? Repetir el tutorial</button></p>
    <p class="foot">Información general basada en pautas de la AEP y AESAN. No sustituye el consejo de vuestra pediatra.</p>`;
  }
  return `<div class="stack"><div class="seg" role="group" aria-label="Secciones">${T.map(([k, n]) => `<button data-mt="${k}" aria-pressed="${S.moreTab === k}">${n}</button>`).join("")}</div>${body}</div>`;
}

/* ---------- eventos ---------- */
function afterRender() {
  const q = $("#food-q");
  if (q) q.oninput = () => { S.foodQ = q.value; const p = q.selectionStart; render(); const n = $("#food-q"); n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} };
  const rs = $("#restore");
  if (rs) rs.onchange = () => doRestore(rs.files[0]);
  const sf = $("#shopf");
  if (sf) sf.onsubmit = ev => { ev.preventDefault(); const t = $("#shop-in").value.trim(); if (!t) return; mutate(() => api("POST", "/api/shopping", { items: [t] })); };
}
document.addEventListener("click", ev => {
  const t = ev.target.closest("button"); if (!t || t.closest(".sheet") || !t.closest("#root")) return;
  const d = t.dataset, b = baby();
  if (d.v) { S.view = d.v; scrollTo(0, 0); render(); return; }
  if (d.go) { S.view = d.go; scrollTo(0, 0); render(); return; }
  if (d.food) return openFood(d.food);
  if (d.addfood) return openEntry({ food: d.addfood });
  if (d.entry) { const e = S.data.entries.find(x => x.id === d.entry); if (e) openEntry({ ...e }); return; }
  if (d.recipe) return openRecipe(d.recipe);
  if (d.ff) { S.foodFilter = d.ff; render(); return; }
  if (d.fc !== undefined) { S.foodCat = d.fc; render(); return; }
  if (d.rs !== undefined) { S.recStage = +d.rs; render(); return; }
  if (d.mt) { S.moreTab = d.mt; render(); return; }
  if (d.day) { S.selDay = d.day; render(); return; }
  if (d.cal) { const m = parseISO(S.calMonth); m.setMonth(m.getMonth() + +d.cal); S.calMonth = iso(m); render(); return; }
  if (d.ms) { const items = { ...(b.milestones || {}) }; if (items[d.ms]) delete items[d.ms]; else items[d.ms] = todayISO(); b.milestones = items; render(); return mutate(() => api("PUT", `/api/babies/${b.id}/milestones`, { items })); }
  if (d.shop) { const it = S.data.shopping.find(x => x.id === d.shop); it.done = !it.done; render(); return mutate(() => api("PUT", `/api/shopping/${it.id}`, { done: it.done })); }
  if (d.shopdel) { S.data.shopping = S.data.shopping.filter(x => x.id !== d.shopdel); render(); return mutate(() => api("DELETE", `/api/shopping/${d.shopdel}`)); }
  if (d.editbaby) return openBabyForm(S.data.babies.find(x => x.id === d.editbaby));
  switch (d.act) {
    case "add-baby": {
      const name = $("#nb-name").value.trim(), birth = $("#nb-birth").value;
      if (!name) return toast("Escribe su nombre.");
      return mutate(async () => { const r = await api("POST", "/api/babies", { name, birth }); S.babyId = r.id; }, `¡Bienvenida, ${name}!`);
    }
    case "edit-baby": return openBabyForm(b);
    case "add-baby-sheet": return openBabyForm(null);
    case "new-entry": return openEntry({ date: d.date || todayISO() });
    case "new-custom": return openEntry({ customName: S.foodQ.trim() });
    case "export": return exportCSV();
    case "backup": return doBackup();
    case "tour": return startTour();
    case "go-backup": S.view = "more"; S.moreTab = "familia"; scrollTo(0, 0); render(); return;
    case "report": return openReport();
    case "shop-clear": return mutate(() => api("POST", "/api/shopping-clear", {}));
    case "share-invite": {
      const link = $("#invlink").textContent;
      if (navigator.share) return navigator.share({ title: "Primeros Bocados", text: `Únete a nuestra familia en Primeros Bocados para apuntar lo que come ${b.name}:`, url: link }).catch(() => {});
      return copy(link);
    }
    case "copy-invite": return copy($("#invlink").textContent);
    case "rotate-invite": return mutate(() => api("POST", "/api/family/invite", {}), "Código nuevo. El enlace anterior ya no sirve.");
    case "password": return openPassword();
    case "logout": return api("POST", "/api/logout", {}).finally(() => { try { localStorage.removeItem(LS("state")); } catch (e) {} S.data = null; S.authMode = "login"; S.view = "home"; renderAuth(); });
  }
});
async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Enlace copiado"); }
  catch (e) { const r = document.createRange(); r.selectNodeContents($("#invlink")); getSelection().removeAllRanges(); getSelection().addRange(r); toast("Selecciónalo y cópialo"); }
}
let toastT;
function toast(t) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2800);
}


/* ---------- tutorial de primer uso ---------- */
const TOUR = [
  { t: "¡Bienvenida a Primeros Bocados!", x: () => `¿Te enseño la app en un minuto? Son unos pasos, en el orden en que la vais a usar los primeros días. No es obligatorio: puedes saltarlo y repetirlo cuando quieras desde <b>Más &gt; Ajustes</b>.` },
  { v: "home", sel: "#babypill", t: "Tu bebé", x: () => `Aquí ves a ${esc(baby()?.name || "tu bebé")} y su edad. Toda la app se adapta a su edad: cómo cortar cada alimento y qué conviene esperar. Tócalo para cambiar sus datos o añadir otro bebé.` },
  { v: "home", sel: ".hero", t: "Los primeros 100 alimentos", x: () => `El objetivo es que pruebe unos 100 alimentos distintos antes del año. El cuenco se va llenando con cada alimento nuevo que apuntéis.` },
  { v: "home", sel: ".sugs", t: "Ideas para hoy", x: () => `Cada día te propongo tres alimentos que aún no ha probado y que son adecuados para su edad. Toca uno para ver cómo prepararlo.` },
  { v: "foods", sel: "#food-q", t: "Antes de dar algo nuevo, búscalo", x: () => `Hay más de 200 alimentos. Búscalo aquí o filtra por grupo, por los que son para su edad o por los que aún no ha probado.` },
  { v: "foods", sel: ".fgrid .ftile", t: "La ficha de cada alimento", x: () => `Dentro verás cómo prepararlo según la edad, si es alérgeno, si tiene hierro y el riesgo de atragantamiento. Los puntitos lo resumen: <b>morado</b> alérgeno, <b>naranja</b> hierro, <b>amarillo o rojo</b> atragantamiento.` },
  { v: "home", sel: "[data-act=new-entry]", t: "Apuntar lo que ha comido", x: () => `Después de cada comida toca aquí: eliges el alimento, si le gustó, si hubo alguna reacción y, si quieres, una foto. Se guarda al momento.` },
  { v: "allergens", sel: ".stick.c-grape", t: "Alérgenos, de uno en uno", x: () => `Introduce cada alérgeno por separado y por la mañana. Cuando lo haya tomado <b>3 días distintos</b> sin reacción, queda como tolerado. Si empiezas otro demasiado pronto, la app te avisa.` },
  { v: "log", sel: ".cal", t: "El diario", x: () => `Los días con comida tienen puntitos: <b>verde</b> normal, <b>morado</b> alérgeno y <b>rojo</b> reacción. Toca un día para ver lo que comió.` },
  { v: "log", sel: "[data-act=report]", t: "Para la revisión con la pediatra", x: () => `Prepara un resumen con los alérgenos, las reacciones y todo lo que ha probado. Se puede imprimir o guardar en PDF.` },
  { v: "more", mt: "ideas", sel: ".seg[aria-label=Secciones]", t: "Más cosas útiles", x: () => `<b>Ideas</b> de comidas (pasan los ingredientes a la <b>Compra</b> con un toque), <b>Guías</b> y <b>Hitos</b>. Empieza leyendo las guías «¿Está lista para empezar?» y «Arcada o atragantamiento».` },
  { v: "more", mt: "familia", sel: "[data-act=backup]", t: "Muy importante: la copia", x: () => `Todo se guarda en este móvil. De vez en cuando pulsa <b>Guardar copia</b> y mándatela por WhatsApp o Drive. Si cambias de móvil, con <b>Recuperar copia</b> vuelve todo.` },
  { v: "home", t: "¡Lista para empezar!", x: () => `Un último consejo: al comer, siempre sentada recta y vigilada. Ante cualquier duda, consulta con vuestra pediatra. ¡Que aproveche!`, last: true }
];
let tourStep = -1;
function startTour() { tourStep = 0; closeSheet(true); showTourStep(); }
function endTour() {
  tourStep = -1; $("#tour")?.remove(); document.body.style.overflow = ""; document.body.classList.remove("touring");
  S.view = "home"; scrollTo(0, 0); render();
  api("POST", "/api/tour", { done: true }).then(() => loadState()).catch(() => {});
}
async function showTourStep(dir = 1) {
  let st = TOUR[tourStep];
  if (st.v && S.view !== st.v || st.mt && S.moreTab !== st.mt) {
    if (st.v) S.view = st.v;
    if (st.mt) S.moreTab = st.mt;
    scrollTo(0, 0); render();
  }
  let el = st.sel ? $(st.sel) : null;
  if (st.sel && !el) { tourStep += dir; if (tourStep < 0 || tourStep >= TOUR.length) return endTour(); return showTourStep(dir); }
  document.body.style.overflow = "hidden";
  document.body.classList.add("touring");
  const fixedEl = el && (getComputedStyle(el).position === "fixed" || el.closest(".top, .tabs"));
  if (el && !fixedEl) { el.scrollIntoView({ block: "start", behavior: "instant" }); scrollBy(0, -86); }
  const t = $("#toast"); if (t) t.hidden = true;
  let ov = $("#tour");
  if (!ov) { ov = document.createElement("div"); ov.id = "tour"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); document.body.appendChild(ov); }
  const n = TOUR.length;
  let hole = "", pos = "center";
  if (el) {
    const r = el.getBoundingClientRect(), pad = 8;
    hole = `<div class="tour-hole" style="top:${r.top - pad}px;left:${Math.max(4, r.left - pad)}px;width:${Math.min(innerWidth - 8, r.width + pad * 2)}px;height:${r.height + pad * 2}px"></div>`;
    pos = "bottom";
  }
  ov.innerHTML = `${el ? hole : `<div class="tour-dim"></div>`}
    <div class="tour-card ${pos}" aria-live="polite">
      <div class="row"><p class="label grow">Paso ${tourStep + 1} de ${n}</p>${st.last || tourStep === 0 ? "" : `<button class="btn plain sm" data-tour="skip">Saltar tutorial</button>`}</div>
      <h2 class="h3">${st.t}</h2>
      <p>${st.x()}</p>
      <div class="tour-dots" aria-hidden="true">${TOUR.map((_, i) => `<i class="${i === tourStep ? "on" : ""}"></i>`).join("")}</div>
      <div class="row">${tourStep === 0 ? `<button class="btn sm plain" data-tour="skip">Ahora no</button>` : ""}${tourStep > 0 && !st.last ? `<button class="btn sm" data-tour="prev">Atrás</button>` : ""}<span class="grow"></span><button class="btn go" data-tour="next">${st.last ? "Empezar" : tourStep === 0 ? "Vamos" : "Siguiente"}</button></div>
    </div>`;
  // si la tarjeta tapa lo resaltado, se coloca arriba
  if (el) {
    const card = $(".tour-card", ov), r = el.getBoundingClientRect(), c = card.getBoundingClientRect();
    if (r.bottom + 8 > c.top && r.top - 8 < c.bottom) {
      card.classList.remove("bottom"); card.classList.add("top");
      if (!fixedEl) {
        // baja el elemento hacia la parte de abajo de la pantalla para que no lo tape la tarjeta
        const ch = card.getBoundingClientRect().height;
        scrollBy(0, r.top - (ch + 28));
        const r2 = el.getBoundingClientRect(), hole = $(".tour-hole", ov);
        hole.style.top = `${r2.top - 8}px`;
      }
    }
  }
  $("[data-tour=next]", ov).focus({ preventScroll: true });
}
document.addEventListener("click", ev => {
  const b = ev.target.closest("[data-tour]"); if (!b) return;
  ev.stopPropagation();
  const a = b.dataset.tour;
  if (a === "skip") return endTour();
  if (a === "next") { if (tourStep >= TOUR.length - 1) return endTour(); tourStep++; return showTourStep(1); }
  if (a === "prev") { tourStep = Math.max(0, tourStep - 1); return showTourStep(-1); }
}, true);
addEventListener("resize", () => { if (tourStep >= 0) showTourStep(); });
document.addEventListener("keydown", e => { if (tourStep >= 0 && e.key === "Escape") endTour(); });

/* ---------- hojas ---------- */
let currentSheet = null;
let tourAsked = false;
function openSheet(build) {
  closeSheet(true);
  const scrim = document.createElement("div"); scrim.className = "scrim";
  const sh = document.createElement("div"); sh.className = "sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true");
  document.body.append(scrim, sh);
  const o = { sh, scrim, refresh: null };
  currentSheet = o;
  build(o);
  scrim.onclick = () => closeSheet();
  sh.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeSheet(); });
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => { scrim.classList.add("on"); sh.classList.add("on"); });
}
function closeSheet(instant) {
  if (!currentSheet) return;
  const { sh, scrim } = currentSheet; currentSheet = null;
  document.body.style.overflow = "";
  if (instant) { sh.remove(); scrim.remove(); return; }
  sh.classList.remove("on"); scrim.classList.remove("on");
  setTimeout(() => { sh.remove(); scrim.remove(); }, 260);
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
const head = (title, lead = "") => `<div class="grab"></div><div class="sh-h">${lead}<h2 class="grow">${title}</h2><button class="iconbtn" data-close aria-label="Cerrar">✕</button></div>`;

function openFood(id) {
  let stage = stageIdx();
  openSheet(o => {
    const draw = () => {
      const f = foodInfo(id), tm = triedMap(), hist = tm[id] || [], b = baby();
      const fav = (b.lists.fav || []).includes(id), later = (b.lists.later || []).includes(id);
      const recs = RECIPES.filter(r => r.foods.includes(id)), age = ageMonths();
      const ch = ["", "Riesgo medio de atragantamiento: respeta el corte y la textura.", "Riesgo alto de atragantamiento: sigue la preparación al pie de la letra."][f.ch];
      o.sh.innerHTML = head(esc(f.n), emo(f, "bigemo")) + `<div class="sh-b">
        <div class="tags" style="margin-top:-6px"><span class="tag wait">${esc(CATS[f.c]?.n || "Otros")}</span>${tags(f)}${hist.length ? `<span class="tag ok">Probado ${hist.length} ${hist.length === 1 ? "vez" : "veces"}</span>` : ""}</div>
        ${f.custom ? `<p class="muted">Alimento añadido por vosotros.</p>` : `
        ${age != null && age < f.m ? `<div class="note c1"><b>Todavía no.</b> Recomendado desde los ${f.m >= 24 ? Math.round(f.m / 12) + " años" : f.m + " meses"}. Ahora tiene ${esc(ageText())}.</div>` : ""}
        <div><p class="label" style="margin-bottom:8px">Cómo prepararlo</p><div class="seg" role="group" aria-label="Edad">${STAGES.map((s, i) => `<button data-stage="${i}" aria-pressed="${stage === i}">${s}</button>`).join("")}</div><p class="prep" style="margin-top:12px">${esc(f.p[stage])}</p></div>
        ${f.ch ? `<div class="note c${f.ch}">${ch}</div>` : ""}
        ${f.a ? `<div class="note al"><b>Alérgeno: ${esc(ALLERGENS[f.a].n)}.</b> Ofrécelo por la mañana y sin otro alimento nuevo ese día. ${esc(ALLERGENS[f.a].how)}</div>` : ""}
        ${f.fe ? `<div class="note fe"><b>Rico en hierro.</b> Acompáñalo de algo con vitamina C (tomate, pimiento, kiwi, naranja) para absorberlo mejor.</div>` : ""}
        ${f.t ? `<div class="note tip">💡 ${esc(f.t)}</div>` : ""}`}
        <div class="wrap-row"><button class="btn go" data-x="log">+ Registrar</button><button class="btn" data-x="fav" aria-pressed="${fav}">❤️ Favorito</button><button class="btn" data-x="later" aria-pressed="${later}">⏰ Más tarde</button></div>
        <div><p class="label">Historial</p>${hist.length ? `<div class="list">${hist.map(entryLi).join("")}</div>` : `<p class="muted" style="margin-top:6px">Aún no lo ha probado.</p>`}</div>
        ${recs.length ? `<div><p class="label">Ideas con este alimento</p><div class="list">${recs.map(r => `<button class="li" data-recipe="${r.id}"><span class="grow t">${esc(r.n)}</span><span class="small muted">${r.age}m+</span></button>`).join("")}</div></div>` : ""}
      </div>`;
      $$("[data-stage]", o.sh).forEach(x => x.onclick = () => { stage = +x.dataset.stage; draw(); });
      $("[data-x=log]", o.sh).onclick = () => openEntry({ food: id });
      $("[data-x=fav]", o.sh).onclick = () => toggleList("fav", id);
      $("[data-x=later]", o.sh).onclick = () => toggleList("later", id);
      $$("[data-entry]", o.sh).forEach(x => x.onclick = () => { const e = S.data.entries.find(y => y.id === x.dataset.entry); openEntry({ ...e }); });
      $$("[data-recipe]", o.sh).forEach(x => x.onclick = () => openRecipe(x.dataset.recipe));
    };
    o.refresh = () => { const b = o.sh.querySelector(".sh-b"), st = b?.scrollTop || 0; draw(); const nb = o.sh.querySelector(".sh-b"); if (nb) nb.scrollTop = st; };
    draw();
  });
}
function toggleList(k, id) {
  const b = baby(), lists = { fav: [...(b.lists.fav || [])], later: [...(b.lists.later || [])] };
  const i = lists[k].indexOf(id); if (i >= 0) lists[k].splice(i, 1); else lists[k].push(id);
  b.lists = lists; render();
  mutate(() => api("PUT", `/api/babies/${b.id}/lists`, lists));
}

/* foto: se reduce en el móvil antes de subirla */
async function shrink(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = url; });
    const max = 1280, sc = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.82));
  } finally { URL.revokeObjectURL(url); }
}

function openEntry(init) {
  const isEdit = !!init.id;
  const e = { date: todayISO(), liked: 0, reaction: "none", symptoms: [], notes: "", ...init, symptoms: [...(init.symptoms || [])] };
  let q = init.customName || "", photoBlob = null, photoURL = null, dropPhoto = false, busy = false;
  openSheet(o => {
    const draw = () => {
      const f = e.food ? foodInfo(e.food) : null;
      const matches = q.trim() ? [...FOODS, ...S.data.custom.map(c => foodInfo(c.id))].filter(x => norm(x.n).includes(norm(q.trim()))).slice(0, 6) : [];
      const curPhoto = photoURL || (!dropPhoto && e.photo ? PHOTO[e.photo] : null);
      o.sh.innerHTML = head(isEdit ? "Editar registro" : "Nuevo registro") + `<div class="sh-b">
        ${f ? `<div class="picked">${emo(f, "bigemo")}<b class="grow" style="font-size:18px">${esc(f.n)}</b>${isEdit ? "" : `<button class="btn sm plain" data-x="unpick">Cambiar</button>`}</div>` : `
          <label class="field">¿Qué ha comido?<input class="inp" id="e-q" placeholder="Escribe para buscar" value="${esc(q)}" autocomplete="off"></label>
          ${q.trim() ? `<div class="sugbox">${matches.map(m => `<button data-pick="${esc(m.id)}"><span style="font-size:22px">${foodEmo(m)}</span>${esc(m.n)}</button>`).join("")}<button data-x="custom">➕ Añadir «${esc(q.trim())}» como nuevo</button></div>` : ""}`}
        ${f?.a ? `<div class="note al"><b>Alérgeno: ${esc(ALLERGENS[f.a].n)}.</b> Observad las próximas 2 horas.</div>${spacingWarn(f.a, e.date, isEdit)}` : ""}
        <label class="field">Fecha<input class="inp" id="e-date" type="date" value="${e.date}" max="${todayISO()}"></label>
        <div class="field">¿Le gustó?<div class="seg" role="group">${[1, 2, 3].map(k => `<button data-like="${k}" aria-pressed="${e.liked === k}">${LIKE_E[k]} ${{ 1: "No", 2: "Normal", 3: "¡Mucho!" }[k]}</button>`).join("")}</div></div>
        <div class="field">¿Alguna reacción?<div class="seg" role="group">${["none", "mild", "severe"].map(k => `<button data-rx="${k}" aria-pressed="${e.reaction === k}">${{ none: "Ninguna", mild: "Leve", severe: "Fuerte" }[k]}</button>`).join("")}</div></div>
        ${e.reaction !== "none" ? `<div class="wrap-row">${SYMPTOMS.map(s => `<button class="chip" data-sym="${esc(s)}" aria-pressed="${e.symptoms.includes(s)}">${esc(s)}</button>`).join("")}</div>${e.reaction === "severe" ? `<div class="note sos"><b>Si hay dificultad para respirar, hinchazón de labios o lengua, o está decaída, llamad al 112.</b></div>` : ""}` : ""}
        <div class="field"><span>Foto <span class="small muted" style="font-weight:600">(opcional)</span></span>
          ${curPhoto ? `<img class="photo-prev" src="${curPhoto}" alt="Foto de la comida"><div class="wrap-row"><label class="btn sm">Cambiar<input type="file" accept="image/*" id="e-photo" hidden></label><button class="btn sm plain" data-x="nophoto">Quitar foto</button></div>`
                     : `<label class="btn sm" style="align-self:flex-start">📷 Añadir foto<input type="file" accept="image/*" id="e-photo" hidden></label>`}</div>
        <label class="field">Notas<textarea class="inp" id="e-notes" placeholder="Cantidad, cómo lo preparasteis, cómo lo cogió…">${esc(e.notes)}</textarea></label>
        <button class="btn go block" data-x="save" ${busy ? "disabled" : ""}>${busy ? "Guardando…" : isEdit ? "Guardar cambios" : "Guardar registro"}</button>
        ${isEdit ? `<button class="btn danger block" data-x="del">Borrar registro</button>` : ""}
      </div>`;
      const sh = o.sh;
      const keep = () => { e.date = $("#e-date", sh).value || e.date; e.notes = $("#e-notes", sh).value; };
      const qi = $("#e-q", sh);
      if (qi) { qi.oninput = () => { q = qi.value; keep(); draw(); const n = $("#e-q", o.sh); n.focus(); n.setSelectionRange(q.length, q.length); }; if (!q) setTimeout(() => qi.focus(), 320); }
      $$("[data-pick]", sh).forEach(x => x.onclick = () => { keep(); e.food = x.dataset.pick; q = ""; draw(); });
      const cu = $("[data-x=custom]", sh);
      if (cu) cu.onclick = async () => { keep(); try { const r = await api("POST", "/api/custom", { name: q.trim() }); S.data.custom.push({ id: r.id, n: q.trim(), a: "" }); e.food = r.id; q = ""; draw(); } catch (err) { toast(err?.error || "No se pudo añadir."); } };
      const up = $("[data-x=unpick]", sh); if (up) up.onclick = () => { keep(); e.food = null; draw(); };
      $$("[data-like]", sh).forEach(x => x.onclick = () => { keep(); e.liked = e.liked === +x.dataset.like ? 0 : +x.dataset.like; draw(); });
      $$("[data-rx]", sh).forEach(x => x.onclick = () => { keep(); e.reaction = x.dataset.rx; if (e.reaction === "none") e.symptoms = []; draw(); });
      $$("[data-sym]", sh).forEach(x => x.onclick = () => { keep(); const s = x.dataset.sym, i = e.symptoms.indexOf(s); if (i >= 0) e.symptoms.splice(i, 1); else e.symptoms.push(s); draw(); });
      const pi = $("#e-photo", sh);
      if (pi) pi.onchange = async () => { keep(); const file = pi.files[0]; if (!file) return; try { photoBlob = await shrink(file); if (photoURL) URL.revokeObjectURL(photoURL); photoURL = URL.createObjectURL(photoBlob); dropPhoto = false; draw(); } catch (err) { toast("No se pudo leer la foto."); } };
      const np = $("[data-x=nophoto]", sh); if (np) np.onclick = () => { keep(); photoBlob = null; if (photoURL) URL.revokeObjectURL(photoURL); photoURL = null; dropPhoto = true; draw(); };
      $("[data-x=save]", sh).onclick = async () => {
        keep();
        if (!e.food) return toast("Elige un alimento.");
        busy = true; draw();
        const id = e.id || uid();
        try {
          await api("PUT", `/api/entries/${id}`, { baby: baby().id, food: e.food, date: e.date, liked: e.liked || 0, reaction: e.reaction, symptoms: e.symptoms, notes: e.notes.trim() });
          if (photoBlob) { const fd = new FormData(); fd.append("photo", photoBlob, "foto.jpg"); await api("POST", `/api/entries/${id}/photo`, fd, true); }
          else if (dropPhoto && e.photo) await api("DELETE", `/api/entries/${id}/photo`);
          closeSheet(); await loadState();
          toast(isEdit ? "Cambios guardados" : `${foodInfo(e.food).n} registrado`);
        } catch (err) { busy = false; draw(); toast(err?.error || "No se pudo guardar."); }
      };
      const del = $("[data-x=del]", sh);
      if (del) del.onclick = () => {
        if (del.dataset.confirm) { closeSheet(); mutate(() => api("DELETE", `/api/entries/${e.id}`), "Registro borrado"); }
        else { del.dataset.confirm = "1"; del.textContent = "Toca otra vez para borrar"; }
      };
    };
    draw();
  });
}

function openRecipe(id) {
  const r = RECIPE[id];
  openSheet(o => {
    const tm = triedMap(), als = [...new Set(r.foods.map(f => FOOD[f]?.a).filter(Boolean))];
    o.sh.innerHTML = head(esc(r.n)) + `<div class="sh-b">
      <div class="tags" style="margin-top:-6px"><span class="tag wait">Desde ${r.age} meses</span><span class="tag wait">⏱ ${r.time}</span>${als.map(a => `<span class="tag al">${esc(ALLERGENS[a].n)}</span>`).join("")}</div>
      ${als.some(a => allergenStatus(a, tm).st === "pend") ? `<div class="note al">Lleva un alérgeno que aún no ha probado. Introducidlo antes por separado.</div>` : ""}
      <div><p class="label" style="margin-bottom:6px">Ingredientes</p><ul style="margin:0;padding-left:20px">${r.ing.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
      <button class="btn sun" data-x="shop">🛒 Añadir a la lista de la compra</button>
      <div><p class="label" style="margin-bottom:6px">Pasos</p><ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div class="note tip">Sin sal ni azúcar. Comprobad la textura: que se aplaste entre los dedos.</div>
      <div><p class="label">Alimentos</p><div class="list">${r.foods.map(fid => foodLi(FOOD[fid], tm)).join("")}</div></div>
      <button class="btn go block" data-x="logall">Registrar todos hoy</button>
    </div>`;
    $$("[data-food]", o.sh).forEach(x => x.onclick = () => openFood(x.dataset.food));
    $("[data-x=shop]", o.sh).onclick = async () => {
      try { const res = await api("POST", "/api/shopping", { items: r.ing }); await loadState(); toast(res.added ? `${res.added} ingredientes añadidos` : "Ya estaban en la lista"); } catch (err) { toast(err?.error || "No se pudo añadir."); }
    };
    $("[data-x=logall]", o.sh).onclick = async () => {
      closeSheet();
      const day = todayISO();
      await mutate(async () => { for (const fid of r.foods) if (countable(fid)) await api("PUT", `/api/entries/${uid()}`, { baby: baby().id, food: fid, date: day, liked: 0, reaction: "none", symptoms: [], notes: "En: " + r.n }); }, "Alimentos registrados");
    };
  });
}

function openBabies() {
  if (!S.data.babies.length) return;
  if (S.data.babies.length === 1) return openBabyForm(baby());
  openSheet(o => {
    o.sh.innerHTML = head("¿Quién come hoy?") + `<div class="sh-b"><div class="list">${S.data.babies.map(b => `<button class="li" data-b="${esc(b.id)}"><span class="emo" style="--tile-bg:var(--banana)">${esc(b.name.charAt(0))}</span><span class="grow"><span class="t">${esc(b.name)}${b.id === baby().id ? " ✓" : ""}</span><span class="s" style="display:block">${esc(ageText(b))}</span></span></button>`).join("")}</div>
      <button class="btn block" data-x="add">+ Añadir otro bebé</button></div>`;
    $$("[data-b]", o.sh).forEach(x => x.onclick = () => { S.babyId = x.dataset.b; closeSheet(); render(); });
    $("[data-x=add]", o.sh).onclick = () => openBabyForm(null);
  });
}
function openBabyForm(b) {
  openSheet(o => {
    o.sh.innerHTML = head(b ? `Editar a ${esc(b.name)}` : "Nuevo bebé") + `<div class="sh-b">
      <label class="field">Nombre<input class="inp" id="bf-name" value="${esc(b?.name || "")}" autocomplete="off"></label>
      <label class="field">Fecha de nacimiento<input class="inp" id="bf-birth" type="date" value="${esc(b?.birth || "")}" max="${todayISO()}"></label>
      <button class="btn go block" data-x="save">Guardar</button>
      ${b ? `<button class="btn danger block" data-x="del">Borrar a ${esc(b.name)} y todos sus registros</button>` : ""}</div>`;
    $("[data-x=save]", o.sh).onclick = () => {
      const name = $("#bf-name", o.sh).value.trim(), birth = $("#bf-birth", o.sh).value;
      if (!name) return toast("Escribe su nombre.");
      closeSheet();
      mutate(async () => { if (b) await api("PUT", `/api/babies/${b.id}`, { name, birth }); else { const r = await api("POST", "/api/babies", { name, birth }); S.babyId = r.id; } }, "Guardado");
    };
    const del = $("[data-x=del]", o.sh);
    if (del) del.onclick = () => {
      if (del.dataset.confirm) { closeSheet(); mutate(() => api("DELETE", `/api/babies/${b.id}`), "Borrado"); }
      else { del.dataset.confirm = "1"; del.textContent = "Toca otra vez para borrarlo todo"; }
    };
  });
}
function openPassword() {
  openSheet(o => {
    o.sh.innerHTML = head("Cambiar contraseña") + `<form class="sh-b" id="pwf"><label class="field">Contraseña actual<input class="inp" id="pw-cur" type="password" autocomplete="current-password"></label>
      <label class="field">Nueva contraseña<input class="inp" id="pw-new" type="password" autocomplete="new-password" minlength="10"></label>
      <button class="btn go block" type="submit">Cambiar</button></form>`;
    $("#pwf", o.sh).onsubmit = async ev => {
      ev.preventDefault();
      try { await api("POST", "/api/password", { current: $("#pw-cur", o.sh).value, next: $("#pw-new", o.sh).value }); closeSheet(); toast("Contraseña cambiada"); }
      catch (err) { toast(err?.error || "No se pudo cambiar."); }
    };
  });
}

/* ---------- informe para la pediatra ---------- */
function openReport() {
  const b = baby(), tm = triedMap();
  const rows = ALLERGEN_ORDER.map(k => ({ k, ...allergenStatus(k, tm) }));
  const rx = entries().filter(e => e.reaction !== "none").sort((x, y) => (x.date < y.date ? -1 : 1));
  const tried = Object.keys(tm).map(foodInfo).filter(f => countable(f.id) || f.custom).sort((x, y) => x.n.localeCompare(y.n, "es"));
  openSheet(o => {
    o.sh.innerHTML = head("Informe para la pediatra") + `<div class="sh-b" id="report">
      <div><h2 class="h2">${esc(b.name)}</h2><p class="muted">${b.birth ? "Nacimiento: " + fmtLong(b.birth) + " · " + esc(ageText(b)) : ""} · Informe del ${fmtLong(todayISO())}</p></div>
      <div><p class="label" style="margin-bottom:6px">Alérgenos</p><table style="width:100%;border-collapse:collapse;font-size:14.5px">${rows.map(r => `<tr style="border-bottom:1px solid var(--hair)"><td style="padding:6px 0;font-weight:700">${esc(ALLERGENS[r.k].n)}</td><td>${{ pend: "No introducido", curso: `En curso (${r.n}/3)`, ok: "Tolerado", rx: "Reacción" }[r.st]}</td><td class="num" style="text-align:right">${r.first ? fmtDate(r.first) : ""}</td></tr>`).join("")}</table></div>
      <div><p class="label" style="margin-bottom:6px">Reacciones anotadas</p>${rx.length ? rx.map(e => `<p style="margin-bottom:6px"><b>${fmtDate(e.date)} · ${esc(foodInfo(e.food).n)}</b> (${e.reaction === "severe" ? "fuerte" : "leve"}): ${esc(e.symptoms.join(", ") || "sin detalle")}${e.notes ? `. ${esc(e.notes)}` : ""}</p>`).join("") : `<p class="muted">Ninguna.</p>`}</div>
      <div><p class="label" style="margin-bottom:6px">Alimentos probados (${tried.length})</p><p>${tried.map(f => esc(f.n)).join(", ") || "Ninguno todavía."}</p></div>
      <div class="wrap-row noprint"><button class="btn go" data-x="print">🖨️ Imprimir o guardar PDF</button><button class="btn" data-x="csv">Exportar CSV</button></div>
    </div>`;
    $("[data-x=print]", o.sh).onclick = () => { document.body.classList.add("printing"); window.print(); setTimeout(() => document.body.classList.remove("printing"), 500); };
    $("[data-x=csv]", o.sh).onclick = exportCSV;
  });
}
function saveFile(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function doBackup() {
  try {
    const blob = await Local.exportBackup();
    const file = new File([blob], `bocados-copia-${todayISO()}.json`, { type: "application/json" });
    // en Android se puede mandar directamente por WhatsApp, Drive o email
    if (navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], title: "Copia de Primeros Bocados" }); } catch (e) { if (e.name !== "AbortError") saveFile(blob, file.name); } }
    else saveFile(blob, file.name);
    await loadState(); toast("Copia guardada");
  } catch (e) { toast("No se pudo crear la copia."); }
}
async function doRestore(file) {
  const inp = $("#restore"); if (inp) inp.value = "";
  if (!file) return;
  let info;
  try { const d = JSON.parse(await file.text()); if (d.app !== "primeros-bocados") throw 0; info = d; }
  catch (e) { return toast("Este archivo no es una copia de Primeros Bocados."); }
  openSheet(o => {
    o.sh.innerHTML = head("Recuperar copia") + `<div class="sh-b">
      <p>Copia del <b>${info.date ? fmtLong(info.date) : "—"}</b> con ${info.state.entries.length} registros de ${info.state.babies.map(b => esc(b.name)).join(", ") || "ningún bebé"}.</p>
      <div class="note c1"><b>Ojo:</b> los datos que hay ahora en el móvil se sustituirán por los de la copia.</div>
      <button class="btn go block" data-x="ok">Recuperar</button><button class="btn block plain" data-close>Cancelar</button></div>`;
    $("[data-x=ok]", o.sh).onclick = async () => {
      closeSheet();
      try { await Local.importBackup(file); for (const k in PHOTO) delete PHOTO[k]; await loadState(); toast("Copia recuperada"); }
      catch (e) { toast(e?.error || "No se pudo leer el archivo."); }
    };
  });
}
function exportCSV() {
  const rows = [["fecha", "bebé", "alimento", "grupo", "alérgeno", "le gustó", "reacción", "síntomas", "notas", "apuntado por"]];
  for (const e of [...entries()].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    const f = foodInfo(e.food);
    rows.push([e.date, baby().name, f.n, CATS[f.c]?.n || "", f.a ? ALLERGENS[f.a].n : "", e.liked ? LIKE[e.liked] : "", RX[e.reaction] || "", (e.symptoms || []).join("; "), e.notes || "", memberName(e.by)]);
  }
  const csv = "﻿" + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = `bocados-${norm(baby().name)}-${todayISO()}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

boot();

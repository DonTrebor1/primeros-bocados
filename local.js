"use strict";
/* Primeros Bocados (versión móvil): todos los datos se guardan en este dispositivo (IndexedDB).
   Imita las rutas del servidor para que app.js funcione igual. */
const LocalDB = (() => {
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((ok, ko) => {
      const r = indexedDB.open("primeros-bocados", 1);
      r.onupgradeneeded = () => { r.result.createObjectStore("kv"); r.result.createObjectStore("photos"); };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => ko(r.error);
    });
    return dbp;
  }
  async function tx(store, mode, fn) {
    const db = await open();
    return new Promise((ok, ko) => {
      const t = db.transaction(store, mode), s = t.objectStore(store);
      let out; const req = fn(s); if (req) req.onsuccess = () => (out = req.result);
      t.oncomplete = () => ok(out); t.onerror = () => ko(t.error); t.onabort = () => ko(t.error);
    });
  }
  return {
    get: (store, k) => tx(store, "readonly", s => s.get(k)),
    put: (store, k, v) => tx(store, "readwrite", s => { s.put(v, k); }),
    del: (store, k) => tx(store, "readwrite", s => { s.delete(k); }),
    keys: store => tx(store, "readonly", s => s.getAllKeys()),
    clear: store => tx(store, "readwrite", s => { s.clear(); })
  };
})();

const Local = (() => {
  let st = null;
  const blank = () => ({ rev: 0, me: { id: "local", name: "", email: "" }, family: { name: "Mi familia", invite: "", members: [{ id: "local", name: "" }] }, babies: [], entries: [], custom: [], shopping: [], lastBackup: null });
  const nid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => Date.now();
  async function load() {
    if (st) return st;
    st = (await LocalDB.get("kv", "state").catch(() => null)) || blank();
    return st;
  }
  async function save() { st.rev++; await LocalDB.put("kv", "state", st); }
  const err = (m, code = 400) => { throw { error: m, code }; };
  const baby = id => st.babies.find(b => b.id === id) || err("Bebé no encontrado", 404);

  async function handle(method, url, body) {
    await load();
    const path = url.split("?")[0];
    const m = (re) => path.match(re);
    let x;
    if (method === "GET" && path === "/api/state") return JSON.parse(JSON.stringify(st));
    if (method === "GET" && path === "/api/rev") return { rev: st.rev };
    if (method === "POST" && path === "/api/babies") {
      if (!body.name) err("Falta el nombre.");
      const id = nid(); st.babies.push({ id, name: String(body.name).slice(0, 40), birth: body.birth || "", lists: {}, milestones: {} });
      await save(); return { id };
    }
    if ((x = m(/^\/api\/babies\/([^/]+)$/))) {
      const b = baby(x[1]);
      if (method === "PUT") { if (!body.name) err("Falta el nombre."); b.name = String(body.name).slice(0, 40); b.birth = body.birth || ""; await save(); return { ok: true }; }
      if (method === "DELETE") {
        for (const e of st.entries.filter(e => e.baby === b.id && e.photo)) await LocalDB.del("photos", e.photo);
        st.entries = st.entries.filter(e => e.baby !== b.id); st.babies = st.babies.filter(y => y.id !== b.id);
        await save(); return { ok: true };
      }
    }
    if ((x = m(/^\/api\/babies\/([^/]+)\/lists$/))) { baby(x[1]).lists = { fav: body.fav || [], later: body.later || [] }; await save(); return { ok: true }; }
    if ((x = m(/^\/api\/babies\/([^/]+)\/milestones$/))) { baby(x[1]).milestones = body.items || {}; await save(); return { ok: true }; }
    if ((x = m(/^\/api\/entries\/([^/]+)$/))) {
      const id = x[1];
      if (method === "PUT") {
        baby(body.baby);
        const ex = st.entries.find(e => e.id === id);
        const rec = { id, baby: body.baby, food: body.food, date: body.date, liked: body.liked || 0, reaction: body.reaction || "none", symptoms: body.symptoms || [], notes: String(body.notes || "").slice(0, 1000), photo: ex?.photo || null, by: "local", ts: ex?.ts || now() };
        if (ex) Object.assign(ex, rec); else st.entries.push(rec);
        await save(); return { ok: true };
      }
      if (method === "DELETE") {
        const e = st.entries.find(y => y.id === id) || err("No encontrado.", 404);
        if (e.photo) await LocalDB.del("photos", e.photo);
        st.entries = st.entries.filter(y => y.id !== id); await save(); return { ok: true };
      }
    }
    if ((x = m(/^\/api\/entries\/([^/]+)\/photo$/))) {
      const e = st.entries.find(y => y.id === x[1]) || err("Guarda primero el registro.", 404);
      if (e.photo) await LocalDB.del("photos", e.photo);
      if (method === "POST") { const blob = body.get("photo"); const pid = "p" + nid(); await LocalDB.put("photos", pid, blob); e.photo = pid; }
      else e.photo = null;
      await save(); return { photo: e.photo };
    }
    if (method === "POST" && path === "/api/tour") { st.tourDone = !!body.done; await save(); return { ok: true }; }
    if (method === "POST" && path === "/api/custom") {
      if (!body.name) err("Falta el nombre.");
      const id = "c_" + nid(); st.custom.push({ id, n: String(body.name).slice(0, 60), a: body.allergen || "" }); await save(); return { id };
    }
    if (method === "POST" && path === "/api/shopping") {
      const have = new Set(st.shopping.filter(i => !i.done).map(i => i.text.toLowerCase()));
      let added = 0;
      for (const t of (body.items || []).map(s => String(s).trim()).filter(Boolean)) { if (have.has(t.toLowerCase())) continue; st.shopping.push({ id: nid(), text: t.slice(0, 100), done: false }); have.add(t.toLowerCase()); added++; }
      if (added) await save(); return { added };
    }
    if ((x = m(/^\/api\/shopping\/([^/]+)$/))) {
      if (method === "PUT") { const i = st.shopping.find(y => y.id === x[1]); if (i) i.done = !!body.done; }
      else st.shopping = st.shopping.filter(y => y.id !== x[1]);
      await save(); return { ok: true };
    }
    if (method === "POST" && path === "/api/shopping-clear") { st.shopping = st.shopping.filter(i => !i.done); await save(); return { ok: true }; }
    err("No disponible en esta versión.", 404);
  }

  /* fotos: URL temporal a partir del archivo guardado */
  const urls = {};
  async function photoURL(id) {
    if (urls[id]) return urls[id];
    const b = await LocalDB.get("photos", id).catch(() => null);
    if (!b) return "";
    return (urls[id] = URL.createObjectURL(b));
  }

  /* copia de seguridad: un .json con todo, fotos incluidas */
  const toDataURL = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  async function exportBackup() {
    await load();
    const photos = {};
    for (const e of st.entries) if (e.photo) { const b = await LocalDB.get("photos", e.photo).catch(() => null); if (b) photos[e.photo] = await toDataURL(b); }
    st.lastBackup = new Date().toISOString().slice(0, 10); await save();
    return new Blob([JSON.stringify({ app: "primeros-bocados", version: 1, date: st.lastBackup, state: st, photos })], { type: "application/json" });
  }
  async function importBackup(file) {
    const data = JSON.parse(await file.text());
    if (data.app !== "primeros-bocados" || !data.state) err("Este archivo no es una copia de Primeros Bocados.");
    await LocalDB.clear("photos");
    for (const [id, du] of Object.entries(data.photos || {})) { const b = await (await fetch(du)).blob(); await LocalDB.put("photos", id, b); }
    st = data.state; st.rev = (st.rev || 0) + 1;
    await LocalDB.put("kv", "state", st);
  }
  return { handle, photoURL, exportBackup, importBackup, load, get state() { return st; } };
})();

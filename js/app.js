/* ============================================================
   app.js — EasyMart shared logic
   Loaded on every page. Depends on data.js (DATA_* arrays).
   All localStorage keys prefixed em_.
   ============================================================ */

/* ============================================================
   DATA SOURCE — replace this section with Supabase queries
   when config.js is added. Everything below reads from these.
   ============================================================ */
const DS = {
  categories: () => DATA_CATEGORIES,
  stores:     () => DATA_STORES,
  products:   () => DATA_PRODUCTS,
  users:      () => DATA_USERS,
  orders:     () => readOrUseSeed("em_orders", DATA_ORDERS),
  ads:        () => readOrUseSeed("em_ads",    DATA_ADVERTISEMENTS),
  coins:      () => readOrUseSeed("em_coins",  DATA_COINS),
  audit:      () => readOrUseSeed("em_audit",  DATA_AUDIT_LOGS),
  analytics:  () => DATA_ANALYTICS
};
function readOrUseSeed(key, seed) {
  try { const v = localStorage.getItem(key); if (v) return JSON.parse(v); } catch (e) {}
  return seed.slice();
}
function writeStore(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} }
/* ============================================================ */

/* ----------- Helpers ----------- */
const $  = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
const fmtBDT = n => "৳" + Math.round(Number(n) || 0).toLocaleString("en-BD");
const fmtNum = n => Number(n || 0).toLocaleString("en-BD");
const escHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = iso => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const fmtDateTime = iso => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};
const todayStr = () => new Date().toISOString().slice(0, 10);
const uniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

/* compute price after discount */
function priceAfter(price, discount) {
  return Math.round((Number(price) || 0) * (100 - (Number(discount) || 0)) / 100);
}

/* ============================================================
   AUTH
   ============================================================ */
const AUTH_KEY = "em_user";
function getCurrentUser() {
  try { const u = localStorage.getItem(AUTH_KEY); return u ? JSON.parse(u) : null; } catch (e) { return null; }
}
function login(email, password, type) {
  const user = DATA_USERS.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === password && (!type || u.type === type));
  if (!user) return { ok: false, error: "Invalid email, password, or role." };
  const safe = { ...user }; delete safe.password;
  // Top up freshly-tracked customer coins from DATA_COINS (last balance)
  if (safe.type === "customer") {
    const last = DS.coins().filter(c => c.customer_id === safe.id).sort((a,b) => new Date(b.date) - new Date(a.date))[0];
    if (last) safe.coins = last.balance;
    safe.tier = computeTier(safe.coins || 0);
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(safe));
  appendAuditLog({ action: "LOGIN", entity: "users", entity_id: safe.id, description: `${safe.type} logged in: ${safe.name}` });
  // Daily login bonus check (customer only)
  if (safe.type === "customer") grantDailyLoginBonus(safe.id);
  return { ok: true, user: safe };
}
function logout() {
  const u = getCurrentUser();
  if (u) appendAuditLog({ action: "LOGOUT", entity: "users", entity_id: u.id, description: `${u.type} logged out: ${u.name}` });
  // Supabase mode: also sign out of the auth session
  if (window.DB?.isSupabase && window.DB?.write?.signOut) {
    window.DB.write.signOut().catch(() => {});
  }
  localStorage.removeItem(AUTH_KEY);
  window.location.href = resolveUrl("pages/login.html");
}
function requireAuth(allowedRoles) {
  const u = getCurrentUser();
  if (!u) { window.location.href = resolveUrl("pages/login.html"); return null; }
  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(u.type)) {
    window.location.href = resolveUrl("pages/dashboard.html");
    return null;
  }
  return u;
}
function updateCurrentUser(patch) {
  const u = getCurrentUser(); if (!u) return null;
  const next = { ...u, ...patch };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  // Supabase write-through (best-effort)
  if (window.DB?.isSupabase && window.DB?.write?.updateUser) {
    // Strip internal fields that don't exist in the DB
    const dbPatch = { ...patch };
    delete dbPatch._uuid; delete dbPatch.password; delete dbPatch.tier;
    window.DB.write.updateUser(u.id, dbPatch).catch(err => console.warn("updateUser failed:", err));
  }
  return next;
}
/* Resolve URLs relative to the easymart/ root.
   Pages live at: /index.html, /pages/x.html, /pages/customer/x.html etc.
   We use document body's data-depth attribute (set per page) to pick prefix. */
function resolveUrl(path) {
  const depth = Number(document.body?.dataset?.depth || 0);
  if (path.startsWith("/")) return path;
  if (depth === 0) return path;                   // index.html
  if (depth === 1) return "../" + path;           // pages/x.html
  if (depth === 2) return "../../" + path;        // pages/role/x.html
  return path;
}

/* ============================================================
   CART (localStorage em_cart)
   structure: [ { product_id, qty, store_id, delivery_type } ]
   ============================================================ */
const CART_KEY = "em_cart";
function cartGet() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e) { return []; } }
function cartSave(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); cartUpdateBadge(); }
function cartAdd(productId, qty = 1) {
  const p = DATA_PRODUCTS.find(x => x.id === productId);
  if (!p) return false;
  const cart = cartGet();
  const existing = cart.find(it => it.product_id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, p.stock);
  } else {
    cart.push({ product_id: productId, qty: Math.min(qty, p.stock), store_id: p.store_id, delivery_type: "Home Delivery" });
  }
  cartSave(cart);
  toast(`Added "${p.name}" to cart`, "success");
  return true;
}
function cartRemove(productId) {
  const cart = cartGet().filter(it => it.product_id !== productId);
  cartSave(cart);
}
function cartUpdate(productId, qty) {
  const cart = cartGet();
  const it = cart.find(i => i.product_id === productId);
  if (!it) return;
  const p = DATA_PRODUCTS.find(x => x.id === productId);
  it.qty = Math.max(1, Math.min(qty, p ? p.stock : qty));
  cartSave(cart);
}
function cartCount() { return cartGet().reduce((s, it) => s + it.qty, 0); }
function cartTotal() {
  return cartGet().reduce((s, it) => {
    const p = DATA_PRODUCTS.find(x => x.id === it.product_id);
    if (!p) return s;
    return s + priceAfter(p.price, p.discount) * it.qty;
  }, 0);
}
function cartClear() { localStorage.removeItem(CART_KEY); cartUpdateBadge(); }
function cartUpdateBadge() {
  const c = cartCount();
  $$(".cart-badge, .js-cart-badge").forEach(el => {
    el.textContent = c;
    el.classList.toggle("is-zero", c === 0);
  });
}

/* ============================================================
   FAVORITES (em_favorites)
   { products: [ids], stores: [ids] }
   ============================================================ */
const FAV_KEY = "em_favorites";
function favsGet() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || { products: [], stores: [] }; } catch(e) { return { products: [], stores: [] }; } }
function favsSave(f) { localStorage.setItem(FAV_KEY, JSON.stringify(f)); }
function favProdToggle(id) {
  const f = favsGet();
  const i = f.products.indexOf(id);
  if (i >= 0) { f.products.splice(i, 1); appendAuditLog({ action: "UPDATE", entity: "favorites", entity_id: id, description: "Removed product from favorites" }); }
  else { f.products.push(id); appendAuditLog({ action: "UPDATE", entity: "favorites", entity_id: id, description: "Added product to favorites" }); }
  favsSave(f); return f.products.includes(id);
}
function favStoreToggle(id) {
  const f = favsGet();
  const i = f.stores.indexOf(id);
  if (i >= 0) { f.stores.splice(i, 1); appendAuditLog({ action: "UPDATE", entity: "favorites", entity_id: id, description: "Removed store from favorites" }); }
  else { f.stores.push(id); appendAuditLog({ action: "UPDATE", entity: "favorites", entity_id: id, description: "Added store to favorites" }); }
  favsSave(f); return f.stores.includes(id);
}
function isProdFav(id) { return favsGet().products.includes(id); }
function isStoreFav(id) { return favsGet().stores.includes(id); }

/* ============================================================
   LOCATION (em_location) + autocomplete from DATA_STORES
   ============================================================ */
const LOC_KEY = "em_location";
function locGet() {
  try { const v = localStorage.getItem(LOC_KEY); if (v) return JSON.parse(v); } catch(e) {}
  // fallback: current user's location, or default
  const u = getCurrentUser();
  if (u && u.upazila) return { division: u.division, district: u.district, upazila: u.upazila, area: u.area };
  return { division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi", area: "Dhanmondi 27" };
}
function locSave(loc) {
  localStorage.setItem(LOC_KEY, JSON.stringify(loc));
  appendAuditLog({ action: "UPDATE", entity: "users", entity_id: getCurrentUser()?.id || "anon", description: `Changed location to ${loc.area}, ${loc.upazila}` });
}
function locSuggestions(field, query) {
  const all = DATA_STORES.map(s => s[field]).filter(Boolean);
  const set = [...new Set(all)];
  if (!query) return set.slice(0, 8);
  const q = query.toLowerCase();
  return set.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
}

/* score-based proximity matching */
function proximityScore(store, loc) {
  const eq = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  if (eq(store.area,     loc.area))     return 1;
  if (eq(store.upazila,  loc.upazila))  return 2;
  if (eq(store.district, loc.district)) return 3;
  if (eq(store.division, loc.division)) return 4;
  return 5;
}
function proximityBadge(score) {
  switch (score) {
    case 1: return { label: "In your area",   cls: "proximity-area" };
    case 2: return { label: "Same upazila",   cls: "proximity-upazila" };
    case 3: return { label: "Same district",  cls: "proximity-district" };
    case 4: return { label: "Same division",  cls: "proximity-division" };
    default: return null;
  }
}
function rankStores(stores, loc) {
  return stores.map(s => ({ ...s, _score: proximityScore(s, loc) }))
    .sort((a, b) => a._score - b._score || (b.rating||0) - (a.rating||0));
}
function rankProducts(products, loc) {
  return products.map(p => {
    const s = DATA_STORES.find(x => x.id === p.store_id);
    return { ...p, _score: s ? proximityScore(s, loc) : 5, _store: s };
  }).sort((a, b) => a._score - b._score || (b.discount||0) - (a.discount||0));
}

/* ============================================================
   COINS / TIER
   ============================================================ */
function computeTier(coins) {
  if (coins >= 1000) return "Platinum";
  if (coins >= 500)  return "Gold";
  if (coins >= 100)  return "Silver";
  return "Bronze";
}
function tierBenefit(tier) {
  return { Bronze: 0, Silver: 2, Gold: 5, Platinum: 10 }[tier] || 0;
}
function tierProgress(coins) {
  const tiers = [{ n:"Bronze", at:0 }, { n:"Silver", at:100 }, { n:"Gold", at:500 }, { n:"Platinum", at:1000 }];
  for (let i = 0; i < tiers.length - 1; i++) {
    if (coins < tiers[i+1].at) {
      const span = tiers[i+1].at - tiers[i].at;
      const pos = coins - tiers[i].at;
      return { current: tiers[i].n, next: tiers[i+1].n, percent: Math.round(pos / span * 100), to_next: tiers[i+1].at - coins };
    }
  }
  return { current: "Platinum", next: null, percent: 100, to_next: 0 };
}
function coinsAppend(customerId, change, action) {
  const log = DS.coins();
  const last = log.filter(c => c.customer_id === customerId).sort((a,b) => new Date(b.date) - new Date(a.date))[0];
  const balance = (last ? last.balance : 0) + change;
  const row = { id: uniqueId(), customer_id: customerId, date: new Date().toISOString(), action, change, balance };
  log.push(row);
  writeStore("em_coins", log);
  // Supabase write-through
  if (window.DB?.isSupabase && window.DB?.write?.insertCoin) {
    window.DB.write.insertCoin({ customer_id: customerId, action, change, balance, date: row.date })
      .catch(err => console.warn("coin insert failed:", err));
  }
  // also update the auth user
  const u = getCurrentUser();
  if (u && u.id === customerId) updateCurrentUser({ coins: balance, tier: computeTier(balance) });
  appendAuditLog({ action: "UPDATE", entity: "coins", entity_id: customerId, description: `${change > 0 ? "Earned" : "Spent"} ${Math.abs(change)} coins — ${action}` });
  return balance;
}
function grantDailyLoginBonus(customerId) {
  const key = "em_daily_" + customerId;
  const last = localStorage.getItem(key);
  if (last === todayStr()) return;
  localStorage.setItem(key, todayStr());
  coinsAppend(customerId, 2, "Daily login bonus");
  toast("+2 coins · Daily login bonus", "success");
}

/* ============================================================
   ADS
   ============================================================ */
function getActiveAds() {
  return DS.ads().filter(a => (a.status || "").toLowerCase() === "active");
}
function getFeaturedTopDeals(loc) {
  const ranked = rankProducts(DATA_PRODUCTS.filter(p => p.discount > 0), loc);
  return ranked.sort((a,b) => (b.discount||0) - (a.discount||0)).slice(0, 12);
}

/* ============================================================
   AUDIT LOG (em_audit)
   ============================================================ */
function appendAuditLog(entry) {
  const u = getCurrentUser() || {};
  const log = DS.audit();
  const row = {
    id: uniqueId(),
    datetime: new Date().toISOString(),
    user_id: entry.user_id ?? u.id ?? "system",
    user_name: entry.user_name ?? u.name ?? "System",
    user_type: entry.user_type ?? u.type ?? "system",
    action: entry.action,
    entity: entry.entity,
    entity_id: entry.entity_id,
    description: entry.description,
    before: entry.before ?? null,
    after:  entry.after  ?? null
  };
  log.unshift(row);
  // cap at 600 entries to avoid runaway storage
  if (log.length > 600) log.length = 600;
  writeStore("em_audit", log);
  // Supabase write-through (best-effort, RLS may reject anonymous)
  if (window.DB?.isSupabase && window.DB?.write?.insertAudit && u.id) {
    const dbRow = { ...row };
    delete dbRow.id; delete dbRow.before; delete dbRow.after;
    // entity_id must be int; if it's a uuid string, skip the FK and stringify in description
    if (typeof dbRow.entity_id === "string" && dbRow.entity_id.length > 12) {
      dbRow.description = `${dbRow.description} (id: ${dbRow.entity_id})`;
      dbRow.entity_id = null;
    }
    window.DB.write.insertAudit(dbRow).catch(err => console.warn("audit insert failed:", err));
  }
}

/* ============================================================
   TOAST
   ============================================================ */
function toast(message, type = "success", title) {
  let host = $(".toast-host");
  if (!host) { host = document.createElement("div"); host.className = "toast-host"; document.body.appendChild(host); }
  const el = document.createElement("div");
  el.className = "toast " + (type === "error" ? "error" : type === "warn" ? "warn" : "");
  const icMap = { success: "✓", error: "!", warn: "⚠" };
  el.innerHTML = `
    <div class="ic" aria-hidden="true">${icMap[type] || "✓"}</div>
    <div class="body">
      ${title ? `<strong>${escHTML(title)}</strong>` : ""}
      <p>${escHTML(message)}</p>
    </div>
    <button class="close" aria-label="Close">&times;</button>`;
  host.appendChild(el);
  const close = () => { el.style.opacity = "0"; el.style.transform = "translateY(10px)"; setTimeout(() => el.remove(), 200); };
  $(".close", el).addEventListener("click", close);
  setTimeout(close, 3500);
}

/* ============================================================
   MODAL helper
   ============================================================ */
function openModal(html, options = {}) {
  let host = $(".modal-backdrop.dynamic");
  if (host) host.remove();
  host = document.createElement("div");
  host.className = "modal-backdrop dynamic";
  host.innerHTML = `<div class="modal ${options.size === "lg" ? "lg" : ""}">${html}</div>`;
  document.body.appendChild(host);
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => host.classList.add("open"));
  const close = () => {
    host.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => host.remove(), 250);
  };
  host.addEventListener("click", e => { if (e.target === host) close(); });
  $$(".modal-close, [data-close]", host).forEach(b => b.addEventListener("click", close));
  return { host, close };
}
function confirmDialog(message, onConfirm, opts = {}) {
  const { host, close } = openModal(`
    <div class="modal-head"><h3>${escHTML(opts.title || "Confirm")}</h3><button class="modal-close" data-close>×</button></div>
    <div class="modal-body"><p>${escHTML(message)}</p></div>
    <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancel</button>
    <button class="btn ${opts.danger ? "btn-danger" : "btn-primary"}" id="confirmYes">${escHTML(opts.confirm || "Confirm")}</button></div>`);
  $("#confirmYes", host).addEventListener("click", () => { close(); onConfirm(); });
}

/* ============================================================
   NAVBAR (public homepage)
   ============================================================ */
function renderPublicNavbar() {
  const u = getCurrentUser();
  const cartC = cartCount();
  const loc = locGet();
  const bar = `
  <div class="navbar"><div class="nav-inner">
    <a href="${resolveUrl("index.html")}" class="brand"><span class="dot"></span><span class="easy">Easy</span><span class="mart">Mart</span></a>
    <div class="nav-search">
      <span class="ic">${svgSearch()}</span>
      <input id="navSearch" type="text" placeholder="Search products, stores, categories…">
    </div>
    <div class="nav-actions">
      <button class="loc-chip js-loc" type="button">
        <span class="pin">${svgPin()}</span><strong>${escHTML(loc.area || "Set location")}</strong><span class="txt muted">·</span><span class="txt muted">${escHTML(loc.upazila || "")}</span>
      </button>
      <a href="${resolveUrl("pages/customer/cart.html")}" class="icon-btn" aria-label="Cart">
        ${svgCart()}<span class="cart-badge${cartC===0?" is-zero":""}">${cartC}</span>
      </a>
      ${themeToggleBtn()}
      ${u ? `<a href="${resolveUrl("pages/dashboard.html")}" class="btn btn-secondary btn-sm">Dashboard</a>` :
            `<a href="${resolveUrl("pages/login.html")}" class="btn btn-ghost btn-sm hide-mobile">Log in</a>
             <a href="${resolveUrl("pages/register.html")}" class="btn btn-primary btn-sm">Sign up</a>`}
    </div>
  </div></div>`;
  return bar;
}
function attachNavbarEvents() {
  $$(".js-loc").forEach(el => el.addEventListener("click", openLocationModal));
  const ns = $("#navSearch");
  if (ns) {
    ns.addEventListener("keydown", e => {
      if (e.key === "Enter" && ns.value.trim()) {
        sessionStorage.setItem("em_search", ns.value.trim());
        window.location.href = resolveUrl("index.html") + "?q=" + encodeURIComponent(ns.value.trim());
      }
    });
  }
}

/* ============================================================
   LOCATION MODAL
   ============================================================ */
function openLocationModal() {
  const loc = locGet();
  const html = `
  <div class="modal-head"><h3>Set your location</h3><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <p class="muted mb-16">Free-text fields with autocomplete from existing stores.</p>
    <div class="stack">
      ${["division", "district", "upazila", "area"].map(f => `
        <div class="field autocomplete">
          <label>${f.charAt(0).toUpperCase() + f.slice(1)}</label>
          <input class="input js-loc-input" data-f="${f}" type="text" value="${escHTML(loc[f] || "")}" autocomplete="off">
          <div class="ac-list" data-for="${f}" hidden></div>
        </div>`).join("")}
      <div class="field">
        <label>Street (optional)</label>
        <input class="input" id="locStreet" type="text" placeholder="House, road, apartment">
      </div>
    </div>
  </div>
  <div class="modal-foot">
    <button class="btn btn-secondary" data-close>Cancel</button>
    <button class="btn btn-primary" id="saveLoc">Save</button>
  </div>`;
  const { host, close } = openModal(html);
  // autocomplete wiring
  $$(".js-loc-input", host).forEach(inp => {
    const list = $(`.ac-list[data-for="${inp.dataset.f}"]`, host);
    const render = () => {
      const ss = locSuggestions(inp.dataset.f, inp.value);
      list.innerHTML = ss.map(s => `<div class="ac-item">${escHTML(s)}</div>`).join("");
      list.hidden = !ss.length;
    };
    inp.addEventListener("focus", render);
    inp.addEventListener("input", render);
    inp.addEventListener("blur", () => setTimeout(() => list.hidden = true, 150));
    list.addEventListener("mousedown", e => {
      const it = e.target.closest(".ac-item"); if (!it) return;
      inp.value = it.textContent;
      list.hidden = true;
    });
  });
  $("#saveLoc", host).addEventListener("click", () => {
    const next = {};
    $$(".js-loc-input", host).forEach(i => next[i.dataset.f] = i.value.trim());
    if (!next.upazila || !next.area) { toast("Please fill upazila and area", "error"); return; }
    locSave(next);
    close();
    toast("Location updated");
    setTimeout(() => window.location.reload(), 400);
  });
}

/* ============================================================
   SIDEBAR — for dashboard pages
   ============================================================ */
const SIDEBAR_LINKS = {
  customer: [
    { href: "dashboard.html",          ic: "🏠", lbl: "Dashboard",     match: ["dashboard"] },
    { href: "customer/cart.html",      ic: "🛒", lbl: "Cart",          match: ["cart"], badge: () => cartCount() },
    { href: "customer/orders.html",    ic: "📦", lbl: "Orders",        match: ["orders"] },
    { href: "customer/favorites.html", ic: "❤️", lbl: "Favorites",     match: ["favorites"] },
    { href: "customer/rewards.html",   ic: "🪙", lbl: "Rewards",       match: ["rewards"] },
    { href: "customer/profile.html",   ic: "👤", lbl: "Profile",       match: ["profile"] }
  ],
  shopkeeper: [
    { href: "dashboard.html",                ic: "🏠", lbl: "Dashboard",       match: ["dashboard"] },
    { href: "shopkeeper/my-shop.html",       ic: "🏪", lbl: "My Shop",         match: ["my-shop"] },
    { href: "shopkeeper/products.html",      ic: "📦", lbl: "Products",        match: ["products"] },
    { href: "shopkeeper/deliveries.html",    ic: "🚚", lbl: "Deliveries",      match: ["deliveries"], badge: () => {
        const u = getCurrentUser(); if (!u) return 0;
        const myStoreIds = u.store_ids || (u.store_id ? [u.store_id] : []);
        return DS.orders().filter(o => myStoreIds.includes(o.store_id) && ["pending","confirmed","preparing","shipped"].includes(String(o.status).toLowerCase())).length;
      } },
    { href: "shopkeeper/analytics.html",     ic: "📊", lbl: "Analytics",       match: ["analytics"] },
    { href: "shopkeeper/advertisements.html",ic: "📢", lbl: "Advertisements",  match: ["advertisements"] },
    { href: "shopkeeper/shop-details.html",  ic: "⚙️", lbl: "Shop Details",    match: ["shop-details"] },
    { href: "shopkeeper/profile.html",       ic: "👤", lbl: "Profile",         match: ["profile"] }
  ],
  admin: [
    { href: "dashboard.html",                ic: "🏠", lbl: "Dashboard",       match: ["dashboard"] },
    { href: "admin/admins.html",             ic: "👑", lbl: "Admins",          match: ["admins"] },
    { href: "admin/shops.html",              ic: "🏪", lbl: "Shops",           match: ["shops"] },
    { href: "admin/analytics.html",          ic: "📊", lbl: "Analytics",       match: ["analytics"] },
    { href: "admin/audit-logs.html",         ic: "📋", lbl: "Audit Logs",      match: ["audit-logs"] },
    { href: "admin/advertisements.html",     ic: "📢", lbl: "Advertisements",  match: ["advertisements"] },
    { href: "admin/profile.html",            ic: "👤", lbl: "Profile",         match: ["profile"] }
  ]
};

function renderSidebar(activeKey) {
  const u = getCurrentUser(); if (!u) return "";
  const links = SIDEBAR_LINKS[u.type] || [];
  const root = resolveUrl("pages/");
  const items = links.map(l => {
    const active = (l.match || []).some(m => m === activeKey);
    const badge = l.badge ? l.badge() : 0;
    return `<a href="${root}${l.href}" class="side-link ${active ? "active" : ""}">
      <span class="ic" aria-hidden="true">${l.ic}</span>${escHTML(l.lbl)}
      ${badge ? `<span class="badge-count">${badge}</span>` : ""}
    </a>`;
  }).join("");
  const roleLabel = u.type === "shopkeeper" ? "SHOPKEEPER" : u.type.toUpperCase();
  return `
    <aside class="sidebar" id="sidebar">
      <a href="${resolveUrl("index.html")}" class="brand"><span class="dot"></span><span class="easy">Easy</span><span class="mart">Mart</span></a>
      <div class="user-card">
        <img src="${escHTML(u.avatar)}" alt="${escHTML(u.name)}" onerror="this.src='https://i.pravatar.cc/200?img=1'">
        <div>
          <strong>${escHTML(u.name)}</strong>
          <span class="role-badge">${roleLabel}</span>
        </div>
      </div>
      ${items}
      <div class="side-divider"></div>
      <a href="javascript:void(0)" class="side-link js-theme-toggle-link" id="sidebarTheme">
        <span class="ic" aria-hidden="true"><span class="theme-emoji-light">🌙</span><span class="theme-emoji-dark">☀️</span></span>
        <span class="theme-label-light">Dark mode</span><span class="theme-label-dark">Light mode</span>
      </a>
      <a href="javascript:void(0)" class="side-link" id="sidebarLogout"><span class="ic">🚪</span>Logout</a>
    </aside>
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>`;
}
function attachSidebarEvents() {
  $("#sidebarLogout")?.addEventListener("click", () => confirmDialog("Are you sure you want to logout?", logout, { confirm: "Logout" }));
  $("#sidebarTheme")?.addEventListener("click", toggleTheme);
  // Note: menu-toggle and backdrop clicks are handled by a single delegated
  // listener in attachGlobalListeners() so they survive repeated calls and work
  // even when the sidebar is injected dynamically after this function runs.
}

/* ============================================================
   PUBLIC FOOTER
   ============================================================ */
function renderFooter() {
  const cats = DATA_CATEGORIES.slice(0, 6).map(c => `<li><a href="${resolveUrl("index.html")}?cat=${c.id}">${escHTML(c.name)}</a></li>`).join("");
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="${resolveUrl("index.html")}"><span class="dot"></span><span class="easy">Easy</span><span class="mart">Mart</span></a>
          <p class="desc">A neighborhood marketplace built around the people, shops, and seasons of Bangladesh — fresh, fast, and yours.</p>
        </div>
        <div>
          <h5>Categories</h5>
          <ul>${cats}</ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="javascript:void(0)">About</a></li>
            <li><a href="javascript:void(0)">Careers</a></li>
            <li><a href="javascript:void(0)">Press</a></li>
            <li><a href="javascript:void(0)">Contact</a></li>
          </ul>
        </div>
        <div>
          <h5>Help</h5>
          <ul>
            <li><a href="javascript:void(0)">Order tracking</a></li>
            <li><a href="javascript:void(0)">Shipping</a></li>
            <li><a href="javascript:void(0)">Returns</a></li>
            <li><a href="javascript:void(0)">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 EasyMart · Built with care in Dhaka</span>
        <div class="socials">
          <a href="javascript:void(0)" aria-label="Facebook">${svgFb()}</a>
          <a href="javascript:void(0)" aria-label="Instagram">${svgIg()}</a>
          <a href="javascript:void(0)" aria-label="Twitter">${svgTw()}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ============================================================
   PRODUCT / STORE / CATEGORY CARD RENDERERS
   ============================================================ */
function productCard(p, opts = {}) {
  const store = DATA_STORES.find(s => s.id === p.store_id);
  const after = priceAfter(p.price, p.discount);
  const fav = isProdFav(p.id);
  const badge = (typeof p._score === "number") ? proximityBadge(p._score) : null;
  const productHref = resolveUrl(`pages/customer/cart.html?add=${p.id}`); // simple placeholder link to cart
  return `<div class="product-card fade-up" data-pid="${p.id}">
    <div class="product-img">
      <img src="${escHTML(p.image)}" alt="${escHTML(p.name)}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'">
      ${p.discount > 0 ? `<span class="discount-badge">−${p.discount}%</span>` : ""}
      ${p.stock < 5 ? `<span class="stock-low">Only ${p.stock} left</span>` : ""}
      <button class="heart-btn ${fav ? "fav" : ""}" type="button" aria-label="Favorite" onclick="onCardFav(this, ${p.id})">${fav ? "♥" : "♡"}</button>
    </div>
    <div class="product-body">
      <span class="product-store">🏪 ${escHTML(store?.name || "")}${badge ? ` <span class="proximity-badge ${badge.cls}" style="margin-left:auto">${badge.label}</span>` : ""}</span>
      <h4 class="product-name">${escHTML(p.name)}</h4>
      <div class="product-price-row">
        <span class="product-price">${fmtBDT(after)}</span>
        ${p.discount > 0 ? `<span class="product-strike">${fmtBDT(p.price)}</span>` : ""}
        <span class="muted" style="font-size:.78rem;margin-left:auto">/ ${escHTML(p.unit)}</span>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary btn-sm" onclick="cartAdd(${p.id})">Add to Cart</button>
      </div>
    </div>
  </div>`;
}
window.onCardFav = function(btn, id) {
  const isNow = favProdToggle(id);
  btn.classList.toggle("fav", isNow);
  btn.textContent = isNow ? "♥" : "♡";
  toast(isNow ? "Added to favorites" : "Removed from favorites");
};

function storeCard(s) {
  const badge = (typeof s._score === "number") ? proximityBadge(s._score) : null;
  const cats = (s.category_ids || []).slice(0, 3).map(cid => {
    const c = DATA_CATEGORIES.find(c => c.id === cid);
    return c ? `<span class="badge badge-gray">${c.icon} ${escHTML(c.name)}</span>` : "";
  }).join("");
  return `<div class="store-card fade-up" data-sid="${s.id}">
    <div class="store-banner">
      <img src="${escHTML(s.image)}" alt="${escHTML(s.name)}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800'">
      ${badge ? `<span class="proximity-badge ${badge.cls}">${badge.label}</span>` : ""}
    </div>
    <div class="store-body">
      <h4 class="store-name">${escHTML(s.name)}</h4>
      <div class="store-meta">
        <span class="rating">★ ${s.rating}</span>
        <span>· ${s.reviews_count || s.reviews || 0} reviews</span>
        <span>· ${escHTML(s.upazila)}</span>
      </div>
      <div class="store-cats">${cats}</div>
      <p class="muted" style="font-size:.85rem;line-height:1.5;margin-top:6px">${escHTML((s.description||"").slice(0, 90))}…</p>
    </div>
  </div>`;
}

function categoryCard(c) {
  return `<a href="${resolveUrl("index.html")}?cat=${c.id}" class="cat-card" style="--cat-color:${c.color};--cat-tint:${c.color}1a">
    <span class="ic">${c.icon}</span><span class="nm">${escHTML(c.name)}</span>
  </a>`;
}

/* ============================================================
   AD SLIDER
   ============================================================ */
function renderSlider(containerEl, ads) {
  if (!containerEl) return;
  if (!ads || !ads.length) {
    ads = [{ banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400", title: "Shop fresh, shop local", store_id: 1, product_id: null }];
  }
  const slidesHtml = ads.map((a, i) => {
    const product = DATA_PRODUCTS.find(p => p.id === a.product_id);
    const store   = DATA_STORES.find(s => s.id === a.store_id);
    const after   = product ? priceAfter(product.price, product.discount) : null;
    return `<div class="slide ${i===0?"active":""}" data-i="${i}">
      <img src="${escHTML(a.banner)}" alt="${escHTML(a.title || product?.name || "")}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400'">
      <div class="slide-overlay">
        <span class="eyebrow">${a.title ? escHTML(a.title) : "Featured deal"}</span>
        <h3>${escHTML(product?.name || a.title || "Featured")}</h3>
        <div class="meta"><span>at <strong>${escHTML(store?.name || "")}</strong></span>${product?.discount ? `<span class="discount-badge">−${product.discount}%</span>` : ""}</div>
        ${product ? `<div class="price">${fmtBDT(after)}${product.discount ? ` <span class="strike">${fmtBDT(product.price)}</span>` : ""}</div>` : ""}
        <div style="margin-top:14px"><button class="btn btn-accent btn-sm" onclick="${product ? `cartAdd(${product.id})` : ""}">Shop Now</button></div>
      </div>
    </div>`;
  }).join("");
  containerEl.innerHTML = `
    <div class="slider" id="slider">
      ${slidesHtml}
      <button class="slider-arrow prev" aria-label="Previous">${svgChevL()}</button>
      <button class="slider-arrow next" aria-label="Next">${svgChevR()}</button>
      <div class="slider-dots">${ads.map((_, i) => `<span class="dot ${i===0?"active":""}" data-i="${i}"></span>`).join("")}</div>
    </div>`;
  const slider = $("#slider", containerEl);
  let i = 0; let timer;
  const slides = $$(".slide", slider); const dots = $$(".dot", slider);
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    dots.forEach((d, k) => d.classList.toggle("active", k === i));
  };
  const start = () => { stop(); timer = setInterval(() => go(i + 1), 4000); };
  const stop  = () => clearInterval(timer);
  $(".prev", slider).addEventListener("click", () => { go(i - 1); start(); });
  $(".next", slider).addEventListener("click", () => { go(i + 1); start(); });
  dots.forEach(d => d.addEventListener("click", () => { go(parseInt(d.dataset.i)); start(); }));
  slider.addEventListener("mouseenter", stop); slider.addEventListener("mouseleave", start);
  // touch
  let xs = 0;
  slider.addEventListener("touchstart", e => xs = e.touches[0].clientX, { passive: true });
  slider.addEventListener("touchend",   e => {
    const dx = e.changedTouches[0].clientX - xs;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); start(); }
  });
  start();
}

/* ============================================================
   SVG ICONS — small inline set so we have no external deps
   ============================================================ */
const svgSearch = () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const svgPin    = () => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-7-7.58-7-13a7 7 0 1 1 14 0c0 5.42-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>`;
const svgCart   = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/><path d="M2.5 3h2l2.7 13.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.5L22 8H6"/></svg>`;
const svgChevL  = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const svgChevR  = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const svgFb = () => `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14V7c0-1 .5-2 2-2h1.5V1.4S15.6 1 14 1c-3.4 0-5.5 2.1-5.5 5.5v3H5v4h3.5V23H14V13.5z"/></svg>`;
const svgIg = () => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`;
const svgTw = () => `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.6-2.4.7.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1A4.1 4.1 0 0 0 11.7 9c0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.5-4.3a4 4 0 0 0 1.3 5.4c-.7 0-1.3-.2-1.8-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8 8.3 8.3 0 0 1-6 1.7 11.6 11.6 0 0 0 6.3 1.8c7.6 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg>`;
const svgMoon = () => `<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const svgSun  = () => `<svg class="sun"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
const themeToggleBtn = (extraClass = "") => `<button class="theme-toggle js-theme-toggle ${extraClass}" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">${svgMoon()}${svgSun()}</button>`;

/* ============================================================
   THEME (light/dark) — token-based, runtime swap, persisted
   ============================================================ */
const THEME_KEY = "em_theme";
function getTheme() {
  try { return localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
  catch (e) { return "light"; }
}
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  // Refresh Chart.js defaults if it's loaded — text/grid colors must adapt
  if (typeof Chart !== "undefined") {
    const dark = theme === "dark";
    Chart.defaults.color       = dark ? "#d1d5db" : "#4b5563";
    Chart.defaults.borderColor = dark ? "#2a322d" : "#e5e7eb";
    if (Chart.defaults.plugins?.tooltip) Chart.defaults.plugins.tooltip.backgroundColor = dark ? "#1f2723" : "#0f1f12";
    // Re-render any existing chart instances if any
    Chart.instances && Object.values(Chart.instances).forEach(c => {
      try {
        c.options.scales = c.options.scales || {};
        ["x", "y"].forEach(ax => {
          if (c.options.scales[ax]?.grid) c.options.scales[ax].grid.color = dark ? "#2a322d" : "#f1f5f1";
        });
        c.update("none");
      } catch (e) {}
    });
  }
  setTimeout(() => root.classList.remove("theme-switching"), 50);
}
function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  applyTheme(next);
}
/* Apply preference immediately so we don't flash light theme before JS runs.
   This block runs at script-load time, BEFORE DOMContentLoaded. */
applyTheme(getTheme());

/* ============================================================
   GLOBAL INIT
   ============================================================ */
function attachGlobalListeners() {
  cartUpdateBadge();
  attachNavbarEvents();
  attachSidebarEvents();
  // Single delegated handler — works no matter when buttons are injected,
  // and never double-binds because it lives on document.
  document.addEventListener("click", e => {
    if (e.target.closest(".js-theme-toggle")) { toggleTheme(); return; }
    if (e.target.closest(".js-menu-toggle")) {
      $("#sidebar")?.classList.toggle("open");
      $("#sidebarBackdrop")?.classList.toggle("open");
      return;
    }
    if (e.target.id === "sidebarBackdrop") {
      $("#sidebar")?.classList.remove("open");
      $("#sidebarBackdrop")?.classList.remove("open");
    }
  });
}
document.addEventListener("DOMContentLoaded", attachGlobalListeners);

/* expose for inline handlers */
window.cartAdd = cartAdd;
window.cartRemove = cartRemove;
window.cartUpdate = cartUpdate;
window.toast = toast;
window.openModal = openModal;
window.confirmDialog = confirmDialog;

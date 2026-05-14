/* ============================================================
   dashboard.js — common dashboard logic for all 3 roles
   ============================================================ */

function dashboardInit() {
  const u = requireAuth();
  if (!u) return;

  // Render shell
  $("#sidebarHost").innerHTML = renderSidebar("dashboard");
  attachSidebarEvents();

  // Greet
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = `${greeting}, ${u.name.split(" ")[0]}`;

  // Slider
  renderSlider($("#dashSlider"), getActiveAds());

  // Per-role content
  if (u.type === "customer")   renderCustomerDashboard(u);
  if (u.type === "shopkeeper") renderShopkeeperDashboard(u);
  if (u.type === "admin")      renderAdminDashboard(u);
}

/* ---------- Customer ---------- */
function renderCustomerDashboard(u) {
  const orders = DS.orders().filter(o => o.customer_id === u.id);
  const recent = orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const favs = favsGet();
  const coins = u.coins || 0;
  const tier = computeTier(coins);

  $("#statCards").innerHTML = `
    <div class="stat-card green fade-up">
      <span class="ic">🪙</span><div class="label">Coin balance</div>
      <div class="value">${fmtNum(coins)}</div>
      <div class="delta up">${tier} member · +${tierBenefit(tier)}% bonus</div>
    </div>
    <div class="stat-card orange fade-up">
      <span class="ic">📦</span><div class="label">Orders placed</div>
      <div class="value">${orders.length}</div>
      <div class="delta up">${orders.filter(o => o.status === "Delivered" || o.status === "delivered").length} delivered</div>
    </div>
    <div class="stat-card blue fade-up">
      <span class="ic">❤️</span><div class="label">Favorite items</div>
      <div class="value">${favs.products.length + favs.stores.length}</div>
      <div class="delta up">${favs.stores.length} stores · ${favs.products.length} products</div>
    </div>
    <div class="stat-card violet fade-up">
      <span class="ic">📍</span><div class="label">Your location</div>
      <div class="value" style="font-size:1.1rem;line-height:1.3">${escHTML(locGet().area || "—")}</div>
      <div class="delta">${escHTML(locGet().upazila || "")}, ${escHTML(locGet().district || "")}</div>
    </div>`;

  $("#sectionA").innerHTML = `
    <h3>Recent orders <a href="${resolveUrl("pages/customer/orders.html")}" class="btn btn-ghost btn-sm">View all →</a></h3>
    ${recent.length ? recent.map(o => {
      const store = DATA_STORES.find(s => s.id === o.store_id);
      const status = String(o.status).toLowerCase();
      const statusBadge = ({delivered:"badge-green", shipped:"badge-blue", preparing:"badge-amber", confirmed:"badge-blue", pending:"badge-orange", cancelled:"badge-red"}[status]) || "badge-gray";
      const itemsLabel = o.items.map(it => {
        const p = DATA_PRODUCTS.find(x => x.id === it.product_id);
        return p ? `${p.name} × ${it.qty}` : `Item × ${it.qty}`;
      }).join(", ");
      return `<div class="order-card" style="margin-bottom:10px;padding:14px 18px">
        <div class="order-head" style="margin-bottom:6px">
          <div class="meta"><strong>${escHTML(store?.name || "")}</strong><div class="id">${o.id} · ${fmtDate(o.date)}</div></div>
          <span class="badge ${statusBadge}">${o.status}</span>
        </div>
        <p class="muted" style="font-size:.85rem;margin-bottom:6px">${escHTML(itemsLabel)}</p>
        <div class="order-foot" style="margin-top:6px"><span class="muted" style="font-size:.85rem">${o.items.length} item${o.items.length>1?"s":""}</span><span class="total">${fmtBDT(o.total)}</span></div>
      </div>`;
    }).join("") : `<div class="empty"><div class="ic">📦</div><h3>No orders yet</h3><p class="muted">Browse the homepage and place your first order.</p>
      <a href="${resolveUrl("index.html")}" class="btn btn-primary mt-16">Start Shopping</a></div>`}`;

  $("#sectionB").innerHTML = `
    <h3>Quick search</h3>
    <div class="hero-search" style="box-shadow:none;border:1px solid var(--border)"><input id="dashSearch" type="text" placeholder="What do you need today?"><button class="btn btn-primary" onclick="onDashSearch()">Search</button></div>
    <div class="mt-24">
      <h3 style="font-size:1rem;margin-bottom:10px">Browse by category</h3>
      <div class="cat-grid" style="grid-template-columns:repeat(6,1fr)">
        ${DATA_CATEGORIES.slice(0, 12).map(categoryCard).join("")}
      </div>
    </div>`;
  window.onDashSearch = () => {
    const v = $("#dashSearch").value.trim();
    if (v) window.location.href = resolveUrl("index.html") + "?q=" + encodeURIComponent(v);
  };
  $("#dashSearch")?.addEventListener("keydown", e => { if (e.key === "Enter") window.onDashSearch(); });
}

/* ---------- Shopkeeper ---------- */
function renderShopkeeperDashboard(u) {
  const myStoreIds = u.store_ids || (u.store_id ? [u.store_id] : []);
  const myStores   = DATA_STORES.filter(s => myStoreIds.includes(s.id));
  const myProducts = DATA_PRODUCTS.filter(p => myStoreIds.includes(p.store_id));
  const myOrders   = DS.orders().filter(o => myStoreIds.includes(o.store_id));
  const today = todayStr();
  const todayOrders = myOrders.filter(o => String(o.date).slice(0, 10) === today);
  const lowStock = myProducts.filter(p => p.stock < 5);
  const weekRevenue = myOrders.slice(0, 30).reduce((s, o) => s + (o.total || 0), 0);

  $("#statCards").innerHTML = `
    <div class="stat-card green fade-up"><span class="ic">📦</span><div class="label">Today's orders</div><div class="value">${todayOrders.length}</div><div class="delta up">${myOrders.length} total</div></div>
    <div class="stat-card orange fade-up"><span class="ic">⚠️</span><div class="label">Low stock alerts</div><div class="value">${lowStock.length}</div><div class="delta">products under 5 units</div></div>
    <div class="stat-card blue fade-up"><span class="ic">🛍️</span><div class="label">Total products</div><div class="value">${myProducts.length}</div><div class="delta up">across ${myStores.length} shop${myStores.length>1?"s":""}</div></div>
    <div class="stat-card violet fade-up"><span class="ic">💰</span><div class="label">This week</div><div class="value">${fmtBDT(weekRevenue)}</div><div class="delta up">+12% vs last week</div></div>`;

  // Low stock & top products
  $("#sectionA").innerHTML = `
    <h3>Stock alerts <a href="${resolveUrl("pages/shopkeeper/products.html")}" class="btn btn-ghost btn-sm">Manage products →</a></h3>
    ${lowStock.length ? `<div class="table-wrap"><table class="table"><thead><tr><th></th><th>Product</th><th>Stock</th><th>Status</th></tr></thead><tbody>
      ${lowStock.slice(0, 6).map(p => `<tr>
        <td><img src="${escHTML(p.image)}" class="thumb" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'"></td>
        <td><strong>${escHTML(p.name)}</strong></td>
        <td><span class="txt-red font-serif" style="font-weight:700">${p.stock}</span> ${escHTML(p.unit)}</td>
        <td><span class="badge ${p.stock===0?"badge-red":"badge-orange"}">${p.stock===0?"Out of stock":"Low stock"}</span></td>
      </tr>`).join("")}
    </tbody></table></div>` : `<div class="empty"><div class="ic">✅</div><h3>All stocked up</h3><p class="muted">No products are low on inventory.</p></div>`}`;

  // Recent orders snapshot
  $("#sectionB").innerHTML = `
    <h3>Recent orders</h3>
    ${myOrders.slice(0, 5).map(o => {
      const cust = DATA_USERS.find(u => u.id === o.customer_id);
      const status = String(o.status).toLowerCase();
      const statusBadge = ({delivered:"badge-green", shipped:"badge-blue", preparing:"badge-amber", confirmed:"badge-blue", pending:"badge-orange", cancelled:"badge-red"}[status]) || "badge-gray";
      return `<div class="order-card" style="padding:14px 18px;margin-bottom:8px">
        <div class="order-head" style="margin-bottom:0">
          <div class="meta"><strong>${escHTML(cust?.name || "Customer")}</strong><div class="id">${o.id} · ${fmtDate(o.date)}</div></div>
          <div style="display:flex;gap:10px;align-items:center">
            <span class="font-serif txt-green" style="font-weight:700">${fmtBDT(o.total)}</span>
            <span class="badge ${statusBadge}">${o.status}</span>
          </div>
        </div>
      </div>`;
    }).join("") || `<p class="muted">No orders yet.</p>`}`;
}

/* ---------- Admin ---------- */
function renderAdminDashboard(u) {
  const allUsers   = DATA_USERS.length;
  const allShops   = DATA_STORES.length;
  const allProds   = DATA_PRODUCTS.length;
  const allOrders  = DS.orders();
  const todayOrders = allOrders.filter(o => String(o.date).slice(0, 10) === todayStr()).length;
  const recentAudit = DS.audit().slice(0, 5);

  // Top performing category — count product references in orders
  const catCount = {};
  allOrders.forEach(o => o.items.forEach(it => {
    const p = DATA_PRODUCTS.find(x => x.id === it.product_id);
    if (p) catCount[p.category_id] = (catCount[p.category_id] || 0) + it.qty;
  }));
  const topCatId = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a])[0];
  const topCat = DATA_CATEGORIES.find(c => c.id === Number(topCatId)) || DATA_CATEGORIES[0];

  $("#statCards").innerHTML = `
    <div class="stat-card green fade-up"><span class="ic">👥</span><div class="label">Total users</div><div class="value">${fmtNum(allUsers + 8420)}</div><div class="delta up">+128 this week</div></div>
    <div class="stat-card orange fade-up"><span class="ic">🏪</span><div class="label">Active shops</div><div class="value">${allShops}</div><div class="delta up">${allShops} active · 0 suspended</div></div>
    <div class="stat-card blue fade-up"><span class="ic">📦</span><div class="label">Products</div><div class="value">${allProds}</div><div class="delta up">across 18 categories</div></div>
    <div class="stat-card violet fade-up"><span class="ic">📅</span><div class="label">Orders today</div><div class="value">${todayOrders}</div><div class="delta up">+8% vs yesterday</div></div>`;

  $("#sectionA").innerHTML = `
    <h3>Recent audit log <a href="${resolveUrl("pages/admin/audit-logs.html")}" class="btn btn-ghost btn-sm">View all →</a></h3>
    <div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>User</th><th>Action</th><th>Description</th></tr></thead><tbody>
      ${recentAudit.map(a => {
        const actionCls = { CREATE:"badge-green", UPDATE:"badge-blue", DELETE:"badge-red", LOGIN:"badge-gray", LOGOUT:"badge-gray", SUSPEND:"badge-orange", APPROVE:"badge-teal" }[a.action] || "badge-gray";
        return `<tr>
          <td><span class="muted" style="font-size:.82rem">${fmtDateTime(a.datetime)}</span></td>
          <td><strong>${escHTML(a.user_name)}</strong><br><span class="muted" style="font-size:.75rem">${escHTML(a.user_type)}</span></td>
          <td><span class="badge ${actionCls}">${a.action}</span></td>
          <td>${escHTML(a.description)}</td>
        </tr>`;
      }).join("")}
    </tbody></table></div>`;

  $("#sectionB").innerHTML = `
    <h3>Top performing category</h3>
    <div class="card card-pad" style="text-align:center;padding:30px 22px">
      <div style="font-size:3.6rem;margin-bottom:6px">${topCat.icon}</div>
      <h2 class="font-serif" style="margin-bottom:6px">${escHTML(topCat.name)}</h2>
      <p class="muted" style="font-size:.88rem">${fmtNum(catCount[topCatId] || 0)} units sold this period</p>
      <a href="${resolveUrl("pages/admin/analytics.html")}" class="btn btn-primary btn-sm mt-16">See full analytics</a>
    </div>`;
}

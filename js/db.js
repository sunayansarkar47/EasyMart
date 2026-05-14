/* ============================================================
   db.js — Supabase bridge layer (no-auth version)
   ------------------------------------------------------------
   Loaded on every page AFTER config.js + data.js + lib/supabase.js
   but BEFORE app.js.

   How it works:
   - If config.js has real credentials, this file loads all data
     from Supabase into the existing DATA_USERS, DATA_STORES,
     DATA_PRODUCTS, etc. arrays at startup. Page code reads from
     those arrays unchanged.
   - Login is a direct SELECT against public.users (email +
     password). No Supabase Auth, no JWT, no session tokens.
   - Mutations write through to Supabase and to the in-memory
     arrays so the UI sees changes immediately.
   - If config.js is unconfigured, this file does nothing and the
     site uses the bundled demo data + localStorage as a fallback.
   ============================================================ */

(function () {
  const cfg = window.EASYMART_CONFIG || {};
  const isConfigured =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes("YOUR_") &&
    !cfg.SUPABASE_ANON_KEY.includes("YOUR_");

  const DB = window.DB = {
    isSupabase: false,
    client: null,
    ready: Promise.resolve()
  };

  if (!isConfigured) {
    console.info("[EasyMart] Running in DEMO mode (data.js + localStorage). Configure config.js to use Supabase.");
    return;
  }

  if (typeof supabase === "undefined" || !supabase.createClient) {
    console.error("[EasyMart] lib/supabase.js failed to load — falling back to demo mode.");
    return;
  }

  const sb = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  DB.isSupabase = true;
  DB.client = sb;
  console.info("[EasyMart] Connected to Supabase:", cfg.SUPABASE_URL);

  /* -------------------------------------------------------------
     Boot loader — fetch every table and replace DATA_* in place
     ------------------------------------------------------------- */
  DB.ready = (async () => {
    try {
      const [cats, stores, prods, ads, users, orders, coins, audit] = await Promise.all([
        sb.from("categories").select("*").order("id"),
        sb.from("stores").select("*").order("id"),
        sb.from("products").select("*").order("id"),
        sb.from("advertisements").select("*").order("id"),
        sb.from("users").select("*").order("id"),
        sb.from("orders").select("*").order("date", { ascending: false }),
        sb.from("coin_transactions").select("*").order("date", { ascending: false }),
        sb.from("audit_logs").select("*").order("datetime", { ascending: false }).limit(500)
      ]);

      if (cats.data)   replaceArray(DATA_CATEGORIES, cats.data);
      if (stores.data) replaceArray(DATA_STORES, stores.data.map(normalizeStore));
      if (prods.data)  replaceArray(DATA_PRODUCTS, prods.data);
      if (ads.data)    replaceArray(DATA_ADVERTISEMENTS, ads.data.map(normalizeAd));
      if (users.data)  replaceArray(DATA_USERS, users.data);
      if (orders.data) replaceArray(DATA_ORDERS, orders.data);
      if (coins.data)  replaceArray(DATA_COINS, coins.data);
      if (audit.data)  replaceArray(DATA_AUDIT_LOGS, audit.data);

      console.info("[EasyMart] Loaded:", {
        categories: DATA_CATEGORIES.length,
        stores:     DATA_STORES.length,
        products:   DATA_PRODUCTS.length,
        users:      DATA_USERS.length,
        orders:     DATA_ORDERS.length,
        ads:        DATA_ADVERTISEMENTS.length
      });
    } catch (e) {
      console.error("[EasyMart] Failed to load from Supabase, falling back to demo data:", e);
      DB.isSupabase = false;
    }
  })();

  /* -------------------------------------------------------------
     Normalizers
     ------------------------------------------------------------- */
  function replaceArray(target, src) {
    target.length = 0;
    src.forEach(row => target.push(row));
  }
  function normalizeStore(s) {
    return { ...s, banner: s.banner || s.image };
  }
  function normalizeAd(a) {
    return { ...a, start: a.start_date, end: a.end_date };
  }

  /* -------------------------------------------------------------
     Refresh helpers — re-fetch a slice
     ------------------------------------------------------------- */
  DB.refreshOrders = async () => {
    const { data } = await sb.from("orders").select("*").order("date", { ascending: false });
    if (data) replaceArray(DATA_ORDERS, data);
  };
  DB.refreshCoins = async () => {
    const { data } = await sb.from("coin_transactions").select("*").order("date", { ascending: false });
    if (data) replaceArray(DATA_COINS, data);
  };
  DB.refreshAudit = async () => {
    const { data } = await sb.from("audit_logs").select("*").order("datetime", { ascending: false }).limit(500);
    if (data) replaceArray(DATA_AUDIT_LOGS, data);
  };
  DB.refreshUsers = async () => {
    const { data } = await sb.from("users").select("*").order("id");
    if (data) replaceArray(DATA_USERS, data);
  };
  DB.refreshProducts = async () => {
    const { data } = await sb.from("products").select("*").order("id");
    if (data) replaceArray(DATA_PRODUCTS, data);
  };
  DB.refreshStores = async () => {
    const { data } = await sb.from("stores").select("*").order("id");
    if (data) replaceArray(DATA_STORES, data.map(normalizeStore));
  };
  DB.refreshAds = async () => {
    const { data } = await sb.from("advertisements").select("*").order("id");
    if (data) replaceArray(DATA_ADVERTISEMENTS, data.map(normalizeAd));
  };

  /* -------------------------------------------------------------
     Write helpers
     ------------------------------------------------------------- */
  DB.write = {
    // ---- Auth (table-based, no Supabase Auth) ----
    async signIn(email, password) {
      const { data, error } = await sb
        .from("users")
        .select("*")
        .ilike("email", email)
        .eq("password", password)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Invalid email or password");
      if (data.status === "inactive" || data.status === "suspended") throw new Error("This account is not active");
      return data;
    },
    async signUp(profile) {
      // profile must include email, password, type, name
      const payload = { ...profile };
      delete payload.id;
      const { data, error } = await sb.from("users").insert(payload).select().single();
      if (error) throw error;
      DATA_USERS.push(data);
      return data;
    },
    async signOut() {
      // No-op — we don't have server-side sessions
    },

    // ---- Orders ----
    async insertOrder(row) {
      const payload = { ...row }; delete payload.id;
      const { data, error } = await sb.from("orders").insert(payload).select().single();
      if (error) throw error;
      DATA_ORDERS.unshift(data);
      return data;
    },
    async updateOrder(id, patch) {
      const { data, error } = await sb.from("orders").update(patch).eq("id", id).select().single();
      if (error) throw error;
      const i = DATA_ORDERS.findIndex(o => o.id === id);
      if (i >= 0) DATA_ORDERS[i] = data;
      return data;
    },

    // ---- Products ----
    async insertProduct(row) {
      const payload = { ...row }; delete payload.id;
      const { data, error } = await sb.from("products").insert(payload).select().single();
      if (error) throw error;
      DATA_PRODUCTS.push(data);
      return data;
    },
    async updateProduct(id, patch) {
      const { data, error } = await sb.from("products").update(patch).eq("id", id).select().single();
      if (error) throw error;
      const i = DATA_PRODUCTS.findIndex(p => p.id === id);
      if (i >= 0) DATA_PRODUCTS[i] = data;
      return data;
    },
    async deleteProduct(id) {
      const { error } = await sb.from("products").delete().eq("id", id);
      if (error) throw error;
      const i = DATA_PRODUCTS.findIndex(p => p.id === id);
      if (i >= 0) DATA_PRODUCTS.splice(i, 1);
    },

    // ---- Stores ----
    async updateStore(id, patch) {
      const { data, error } = await sb.from("stores").update(patch).eq("id", id).select().single();
      if (error) throw error;
      const i = DATA_STORES.findIndex(s => s.id === id);
      if (i >= 0) DATA_STORES[i] = normalizeStore(data);
      return data;
    },

    // ---- Users ----
    async updateUser(id, patch) {
      const { data, error } = await sb.from("users").update(patch).eq("id", id).select().single();
      if (error) throw error;
      const i = DATA_USERS.findIndex(u => u.id === id);
      if (i >= 0) DATA_USERS[i] = data;
      return data;
    },
    async insertAdmin(row) {
      // Just an insert with type='admin' — same as signUp
      return await this.signUp({ ...row, type: "admin" });
    },

    // ---- Ads ----
    async insertAd(row) {
      const payload = { ...row }; delete payload.id;
      if (payload.start) { payload.start_date = payload.start; delete payload.start; }
      if (payload.end)   { payload.end_date = payload.end;   delete payload.end; }
      const { data, error } = await sb.from("advertisements").insert(payload).select().single();
      if (error) throw error;
      DATA_ADVERTISEMENTS.unshift(normalizeAd(data));
      return data;
    },
    async updateAd(id, patch) {
      const p = { ...patch };
      if (p.start) { p.start_date = p.start; delete p.start; }
      if (p.end)   { p.end_date = p.end;   delete p.end; }
      const { data, error } = await sb.from("advertisements").update(p).eq("id", id).select().single();
      if (error) throw error;
      const i = DATA_ADVERTISEMENTS.findIndex(a => a.id === id);
      if (i >= 0) DATA_ADVERTISEMENTS[i] = normalizeAd(data);
      return data;
    },

    // ---- Coins ----
    async insertCoin(row) {
      const payload = { ...row }; delete payload.id;
      const { data, error } = await sb.from("coin_transactions").insert(payload).select().single();
      if (error) throw error;
      DATA_COINS.unshift(data);
      return data;
    },

    // ---- Audit ----
    async insertAudit(row) {
      const payload = { ...row }; delete payload.id;
      // entity_id must be int or null
      if (typeof payload.entity_id === "string" && !/^\d+$/.test(payload.entity_id)) {
        payload.description = `${payload.description} (id: ${payload.entity_id})`;
        payload.entity_id = null;
      }
      const { error } = await sb.from("audit_logs").insert(payload);
      if (error) console.warn("Audit insert failed:", error);
    }
  };

})();

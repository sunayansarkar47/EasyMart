# 🛒 EasyMart

> A neighborhood marketplace for Bangladesh — fresh, local, and delivered.

EasyMart is a complete production-grade marketplace web application built with **plain HTML, CSS, and JavaScript** — no build tooling, no frameworks, no CDNs. It runs offline against bundled demo data, or connects to **Supabase** for a real backend with auth, persistence, and row-level security.

[![No Framework](https://img.shields.io/badge/framework-none-brightgreen)]()
[![No Build Step](https://img.shields.io/badge/build-not_required-blue)]()
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey)]()

---

## ✨ Features

### Three roles, one app
- **Customer** — browse 18 categories, 60+ products from 16 local shops; cart with per-store delivery options; place orders; earn and redeem coins; rate orders; manage favorites and saved addresses
- **Shopkeeper** — manage shop profile, banner, hours, and categories; full product CRUD with stock controls; **manage incoming deliveries through the full order workflow (pending → confirmed → preparing → shipped → delivered)**; create and pause advertisements; view analytics with charts; multi-shop support
- **Admin** — moderate shops (suspend/reactivate); manage admin team; curate the homepage top-deals slider; pause any shopkeeper's ad; immutable audit log with filters and CSV export; platform-wide analytics

### Built for the user
- **Light & dark themes** with CSS-variable-driven palette; preference persists
- **Fully responsive** from 375 px phones to 1920 px desktops; mobile sidebar with hamburger toggle
- **Location-aware** — products and shops ranked by proximity (your area → upazila → district → division)
- **Coin loyalty system** with Bronze/Silver/Gold/Platinum tiers
- **Audit log** records every meaningful action across the platform

### Built for developers
- **Zero dependencies** at runtime — all libraries live in `lib/` (Chart.js, Supabase, fonts)
- **Hybrid data layer** — runs against bundled demo data out-of-the-box; connect Supabase by editing `config.js`
- **Idempotent SQL schema** with row-level security policies and seed data that mirrors the demo data exactly
- **No build step** — open `index.html` through Live Server or any static HTTP server

---

## 🧰 Tech stack

| Layer | Technology |
|------|-----------|
| Markup | HTML5 |
| Styling | CSS variables, custom design system (no Tailwind, no PostCSS) |
| Scripting | Vanilla JavaScript (ES2022) — no React, Vue, or compiled language |
| Charts | [Chart.js](https://www.chartjs.org) (bundled at `lib/chart.min.js`) |
| Fonts | [Sora](https://fonts.google.com/specimen/Sora) + [Fraunces](https://fonts.google.com/specimen/Fraunces) (self-hosted woff2) |
| Backend | [Supabase](https://supabase.com) — PostgreSQL + Auth + RLS (optional) |
| Hosting | Anything that serves static files (Netlify, Vercel, GitHub Pages, S3, …) |

---

## 📸 Screenshots

> 📷 _Screenshots go here — homepage, customer cart, shopkeeper dashboard, admin analytics. Drop them in `docs/screenshots/` and link to them below._

```
docs/screenshots/
  ├─ homepage.png
  ├─ customer-dashboard.png
  ├─ shopkeeper-products.png
  ├─ admin-analytics.png
  └─ dark-theme.png
```

---

## 🚀 Quick start

### Option A — Demo mode (no setup, runs offline)

1. Clone or download this repository
2. Open the project folder in **VS Code**
3. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension if you haven't already
4. Right-click `index.html` → **Open with Live Server**
5. Browse to the login page and sign in with one of the demo accounts below

That's it. No npm install, no environment variables, no compilation.

### Option B — Supabase mode (real backend, persists across devices)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier works)
2. **Get your credentials** — Project Settings → API → copy the **Project URL** and **anon / public key**
3. **Edit `config.js`** in the project root and paste the values:
   ```javascript
   window.EASYMART_CONFIG = {
     SUPABASE_URL:      "https://your-project.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGc..."
   };
   ```
4. **Run the schema** — open the Supabase SQL Editor, paste the contents of `schema.sql`, click **Run**. This creates all 8 tables and seeds the database with the same demo data the offline mode uses (including the 8 demo accounts with password `merciful`).
5. **Reload the page** — the homepage now reads from Supabase. Sign in with the demo accounts (below) or register new ones from the website.

When `config.js` still contains the placeholder strings, the site automatically falls back to demo mode — so you can develop offline and switch to Supabase whenever you're ready by editing one file.

> ⚠️ **Note for production:** this setup stores passwords as plain text in `public.users` and disables Row Level Security on all tables, on purpose, to keep the demo setup as simple as possible. In a real production system you would use Supabase Auth (`supabase.auth.signUp` / `signInWithPassword`) and re-enable RLS with proper per-role policies. See `TODO.md` for the migration path.

---

## 🔑 Demo accounts

All demo accounts use the password **`merciful`** (in both demo mode and Supabase mode).

| Role | Email | Notes |
|------|-------|-------|
| Customer | `ayesha@example.com` | Silver tier, 340 coins, 4 orders |
| Customer | `tanvir@example.com` | Bronze tier, 60 coins |
| Customer | `nazia@example.com` | Gold tier, 540 coins |
| Shopkeeper | `mizan@sobji.com` | Owns Sobji Bazar Fresh (Dhanmondi) |
| Shopkeeper | `sadia@bananibake.com` | Owns Banani Bake & Brew |
| Shopkeeper | `rafiq@gulshanmart.com` | Owns Gulshan Daily Mart |
| Admin | `imran@easymart.com` | Super Admin |
| Admin | `sara@easymart.com` | Moderator |

---

## 📁 Project structure

```
easymart/
├── index.html                     # Public homepage
├── config.js                      # Supabase credentials (placeholders by default)
├── schema.sql                     # Run once in Supabase SQL Editor
├── README.md
├── TODO.md
│
├── css/
│   └── style.css                  # Single ~1000-line stylesheet (light + dark)
│
├── js/
│   ├── data.js                    # Bundled demo data (categories, stores, etc.)
│   ├── db.js                      # Supabase bridge — loads data into DATA_* arrays
│   ├── app.js                     # Shared logic: auth, cart, location, audit, helpers
│   ├── dashboard.js               # Per-role dashboard renderer
│   └── charts.js                  # Chart.js helper wrappers
│
├── lib/
│   ├── chart.min.js               # Chart.js (208 KB, bundled — no CDN)
│   ├── supabase.js                # Supabase JS client (bundled)
│   └── fonts/                     # Sora + Fraunces woff2 files
│
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html             # Role-aware shell (customer / shopkeeper / admin)
    │
    ├── customer/
    │   ├── cart.html
    │   ├── orders.html
    │   ├── favorites.html
    │   ├── rewards.html
    │   └── profile.html
    │
    ├── shopkeeper/
    │   ├── my-shop.html
    │   ├── products.html
    │   ├── deliveries.html          # Order management — status workflow
    │   ├── analytics.html
    │   ├── advertisements.html
    │   ├── shop-details.html
    │   └── profile.html
    │
    └── admin/
        ├── admins.html
        ├── shops.html
        ├── analytics.html
        ├── audit-logs.html
        ├── advertisements.html
        └── profile.html
```

---

## 🗄️ Database schema

When connected to Supabase, EasyMart uses 8 tables under the `public` schema:

| Table | Purpose |
|-------|---------|
| `categories` | 18 product categories (icon, color, name) |
| `users` | Profile rows linked to `auth.users` by UUID |
| `stores` | 16 shops with location, hours, owner |
| `products` | Per-store catalog with stock and discount |
| `orders` | Customer orders with JSONB items array |
| `advertisements` | Shopkeeper-created ads with admin curation flag |
| `coin_transactions` | Audit trail of every coin earn/redeem |
| `audit_logs` | Immutable platform-wide action log |

**Row-level security** policies are defined in `schema.sql`. Highlights:
- Categories: anyone reads, only admins write
- Stores: anyone reads, only the owner (or an admin) updates
- Products: anyone reads, only the store owner (or an admin) writes
- Orders: customer reads/inserts their own; shopkeepers read orders for their stores; admins all
- Audit logs: any user can insert their own row; only admins read

Two SQL helper functions back the policies: `is_admin()` and `owns_store(int)`.

---

## 🛠️ Development

### Running locally
- **VS Code Live Server** — easiest, with hot reload
- **Python** — `python3 -m http.server 8000`
- **Node** — `npx serve`

Open `http://localhost:<port>/index.html`. Always start at the root, not deep inside `pages/`.

### Editing demo data
Open `js/data.js`, modify any array, save, reload. Every page sees the change.

To regenerate the SQL seed from `data.js`, run the script in `tools/gen-seeds.js` (not included by default — see [TODO.md](TODO.md)).

### Adding a page
1. Create a new HTML file under `pages/<role>/`
2. Set `<body data-depth="2">`
3. Include the standard scripts in this order:
   ```html
   <script src="../../config.js"></script>
   <script src="../../js/data.js"></script>
   <script src="../../lib/supabase.js"></script>
   <script src="../../js/db.js"></script>
   <script src="../../js/app.js"></script>
   ```
4. Add the page to `SIDEBAR_LINKS` in `js/app.js` if it should appear in the sidebar

### Theming
Every color reads from a CSS variable in `css/style.css` under `:root` (light) and `html[data-theme="dark"]` (dark). To rebrand, edit those two blocks.

---

## 🧪 Testing

The site has been smoke-tested across all 22 pages with jsdom — every page loads with zero JavaScript errors in both demo and Supabase modes (where Supabase calls fail gracefully without breaking the page).

Manual test paths:
1. **Customer flow** — log in → browse → add to cart → checkout → orders → cancel → review → rewards
2. **Shopkeeper flow** — log in → my shop → add product → update stock → create ad → analytics
3. **Admin flow** — log in → suspend a shop → add an admin → curate top deals → audit logs → CSV export

---

## 🤝 Contributing

Contributions welcome. Please:
1. Open an issue describing the change you want to make
2. Fork the repo and create a feature branch
3. Keep the no-build, no-framework constraint — vanilla JS only
4. Test your changes in both demo mode (without `config.js` configured) and Supabase mode
5. Submit a PR with a clear description

---

## 📋 What's next

See [TODO.md](TODO.md) for the roadmap.

---

## 📄 License

MIT — see `LICENSE` (add your own when forking).

---

> Built with care in Dhaka 🇧🇩

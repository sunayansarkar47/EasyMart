# 📋 TODO

A living list of known limitations, planned features, and "nice-to-haves" for EasyMart.

## 🔥 High priority (production migration)

The current setup is optimized for a university demo: passwords are plain text in `public.users`, RLS is disabled, and there is no email confirmation flow. To take this to production, do the following:

- [ ] **Switch to Supabase Auth.** Replace the `password` column in `public.users` with a UUID link to `auth.users`. Replace `DB.write.signIn` / `signUp` with `supabase.auth.signInWithPassword` / `signUp`. Add a `pages/auth-callback.html` to receive the magic-link confirmation redirect.
- [ ] **Re-enable Row Level Security** with proper policies. Helper functions `is_admin()` and `owns_store(int)` are still useful — they were in an earlier version of `schema.sql`. See git history.
- [ ] **Email confirmation flow.** Add proper UI: "Check your email to confirm your account before logging in."
- [ ] **Forgot password.** Add `pages/reset-password.html` and use `supabase.auth.resetPasswordForEmail`.
- [ ] **Remove plain-text password handling** everywhere. The `DATA_USERS` array shouldn't contain the `password` field once Supabase Auth owns it.

## 🚧 Medium priority

- [ ] **Real-time subscriptions.** When a customer places an order, the shopkeeper's deliveries page should update without a reload. Use `supabase.channel(...).on("postgres_changes", ...)`.
- [ ] **Image storage in Supabase.** Avatar uploads, product images, and shop banners are currently stored as base64 strings in the database. Move to **Supabase Storage** with signed URLs.
- [ ] **Pagination for products and orders.** Currently every row is loaded at startup. Fine with ~100 rows, not with 10,000. Use `range(start, end)` with infinite scroll or numbered pages.
- [ ] **Search optimization.** Homepage search currently filters in the browser. Move to Supabase full-text search.
- [ ] **Email notifications.** Hook into Supabase Edge Functions for order status changes, low stock, etc.

## 🌱 Nice-to-have

- [ ] **Customer reviews surfaced on shop pages.** Average rating shows but the actual review text doesn't appear anywhere. Add a "Reviews" tab.
- [ ] **Shop following / new-stores notifications.** The "New stores nearby" toggle exists in the profile but doesn't actually notify yet.
- [ ] **Coupon system.** Currently `SAVE10` is hardcoded. Add a `coupons` table.
- [ ] **Coin redemption credit applied at checkout.** Tracked but not actually deducted from the total.
- [ ] **Multi-language support.** Add a Bangla toggle. Extract texts into `js/i18n.js`.
- [ ] **PWA install prompt.** Add `manifest.json` and a service worker.
- [ ] **Accessibility audit.** Run axe-core or Lighthouse and fix any issues.
- [ ] **Print-friendly invoice.** Allow customers to print order receipts.

## 🐞 Known limitations

- **Password is stored as plain text** in `public.users.password`. This is the entire point of the simplified setup — fine for a demo, **not** for anything real.
- **Anyone with the anon key can read/write all tables.** RLS is disabled. In production, you'd re-enable it.
- **Audit log `entity_id` must be int or null.** If a UUID string is passed, the helper strips it and embeds it in the description text.
- **Top-deals selection is stored per-ad row** (the `featured_in_top_deals` column). Admin "publish" updates many rows in parallel.

## ✅ Recently completed

- ✅ Simplified to no-auth setup with `password` column in `public.users` — works on any Supabase project with zero auth configuration
- ✅ Password change flow on all 3 profile pages (customer, shopkeeper, admin) — verifies current password against DB then updates
- ✅ Shopkeeper Deliveries page with full status workflow (pending → confirmed → preparing → shipped → delivered, plus cancel)
- ✅ Hybrid demo / Supabase data layer
- ✅ Idempotent SQL schema with seed data
- ✅ Demo accounts share password `merciful` across both demo and Supabase modes
- ✅ Dark theme via CSS variables
- ✅ Mobile-responsive layout (320 px → 1920 px)
- ✅ Shopkeeper profile page (parity with customer/admin)
- ✅ Email-only login (role detected from user record)
- ✅ "Back to homepage" links on login and register pages
- ✅ Customer cancel order bug fixed (string vs number id comparison)

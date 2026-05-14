-- ============================================================
-- EasyMart — Supabase schema (simplified, no auth)
-- ============================================================
-- Paste this into Supabase SQL Editor and run.  Idempotent.
--
-- This version does NOT use Supabase Auth.  Passwords live as a
-- plain TEXT column in public.users.  RLS is disabled so any
-- request from the anon key can read and write all tables.
--
-- This is intentional for a university demo: it makes setup
-- trivial and removes failure modes around email confirmations
-- and JWT sessions.  Do not use this approach in production —
-- passwords should never sit in a profile table.
-- ============================================================

-- ============================================================
-- 1.  TABLES
-- ============================================================

-- 1a. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  icon   TEXT,
  color  TEXT
);

-- 1b. Users (with password column — plaintext, demo only)
CREATE TABLE IF NOT EXISTS public.users (
  id             SERIAL PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('customer','shopkeeper','admin')),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password       TEXT NOT NULL,
  phone          TEXT,
  avatar         TEXT,
  division       TEXT,
  district       TEXT,
  upazila        TEXT,
  area           TEXT,
  store_ids      INT[],
  addresses      JSONB,
  notifications  JSONB DEFAULT '{"orders":true,"promotions":true,"nearby":false}'::jsonb,
  role_level     TEXT,
  status         TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  coins          INT DEFAULT 0,
  tier           TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_type ON public.users(type);

-- 1c. Stores
CREATE TABLE IF NOT EXISTS public.stores (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  category_ids    INT[] NOT NULL DEFAULT '{}',
  owner_id        INT REFERENCES public.users(id) ON DELETE SET NULL,
  division        TEXT,
  district        TEXT,
  upazila         TEXT,
  area            TEXT,
  street          TEXT,
  hours           TEXT,
  phone           TEXT,
  rating          NUMERIC(2,1) DEFAULT 0,
  reviews_count   INT DEFAULT 0,
  description     TEXT,
  image           TEXT,
  banner          TEXT,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stores_owner  ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);

-- 1d. Products
CREATE TABLE IF NOT EXISTS public.products (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  category_id  INT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  store_id     INT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  price        NUMERIC(10,2) NOT NULL,
  discount     INT DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  stock        INT DEFAULT 0,
  unit         TEXT,
  description  TEXT,
  image        TEXT,
  available    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_store    ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- 1e. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id              SERIAL PRIMARY KEY,
  customer_id     INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_id        INT NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
  date            TIMESTAMPTZ DEFAULT now(),
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','shipped','delivered','cancelled')),
  items           JSONB NOT NULL,
  subtotal        NUMERIC(10,2) DEFAULT 0,
  delivery_fee    NUMERIC(10,2) DEFAULT 0,
  coupon          NUMERIC(10,2) DEFAULT 0,
  coins_redeemed  INT DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  delivery_type   TEXT DEFAULT 'Home Delivery',
  review          JSONB
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_store    ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON public.orders(status);

-- 1f. Advertisements
CREATE TABLE IF NOT EXISTS public.advertisements (
  id                     SERIAL PRIMARY KEY,
  store_id               INT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id             INT REFERENCES public.products(id) ON DELETE SET NULL,
  title                  TEXT,
  banner                 TEXT,
  status                 TEXT DEFAULT 'active' CHECK (status IN ('active','paused','expired')),
  views                  INT DEFAULT 0,
  clicks                 INT DEFAULT 0,
  start_date             DATE,
  end_date               DATE,
  created_by             INT REFERENCES public.users(id) ON DELETE SET NULL,
  featured_in_top_deals  BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ads_store  ON public.advertisements(store_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON public.advertisements(status);

-- 1g. Coin transactions
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id          SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        TIMESTAMPTZ DEFAULT now(),
  action      TEXT NOT NULL,
  change      INT NOT NULL,
  balance     INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_coins_customer ON public.coin_transactions(customer_id);

-- 1h. Audit log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          SERIAL PRIMARY KEY,
  datetime    TIMESTAMPTZ DEFAULT now(),
  user_id     INT REFERENCES public.users(id) ON DELETE SET NULL,
  user_name   TEXT,
  user_type   TEXT,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   INT,
  description TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_datetime ON public.audit_logs(datetime DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user     ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action   ON public.audit_logs(action);


-- ============================================================
-- 2.  ROW LEVEL SECURITY — DISABLED for this demo
-- ============================================================
-- We explicitly disable RLS so the anon key can read and write
-- every table.  In production you'd enable RLS and write policies
-- per role, but for a university demo this keeps things simple
-- and matches the demo-mode behavior (no per-row gating).
ALTER TABLE public.categories         DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements     DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs         DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- 3.  SEED DATA  — mirrors js/data.js
-- ============================================================

-- 3a. Categories
INSERT INTO public.categories (id, name, icon, color) VALUES (1, 'Fruits & Vegetables', '🥦', '#16a34a') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (2, 'Grocery & Staples', '🌾', '#d97706') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (3, 'Dairy & Eggs', '🥛', '#0ea5e9') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (4, 'Meat & Fish', '🐟', '#dc2626') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (5, 'Bakery & Bread', '🍞', '#b45309') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (6, 'Cold Drinks & Juice', '🥤', '#2563eb') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (7, 'Coffee, Tea & Boba', '☕', '#78350f') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (8, 'Ice Cream & Desserts', '🍦', '#db2777') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (9, 'Fast Food & Snacks', '🍔', '#ea580c') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (10, 'Sweets & Confectionery', '🍬', '#c026d3') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (11, 'Beauty & Skincare', '💄', '#e11d48') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (12, 'Personal Hygiene', '🧴', '#0891b2') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (13, 'Cleaning & Household', '🧹', '#7c3aed') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (14, 'Cooking & Spices', '🌶️', '#dc2626') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (15, 'Baby Care', '👶', '#f472b6') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (16, 'Pharmacy & Health', '💊', '#059669') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (17, 'Pet Supplies', '🐾', '#92400e') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color) VALUES (18, 'Stationery & Office', '✏️', '#475569') ON CONFLICT (id) DO NOTHING;
SELECT setval('categories_id_seq', GREATEST((SELECT MAX(id) FROM public.categories), 1));

-- 3b. Users (password = 'merciful' for all demo accounts)
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (101, 'customer', 'Ayesha Rahman', 'ayesha@example.com', 'merciful', '+880 1811-100001', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 'Dhaka', 'Dhaka', 'Dhanmondi', 'Dhanmondi 27', NULL, '[{"id":1,"label":"Home","division":"Dhaka","district":"Dhaka","upazila":"Dhanmondi","area":"Dhanmondi 27","street":"Road 27, House 14, Apt 3B","default":true},{"id":2,"label":"Office","division":"Dhaka","district":"Dhaka","upazila":"Tejgaon","area":"Gulshan Link Road","street":"Plot 9, Floor 4","default":false}]'::jsonb, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, NULL, 'active', 340, 'Silver') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (102, 'customer', 'Tanvir Hossain', 'tanvir@example.com', 'merciful', '+880 1811-100002', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80', 'Dhaka', 'Dhaka', 'Mirpur', 'Mirpur 10', NULL, '[{"id":1,"label":"Home","division":"Dhaka","district":"Dhaka","upazila":"Mirpur","area":"Mirpur 10","street":"Sec 10, Block C, Road 4","default":true}]'::jsonb, '{"orders":true,"promotions":false,"nearby":true}'::jsonb, NULL, 'active', 1240, 'Platinum') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (103, 'customer', 'Nazia Karim', 'nazia@example.com', 'merciful', '+880 1811-100003', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 'Dhaka', 'Dhaka', 'Gulshan', 'Gulshan 2', NULL, '[{"id":1,"label":"Home","division":"Dhaka","district":"Dhaka","upazila":"Gulshan","area":"Gulshan 2","street":"Road 113, Plot 6, Apt 7A","default":true}]'::jsonb, '{"orders":true,"promotions":true,"nearby":true}'::jsonb, NULL, 'active', 75, 'Bronze') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (201, 'shopkeeper', 'Mizanur Rahman', 'mizan@sobji.com', 'merciful', '+880 1711-234567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', NULL, NULL, NULL, NULL, ARRAY[1]::INT[], NULL, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, NULL, 'active', 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (202, 'shopkeeper', 'Sadia Akter', 'sadia@bananibake.com', 'merciful', '+880 1712-345678', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', NULL, NULL, NULL, NULL, ARRAY[2]::INT[], NULL, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, NULL, 'active', 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (203, 'shopkeeper', 'Rafiq Ahmed', 'rafiq@gulshanmart.com', 'merciful', '+880 1713-456789', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', NULL, NULL, NULL, NULL, ARRAY[3]::INT[], NULL, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, NULL, 'active', 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (301, 'admin', 'Imran Hossain', 'imran@easymart.com', 'merciful', '+880 1900-000001', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', NULL, NULL, NULL, NULL, NULL, NULL, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, 'Super Admin', 'active', 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, type, name, email, password, phone, avatar, division, district, upazila, area, store_ids, addresses, notifications, role_level, status, coins, tier) VALUES (302, 'admin', 'Sara Iqbal', 'sara@easymart.com', 'merciful', '+880 1900-000002', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', NULL, NULL, NULL, NULL, NULL, NULL, '{"orders":true,"promotions":true,"nearby":false}'::jsonb, 'Moderator', 'active', 0, NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM public.users), 400));

-- 3c. Stores
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (1, 'Sobji Bazar Fresh', ARRAY[1,2,14]::INT[], 201, 'Dhaka', 'Dhaka', 'Dhanmondi', 'Dhanmondi 27', 'Road 27, House 14', '7:00 AM – 10:00 PM', '+880 1711-234567', 4.7, 312, 'Family-run produce shop sourcing daily from Karwan Bazar. Crisp greens, seasonal fruit, whole grains.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (2, 'Banani Bake House', ARRAY[5,7,10]::INT[], 202, 'Dhaka', 'Dhaka', 'Banani', 'Banani 11', 'Road 11, Block F', '6:30 AM – 11:00 PM', '+880 1712-345678', 4.8, 528, 'Sourdough, croissants, hand-pulled coffee. Slow bakery with stone-ground flour.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (3, 'Gulshan Daily Mart', ARRAY[2,3,13]::INT[], 203, 'Dhaka', 'Dhaka', 'Gulshan', 'Gulshan 2', 'Road 113, Plot 6', '24 hours', '+880 1713-456789', 4.5, 891, 'Round-the-clock supermarket. Pantry, dairy, household — restocked nightly.', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (4, 'Mirpur Meat & Fish Co.', ARRAY[4]::INT[], NULL, 'Dhaka', 'Dhaka', 'Mirpur', 'Mirpur 10', 'Sec 10, Block C', '6:00 AM – 9:00 PM', '+880 1714-567890', 4.4, 207, 'Halal butcher and live fish counter. Cut to order, vacuum-packed for delivery.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (5, 'Uttara Beauty Lounge', ARRAY[11,12]::INT[], NULL, 'Dhaka', 'Dhaka', 'Uttara', 'Uttara Sector 7', 'Road 17, House 8', '10:00 AM – 9:00 PM', '+880 1715-678901', 4.9, 643, 'Korean and indie skincare, fragrances, and clean haircare. Curated weekly.', 'https://images.unsplash.com/photo-1522335789203-aaa2103e0b6a?w=800&q=80', 'https://images.unsplash.com/photo-1522335789203-aaa2103e0b6a?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (6, 'Mohammadpur Pharma+', ARRAY[16,15]::INT[], NULL, 'Dhaka', 'Dhaka', 'Mohammadpur', 'Tajmahal Road', 'Block A, House 22', '8:00 AM – 11:30 PM', '+880 1716-789012', 4.6, 420, 'Licensed pharmacy with baby care aisle. Free BP checks every Friday.', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (7, 'Bashundhara Cold Press', ARRAY[6,1]::INT[], NULL, 'Dhaka', 'Dhaka', 'Bashundhara', 'Block J', 'Avenue 5, Plot 12', '8:00 AM – 10:00 PM', '+880 1717-890123', 4.7, 198, 'Cold-pressed juice, tonics, and seasonal smoothies. No added sugar.', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (8, 'Rayer Bazar Spice House', ARRAY[14,2]::INT[], NULL, 'Dhaka', 'Dhaka', 'Mohammadpur', 'Rayer Bazar', 'Tin Rasta More', '9:00 AM – 9:30 PM', '+880 1718-901234', 4.5, 276, 'Whole spices, masala blends, mustard oil — milled and packed in-house.', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (9, 'Shyamoli Scoops', ARRAY[8,10]::INT[], NULL, 'Dhaka', 'Dhaka', 'Mohammadpur', 'Shyamoli', 'Ring Road, House 4', '11:00 AM – 11:00 PM', '+880 1719-012345', 4.6, 384, 'Small-batch ice cream, kulfi, and falooda. Mango, cardamom, dark chocolate.', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (10, 'Kalabagan Quick Bites', ARRAY[9,6]::INT[], NULL, 'Dhaka', 'Dhaka', 'Dhanmondi', 'Kalabagan', 'Lake Circus', '11:00 AM – 1:00 AM', '+880 1710-123450', 4.3, 712, 'Burgers, fuchka, kacchi rolls. Late-night menu after 10 PM.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (11, 'Green Road Grocers', ARRAY[2,1,3]::INT[], NULL, 'Dhaka', 'Dhaka', 'Tejgaon', 'Green Road', 'House 16/A', '7:00 AM – 10:00 PM', '+880 1721-234561', 4.4, 256, 'Neighbourhood grocery with imported pantry, organic eggs, and farm cheese.', 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&q=80', 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (12, 'Tejgaon Coffee Atelier', ARRAY[7,5]::INT[], NULL, 'Dhaka', 'Dhaka', 'Tejgaon', 'Tejgaon I/A', 'Industrial Plot 9', '8:00 AM – 11:00 PM', '+880 1722-345672', 4.9, 489, 'Single-origin espresso, pour-over, fresh boba. Roasted on-site every Sunday.', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (13, 'Khilgaon Clean Co.', ARRAY[13,12]::INT[], NULL, 'Dhaka', 'Dhaka', 'Khilgaon', 'Khilgaon Chowdhurypara', 'House 38, Lane 2', '9:00 AM – 9:00 PM', '+880 1723-456783', 4.2, 142, 'Eco-friendly cleaning, detergents, refill bar. Zero-plastic loyalty discount.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (14, 'Badda Pet Pavilion', ARRAY[17,16]::INT[], NULL, 'Dhaka', 'Dhaka', 'Badda', 'Middle Badda', 'Pragati Sarani, Plot 21', '10:00 AM – 9:00 PM', '+880 1724-567894', 4.7, 188, 'Premium dog and cat food, accessories, and a free Saturday vet clinic.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (15, 'Pallabi Stationery Hub', ARRAY[18,15]::INT[], NULL, 'Dhaka', 'Dhaka', 'Mirpur', 'Pallabi', 'Sec 11, Block A', '9:00 AM – 9:00 PM', '+880 1725-678905', 4.5, 231, 'School and office supplies, art papers, and gift wrapping bar.', 'https://images.unsplash.com/photo-1568871391351-3f6c79b09c1e?w=800&q=80', 'https://images.unsplash.com/photo-1568871391351-3f6c79b09c1e?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.stores (id, name, category_ids, owner_id, division, district, upazila, area, street, hours, phone, rating, reviews_count, description, image, banner, status) VALUES (16, 'Dhanmondi Daily Loaf', ARRAY[5,3]::INT[], NULL, 'Dhaka', 'Dhaka', 'Dhanmondi', 'Dhanmondi 15', 'Road 15A, House 9', '6:30 AM – 9:30 PM', '+880 1726-789016', 4.6, 367, 'Daily bread, brioche, milk, butter. Subscription delivery before sunrise.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80', 'active') ON CONFLICT (id) DO NOTHING;
SELECT setval('stores_id_seq', GREATEST((SELECT MAX(id) FROM public.stores), 1));

-- 3d. Products
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1001, 'Himsagar Mango (1 kg)', 1, 1, 220, 15, 45, 'kg', 'Sweet Himsagar mangoes from Rajshahi. Hand-picked, ripe, ready to eat.', 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1002, 'Cherry Tomato (500 g)', 1, 1, 95, 0, 60, 'pack', 'Locally grown cherry tomatoes. Crisp, tangy, no pesticide residue.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1003, 'Spinach Bunch', 1, 1, 35, 10, 80, 'bundle', 'Fresh spinach harvested this morning. Wash, chop, and cook within 2 days.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1004, 'Sundarban Honey (500 g)', 1, 11, 680, 5, 18, 'bottle', 'Raw multi-floral honey from the Sundarbans. Unfiltered, naturally crystallized.', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1005, 'Banana Sagor (1 dozen)', 1, 1, 110, 0, 120, 'dozen', 'Sweet Sagor bananas. Ideal for breakfast and smoothies.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1006, 'Miniket Rice (5 kg)', 2, 3, 480, 5, 60, 'pack', 'Premium Miniket rice, polished and sorted. Soft, aromatic when cooked.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1007, 'Mustard Oil (1 L)', 2, 8, 280, 10, 40, 'bottle', 'Cold-pressed mustard oil from Pabna. Pungent, traditional cooking essential.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1008, 'Mug Daal (1 kg)', 2, 3, 165, 0, 90, 'pack', 'Split mung beans. Quick-cooking, perfect for khichuri and stews.', 'https://images.unsplash.com/photo-1599909533730-3f33b2cdebe3?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1009, 'Atta Whole Wheat (2 kg)', 2, 11, 145, 5, 70, 'pack', 'Stone-ground whole wheat flour. Soft rotis, perfect chapati texture.', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1010, 'Cane Sugar (1 kg)', 2, 3, 130, 0, 200, 'pack', 'Refined cane sugar. Standard kitchen staple.', 'https://images.unsplash.com/photo-1610477523919-1eaab9b35a90?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1011, 'Aarong Cow Milk (1 L)', 3, 3, 110, 0, 50, 'bottle', 'Pasteurized full-cream cow milk. Daily fresh from Aarong Dairy.', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1012, 'Farm Eggs (12 pcs)', 3, 11, 165, 10, 75, 'dozen', 'Free-range brown eggs from local farms. Larger yolk, deeper colour.', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1013, 'Sweet Curd 500 g', 3, 16, 180, 5, 30, 'pack', 'Bogra-style sweet curd in a clay pot. Set overnight, cool and creamy.', 'https://images.unsplash.com/photo-1571212058124-f1474429dccb?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1014, 'Cheddar Block (250 g)', 3, 3, 420, 15, 22, 'pack', 'Imported aged cheddar. Sharp and slice-able.', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1015, 'Salted Butter (200 g)', 3, 16, 320, 0, 40, 'pack', 'Cultured salted butter. Spread cold, melt over warm toast.', 'https://images.unsplash.com/photo-1589985270958-bf087b2d4ed5?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1016, 'Beef Boneless (1 kg)', 4, 4, 780, 5, 25, 'kg', 'Halal boneless beef cuts. Lean, ideal for kacchi and kebab.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1017, 'Chicken Whole (1.2 kg)', 4, 4, 290, 10, 35, 'piece', 'Farm-raised broiler chicken, dressed and chilled.', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1018, 'Hilsa Fish (1 kg)', 4, 4, 1450, 0, 12, 'kg', 'Padma River Hilsa, medium size. Cleaned and scaled on request.', 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1019, 'Rohu Fish (1 kg)', 4, 4, 380, 15, 28, 'kg', 'Live Rohu carp, cleaned to order. Firm, sweet flesh.', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1020, 'Mutton Curry Cut (1 kg)', 4, 4, 1100, 5, 8, 'kg', 'Bone-in goat mutton. Hand-cut for slow curries.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1021, 'Sourdough Boule', 5, 2, 320, 0, 14, 'piece', 'Naturally leavened country loaf. 24-hour cold ferment.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1022, 'Almond Croissant', 5, 2, 180, 10, 22, 'piece', 'Buttery laminated dough, almond cream filling, toasted flakes.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1023, 'Brioche Loaf', 5, 16, 240, 5, 18, 'piece', 'Soft, eggy brioche. Perfect for French toast.', 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1024, 'Cinnamon Roll (4 pack)', 5, 2, 380, 15, 16, 'pack', 'Glazed cinnamon rolls. Reheat for 30 seconds before serving.', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1025, 'Cold-Press Orange (500 ml)', 6, 7, 220, 0, 40, 'bottle', 'Single-press orange juice. No water, no sugar added.', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1026, 'Watermelon Cooler (500 ml)', 6, 7, 180, 10, 32, 'bottle', 'Watermelon, mint, lime. Refreshing summer pick.', 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1027, 'Mojito Lime (500 ml)', 6, 10, 150, 0, 45, 'bottle', 'Lime, mint, sparkling water. Zero sugar.', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1028, 'Mango Lassi (400 ml)', 6, 9, 160, 5, 28, 'bottle', 'Yogurt-based mango lassi, lightly sweetened with cardamom.', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1029, 'Single-Origin Espresso Beans (250 g)', 7, 12, 880, 10, 20, 'pack', 'Ethiopian Yirgacheffe. Bright, floral, citrus finish.', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1030, 'Brown Sugar Boba', 7, 12, 220, 0, 50, 'piece', 'Tapioca pearls in caramelized brown sugar, topped with milk foam.', 'https://images.unsplash.com/photo-1558857563-c3c63ee47e09?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1031, 'Sylhet Black Tea (200 g)', 7, 12, 320, 5, 36, 'pack', 'Bold black tea from Sylhet hills. Brews a deep amber cup.', 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1032, 'Matcha Latte Mix (100 g)', 7, 12, 480, 15, 14, 'pack', 'Ceremonial-grade matcha blended with cane sugar.', 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1033, 'Mango Kulfi (4 pack)', 8, 9, 280, 0, 30, 'pack', 'Cardamom-spiced mango kulfi. Slow-churned, no stabilizers.', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1034, 'Dark Chocolate Tub (500 ml)', 8, 9, 420, 10, 18, 'pack', '70% dark chocolate ice cream. Made with Belgian cocoa.', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1035, 'Faluda Glass', 8, 9, 220, 5, 24, 'piece', 'Vermicelli, rose syrup, kulfi, basil seeds. Layered classic.', 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1036, 'Spicy Chicken Burger', 9, 10, 320, 10, 50, 'piece', 'Crispy chicken thigh, jalapeño slaw, brioche bun.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1037, 'Beef Kacchi Roll', 9, 10, 250, 0, 40, 'piece', 'Slow-cooked kacchi beef, onion, fresh roti, mint chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1038, 'Fuchka (1 plate)', 9, 10, 90, 0, 80, 'pack', 'Crisp fuchka shells, chickpea-potato filling, tamarind water.', 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1039, 'Cheesy Fries', 9, 10, 180, 15, 60, 'pack', 'Golden fries, cheddar sauce, smoked paprika.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1040, 'Rosogolla (1 kg)', 10, 9, 380, 5, 22, 'kg', 'Spongy chenna in light sugar syrup. Bengali classic.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1041, 'Mishti Doi (500 g)', 10, 9, 160, 0, 30, 'pack', 'Caramelised sweet yogurt set in a clay bowl.', 'https://images.unsplash.com/photo-1571212058124-f1474429dccb?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1042, 'Chum Chum Box (12 pcs)', 10, 9, 420, 10, 18, 'pack', 'Soft chum chum dusted with khoya and pistachio.', 'https://images.unsplash.com/photo-1631452180773-65a3a4ad8c95?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1043, 'Vitamin C Serum (30 ml)', 11, 5, 1450, 20, 24, 'bottle', 'Stable 15% L-ascorbic acid with ferulic acid. Brightens dull skin.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1044, 'Hydrating Toner (200 ml)', 11, 5, 980, 10, 30, 'bottle', 'Hyaluronic acid + panthenol. Lightweight, fragrance-free.', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1045, 'Sheet Mask (5 pack)', 11, 5, 750, 15, 40, 'pack', 'Korean cellulose sheet masks. Niacinamide, centella, snail.', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1046, 'Lip Tint Velvet', 11, 5, 620, 5, 35, 'piece', 'Long-wear matte tint, weightless feel, four shades.', 'https://images.unsplash.com/photo-1631214540242-c0fd2bb5f5b8?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1047, 'Charcoal Soap Bar', 12, 5, 220, 0, 60, 'piece', 'Activated charcoal soap with shea butter. Detoxifies pores.', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1048, 'Bamboo Toothbrush', 12, 13, 95, 10, 80, 'piece', 'Plant-based bristles, biodegradable handle.', 'https://images.unsplash.com/photo-1559591935-c6c92c6e1a18?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1049, 'Herbal Shampoo (300 ml)', 12, 6, 380, 5, 40, 'bottle', 'Sulphate-free shampoo with amla and bhringraj.', 'https://images.unsplash.com/photo-1626015449634-f8a83b2a5a7c?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1050, 'Eco Dish Liquid (1 L)', 13, 13, 240, 10, 50, 'bottle', 'Plant-based dish soap. Cuts grease without harsh fragrance.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1051, 'Microfibre Cloth (3 pack)', 13, 3, 180, 0, 70, 'pack', 'Lint-free cloths for dusting, polishing, and screens.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1052, 'Floor Cleaner (1.5 L)', 13, 13, 320, 15, 36, 'bottle', 'Phenyl-free floor disinfectant. Lemongrass scent.', 'https://images.unsplash.com/photo-1605542283571-de7e0aab8e62?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1053, 'Garam Masala (100 g)', 14, 8, 180, 5, 50, 'pack', 'Hand-blended garam masala. Cardamom, clove, cinnamon, mace.', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1054, 'Turmeric Powder (200 g)', 14, 8, 110, 0, 80, 'pack', 'Stone-ground turmeric. High curcumin content.', 'https://images.unsplash.com/photo-1599909533730-3f33b2cdebe3?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1055, 'Naga Chili Pickle (200 g)', 14, 8, 260, 10, 24, 'bottle', 'Fiery naga chili pickle. A teaspoon goes a long way.', 'https://images.unsplash.com/photo-1604908176997-431f9b1d8e18?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1056, 'Diapers M (40 pack)', 15, 6, 980, 15, 28, 'pack', 'Ultra-absorbent diapers, 5–10 kg. Hypoallergenic.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1057, 'Baby Lotion (200 ml)', 15, 6, 420, 5, 32, 'bottle', 'Pediatrician-tested lotion with chamomile.', 'https://images.unsplash.com/photo-1555776648-13bbe43efeae?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1058, 'Wooden Rattle Set', 15, 15, 380, 0, 18, 'pack', 'Natural beechwood rattles. Non-toxic finish, smooth edges.', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1059, 'Multivitamin (60 caps)', 16, 6, 580, 10, 35, 'pack', 'A–Z multivitamin and minerals. Once-daily, vegan caps.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1060, 'Digital BP Monitor', 16, 6, 2400, 20, 8, 'piece', 'Upper-arm cuff, memory for 60 readings, irregular heartbeat alert.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1061, 'Hand Sanitizer (250 ml)', 16, 6, 180, 0, 60, 'bottle', '70% alcohol gel with aloe. Skin-kind formula.', 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1062, 'Premium Dog Food (3 kg)', 17, 14, 1850, 10, 22, 'pack', 'Chicken and rice formula, no fillers. For adult dogs.', 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1063, 'Cat Litter (5 kg)', 17, 14, 720, 5, 18, 'pack', 'Clumping bentonite, low dust, lavender scent.', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1064, 'Chew Toy (Rubber)', 17, 14, 320, 0, 30, 'piece', 'Natural rubber dog toy with treat pocket.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1065, 'A5 Notebook (Linen)', 18, 15, 320, 5, 40, 'piece', 'Linen-bound dotted notebook, 192 pages, lay-flat binding.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1066, 'Gel Pen Set (10 pcs)', 18, 15, 280, 10, 80, 'pack', 'Smooth 0.5 mm gel pens. Quick-dry, smudge-free.', 'https://images.unsplash.com/photo-1568871391351-3f6c79b09c1e?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1067, 'Watercolor Pad A4', 18, 15, 480, 15, 24, 'piece', '200 gsm cold-press watercolour paper, 20 sheets.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, name, category_id, store_id, price, discount, stock, unit, description, image, available) VALUES (1068, 'Desk Organizer Wood', 18, 15, 850, 20, 12, 'piece', 'Solid mango wood desk organizer with brass pen slot.', 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80', TRUE) ON CONFLICT (id) DO NOTHING;
SELECT setval('products_id_seq', GREATEST((SELECT MAX(id) FROM public.products), 1000));

-- 3e. Orders
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5001, 101, 1, '2026-05-08T09:14:00'::timestamptz, 'delivered', '[{"product_id":1001,"name":"Himsagar Mango (1 kg)","qty":2,"price":220,"discount":15},{"product_id":1003,"name":"Spinach Bunch","qty":3,"price":35,"discount":10}]'::jsonb, 468, 60, 0, 0, 528, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5002, 101, 2, '2026-05-07T18:30:00'::timestamptz, 'delivered', '[{"product_id":1021,"name":"Sourdough Boule","qty":1,"price":320,"discount":0},{"product_id":1022,"name":"Almond Croissant","qty":4,"price":180,"discount":10}]'::jsonb, 968, 60, 0, 50, 1023, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5003, 101, 5, '2026-05-05T13:22:00'::timestamptz, 'shipped', '[{"product_id":1043,"name":"Vitamin C Serum (30 ml)","qty":1,"price":1450,"discount":20}]'::jsonb, 1160, 60, 50, 0, 1144, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5004, 102, 4, '2026-05-08T07:45:00'::timestamptz, 'preparing', '[{"product_id":1018,"name":"Hilsa Fish (1 kg)","qty":1,"price":1450,"discount":0},{"product_id":1017,"name":"Chicken Whole (1.2 kg)","qty":2,"price":290,"discount":10}]'::jsonb, 1972, 0, 0, 100, 1872, 'Store Pickup', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5005, 102, 12, '2026-05-06T10:10:00'::timestamptz, 'delivered', '[{"product_id":1029,"name":"Single-Origin Espresso Beans (250 g)","qty":2,"price":880,"discount":10}]'::jsonb, 1584, 60, 0, 0, 1644, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5006, 102, 9, '2026-05-04T20:00:00'::timestamptz, 'delivered', '[{"product_id":1033,"name":"Mango Kulfi (4 pack)","qty":2,"price":280,"discount":0}]'::jsonb, 560, 60, 0, 0, 620, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5007, 103, 3, '2026-05-08T11:00:00'::timestamptz, 'confirmed', '[{"product_id":1006,"name":"Miniket Rice (5 kg)","qty":1,"price":480,"discount":5},{"product_id":1011,"name":"Aarong Cow Milk (1 L)","qty":2,"price":110,"discount":0}]'::jsonb, 676, 60, 0, 0, 736, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5008, 103, 10, '2026-05-07T22:15:00'::timestamptz, 'delivered', '[{"product_id":1036,"name":"Spicy Chicken Burger","qty":2,"price":320,"discount":10},{"product_id":1039,"name":"Cheesy Fries","qty":1,"price":180,"discount":15}]'::jsonb, 729, 60, 0, 0, 789, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5009, 103, 7, '2026-05-05T16:50:00'::timestamptz, 'cancelled', '[{"product_id":1025,"name":"Cold-Press Orange (500 ml)","qty":3,"price":220,"discount":0}]'::jsonb, 660, 60, 0, 0, 720, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5010, 101, 8, '2026-05-03T12:00:00'::timestamptz, 'delivered', '[{"product_id":1053,"name":"Garam Masala (100 g)","qty":2,"price":180,"discount":5},{"product_id":1055,"name":"Naga Chili Pickle (200 g)","qty":1,"price":260,"discount":10}]'::jsonb, 576, 0, 0, 0, 576, 'Store Pickup', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5011, 102, 14, '2026-05-02T15:00:00'::timestamptz, 'delivered', '[{"product_id":1062,"name":"Premium Dog Food (3 kg)","qty":1,"price":1850,"discount":10}]'::jsonb, 1665, 60, 0, 0, 1725, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5012, 103, 15, '2026-05-08T14:25:00'::timestamptz, 'pending', '[{"product_id":1065,"name":"A5 Notebook (Linen)","qty":2,"price":320,"discount":5},{"product_id":1066,"name":"Gel Pen Set (10 pcs)","qty":1,"price":280,"discount":10}]'::jsonb, 860, 60, 0, 0, 920, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5013, 101, 16, '2026-04-30T07:00:00'::timestamptz, 'delivered', '[{"product_id":1023,"name":"Brioche Loaf","qty":1,"price":240,"discount":5},{"product_id":1015,"name":"Salted Butter (200 g)","qty":1,"price":320,"discount":0}]'::jsonb, 548, 60, 0, 0, 608, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5014, 102, 6, '2026-04-28T18:00:00'::timestamptz, 'delivered', '[{"product_id":1059,"name":"Multivitamin (60 caps)","qty":1,"price":580,"discount":10},{"product_id":1061,"name":"Hand Sanitizer (250 ml)","qty":2,"price":180,"discount":0}]'::jsonb, 882, 60, 0, 200, 742, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5015, 103, 13, '2026-04-27T11:30:00'::timestamptz, 'delivered', '[{"product_id":1050,"name":"Eco Dish Liquid (1 L)","qty":2,"price":240,"discount":10},{"product_id":1052,"name":"Floor Cleaner (1.5 L)","qty":1,"price":320,"discount":15}]'::jsonb, 704, 0, 0, 0, 704, 'Store Pickup', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5016, 101, 11, '2026-04-25T09:00:00'::timestamptz, 'delivered', '[{"product_id":1004,"name":"Sundarban Honey (500 g)","qty":1,"price":680,"discount":5}]'::jsonb, 646, 60, 0, 0, 706, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5017, 102, 12, '2026-04-24T08:30:00'::timestamptz, 'delivered', '[{"product_id":1031,"name":"Sylhet Black Tea (200 g)","qty":2,"price":320,"discount":5},{"product_id":1030,"name":"Brown Sugar Boba","qty":1,"price":220,"discount":0}]'::jsonb, 828, 60, 0, 0, 888, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5018, 103, 5, '2026-04-22T17:45:00'::timestamptz, 'delivered', '[{"product_id":1045,"name":"Sheet Mask (5 pack)","qty":2,"price":750,"discount":15}]'::jsonb, 1275, 60, 50, 0, 1208, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5019, 101, 4, '2026-04-20T07:30:00'::timestamptz, 'delivered', '[{"product_id":1019,"name":"Rohu Fish (1 kg)","qty":2,"price":380,"discount":15}]'::jsonb, 646, 60, 0, 0, 706, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5020, 102, 9, '2026-04-18T21:00:00'::timestamptz, 'delivered', '[{"product_id":1040,"name":"Rosogolla (1 kg)","qty":1,"price":380,"discount":5},{"product_id":1041,"name":"Mishti Doi (500 g)","qty":2,"price":160,"discount":0}]'::jsonb, 681, 60, 0, 0, 741, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_id, store_id, date, status, items, subtotal, delivery_fee, coupon, coins_redeemed, total, delivery_type, review) VALUES (5021, 103, 2, '2026-04-15T08:00:00'::timestamptz, 'delivered', '[{"product_id":1024,"name":"Cinnamon Roll (4 pack)","qty":1,"price":380,"discount":15}]'::jsonb, 323, 60, 0, 0, 383, 'Home Delivery', NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('orders_id_seq', GREATEST((SELECT MAX(id) FROM public.orders), 5000));

-- 3f. Advertisements
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9001, 5, 1043, 'Glow Season — 20% Off Vitamin C', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80', 'active', 3420, 412, '2026-05-01'::date, '2026-05-31'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9002, 9, 1033, 'Mango Kulfi — Scoop Up Summer', 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=1200&q=80', 'active', 1980, 267, '2026-05-03'::date, '2026-05-25'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9003, 12, 1029, 'Yirgacheffe — 10% Off Single Origin', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80', 'active', 2670, 304, '2026-04-28'::date, '2026-05-28'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9004, 4, 1019, 'Rohu Fish — 15% Off Fresh Catch', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=1200&q=80', 'active', 1450, 189, '2026-05-05'::date, '2026-05-20'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9005, 2, 1024, 'Cinnamon Roll Wednesdays', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80', 'paused', 980, 88, '2026-04-20'::date, '2026-05-15'::date, 202, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9006, 7, 1025, 'Cold-Press Orange — Healthy Pour', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200&q=80', 'active', 1740, 198, '2026-05-02'::date, '2026-05-25'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.advertisements (id, store_id, product_id, title, banner, status, views, clicks, start_date, end_date, created_by, featured_in_top_deals) VALUES (9007, 10, 1036, 'Late-Night Burgers — 10% Off', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80', 'expired', 4220, 510, '2026-03-15'::date, '2026-04-30'::date, NULL, FALSE) ON CONFLICT (id) DO NOTHING;
SELECT setval('advertisements_id_seq', GREATEST((SELECT MAX(id) FROM public.advertisements), 9000));

-- 3g. Coin transactions
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (1, 101, '2026-05-08T09:30:00'::timestamptz, 'Order placed (#5001)', 52, 340) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (2, 101, '2026-05-07T19:00:00'::timestamptz, 'Order placed (#5002)', 102, 288) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (3, 101, '2026-05-07T18:45:00'::timestamptz, 'Coins redeemed (#5002)', -50, 186) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (4, 101, '2026-05-06T08:00:00'::timestamptz, 'Daily login bonus', 2, 236) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (5, 101, '2026-05-05T13:50:00'::timestamptz, 'Order placed (#5003)', 114, 234) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (6, 101, '2026-05-04T10:00:00'::timestamptz, 'Review submitted', 10, 120) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (7, 101, '2026-05-03T12:30:00'::timestamptz, 'Order placed (#5010)', 57, 110) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (8, 101, '2026-04-25T09:30:00'::timestamptz, 'Order placed (#5016)', 70, 53) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (9, 102, '2026-05-08T08:00:00'::timestamptz, 'Order placed (#5004)', 187, 1240) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (10, 102, '2026-05-08T07:50:00'::timestamptz, 'Coins redeemed (#5004)', -100, 1053) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (11, 102, '2026-05-06T10:30:00'::timestamptz, 'Order placed (#5005)', 164, 1153) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (12, 102, '2026-05-04T20:30:00'::timestamptz, 'Order placed (#5006)', 62, 989) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (13, 102, '2026-04-28T18:30:00'::timestamptz, 'Order placed (#5014)', 74, 927) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (14, 102, '2026-04-28T18:15:00'::timestamptz, 'Coins redeemed (#5014)', -200, 853) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (15, 102, '2026-04-24T09:00:00'::timestamptz, 'Order placed (#5017)', 88, 1053) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (16, 103, '2026-05-08T11:30:00'::timestamptz, 'Order placed (#5007)', 73, 75) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (17, 103, '2026-05-07T22:30:00'::timestamptz, 'Order placed (#5008)', 78, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coin_transactions (id, customer_id, date, action, change, balance) VALUES (18, 103, '2026-04-22T18:00:00'::timestamptz, 'Daily login bonus', 2, -76) ON CONFLICT (id) DO NOTHING;
SELECT setval('coin_transactions_id_seq', GREATEST((SELECT MAX(id) FROM public.coin_transactions), 100));

-- 3h. Audit logs
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (1, '2026-05-08T11:30:00'::timestamptz, 103, 'Nazia Karim', 'customer', 'CREATE', 'orders', 5007, 'Placed order #5007 at Gulshan Daily Mart') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (2, '2026-05-08T11:00:00'::timestamptz, 103, 'Nazia Karim', 'customer', 'LOGIN', 'users', 103, 'Logged in') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (3, '2026-05-08T10:14:00'::timestamptz, 301, 'Imran Hossain', 'admin', 'SUSPEND', 'shops', 999, 'Suspended shop pending review (test entry)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (4, '2026-05-08T09:30:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'orders', 5001, 'Placed order #5001 at Sobji Bazar Fresh') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (5, '2026-05-08T09:14:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'LOGIN', 'users', 101, 'Logged in') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (6, '2026-05-08T08:00:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'CREATE', 'orders', 5004, 'Placed order #5004 at Mirpur Meat & Fish Co.') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (7, '2026-05-08T07:00:00'::timestamptz, 201, 'Mizanur Rahman', 'shopkeeper', 'UPDATE', 'products', 1003, 'Updated stock for Spinach Bunch (60 → 80)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (8, '2026-05-08T06:45:00'::timestamptz, 201, 'Mizanur Rahman', 'shopkeeper', 'LOGIN', 'users', 201, 'Logged in') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (9, '2026-05-07T22:30:00'::timestamptz, 103, 'Nazia Karim', 'customer', 'CREATE', 'orders', 5008, 'Placed order #5008 at Kalabagan Quick Bites') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (10, '2026-05-07T20:10:00'::timestamptz, 302, 'Sara Iqbal', 'admin', 'UPDATE', 'ads', 9005, 'Paused ad — Cinnamon Roll Wednesdays') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (11, '2026-05-07T19:00:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'orders', 5002, 'Placed order #5002 at Banani Bake House') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (12, '2026-05-07T18:45:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'UPDATE', 'coins', 101, 'Redeemed 50 coins on order #5002') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (13, '2026-05-07T15:30:00'::timestamptz, 202, 'Sadia Akter', 'shopkeeper', 'CREATE', 'products', 1024, 'Added Cinnamon Roll (4 pack)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (14, '2026-05-07T14:00:00'::timestamptz, 203, 'Rafiq Ahmed', 'shopkeeper', 'UPDATE', 'shops', 3, 'Updated shop hours — now 24 hours') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (15, '2026-05-07T11:20:00'::timestamptz, 301, 'Imran Hossain', 'admin', 'LOGIN', 'users', 301, 'Logged in') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (16, '2026-05-07T10:00:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'UPDATE', 'users', 102, 'Updated profile — phone number') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (17, '2026-05-07T09:30:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'UPDATE', 'reviews', 5005, 'Reviewed order #5005 — 5 stars') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (18, '2026-05-06T18:00:00'::timestamptz, NULL, 'Uttara Beauty Lounge', 'shopkeeper', 'CREATE', 'ads', 9001, 'Created ad — Glow Season Vitamin C') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (19, '2026-05-06T15:45:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'reviews', 5010, 'Reviewed order #5010 — 4 stars') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (20, '2026-05-06T08:00:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'UPDATE', 'coins', 101, 'Daily login bonus — earned 2 coins') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (21, '2026-05-05T16:50:00'::timestamptz, 103, 'Nazia Karim', 'customer', 'UPDATE', 'orders', 5009, 'Cancelled order #5009') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (22, '2026-05-05T13:22:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'orders', 5003, 'Placed order #5003 at Uttara Beauty Lounge') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (23, '2026-05-05T10:00:00'::timestamptz, NULL, 'Mirpur Meat & Fish Co.', 'shopkeeper', 'UPDATE', 'products', 1018, 'Updated price for Hilsa Fish (1300 → 1450)') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (24, '2026-05-05T08:30:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'CREATE', 'favorites', 12, 'Added Tejgaon Coffee Atelier to favorites') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (25, '2026-05-04T20:30:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'CREATE', 'orders', 5006, 'Placed order #5006 at Shyamoli Scoops') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (26, '2026-05-04T11:00:00'::timestamptz, 302, 'Sara Iqbal', 'admin', 'UPDATE', 'users', 215, 'Updated admin moderator permissions') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (27, '2026-05-03T12:30:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'orders', 5010, 'Placed order #5010 at Rayer Bazar Spice House') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (28, '2026-05-03T09:00:00'::timestamptz, NULL, 'Bashundhara Cold Press', 'shopkeeper', 'CREATE', 'ads', 9006, 'Created ad — Cold-Press Orange') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (29, '2026-05-02T15:00:00'::timestamptz, 102, 'Tanvir Hossain', 'customer', 'CREATE', 'orders', 5011, 'Placed order #5011 at Badda Pet Pavilion') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (30, '2026-05-01T10:00:00'::timestamptz, 301, 'Imran Hossain', 'admin', 'UPDATE', 'ads', 9001, 'Curated Vitamin C Serum into homepage slider') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (31, '2026-04-30T07:00:00'::timestamptz, 101, 'Ayesha Rahman', 'customer', 'CREATE', 'orders', 5013, 'Placed order #5013 at Dhanmondi Daily Loaf') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.audit_logs (id, datetime, user_id, user_name, user_type, action, entity, entity_id, description) VALUES (32, '2026-04-29T19:00:00'::timestamptz, NULL, 'Shyamoli Scoops', 'shopkeeper', 'UPDATE', 'products', 1034, 'Updated discount for Dark Chocolate Tub (5% → 10%)') ON CONFLICT (id) DO NOTHING;
SELECT setval('audit_logs_id_seq', GREATEST((SELECT MAX(id) FROM public.audit_logs), 100));

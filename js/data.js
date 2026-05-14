/* ============================================================
   data.js — RAW MOCK DATA ONLY (zero functions, zero logic)
   All seed data for EasyMart. Replace with Supabase later.
   ============================================================ */

const DATA_CATEGORIES = [
  { id: 1,  name: "Fruits & Vegetables",    icon: "🥦", color: "#16a34a" },
  { id: 2,  name: "Grocery & Staples",      icon: "🌾", color: "#d97706" },
  { id: 3,  name: "Dairy & Eggs",           icon: "🥛", color: "#0ea5e9" },
  { id: 4,  name: "Meat & Fish",            icon: "🐟", color: "#dc2626" },
  { id: 5,  name: "Bakery & Bread",         icon: "🍞", color: "#b45309" },
  { id: 6,  name: "Cold Drinks & Juice",    icon: "🥤", color: "#2563eb" },
  { id: 7,  name: "Coffee, Tea & Boba",     icon: "☕", color: "#78350f" },
  { id: 8,  name: "Ice Cream & Desserts",   icon: "🍦", color: "#db2777" },
  { id: 9,  name: "Fast Food & Snacks",     icon: "🍔", color: "#ea580c" },
  { id: 10, name: "Sweets & Confectionery", icon: "🍬", color: "#c026d3" },
  { id: 11, name: "Beauty & Skincare",      icon: "💄", color: "#e11d48" },
  { id: 12, name: "Personal Hygiene",       icon: "🧴", color: "#0891b2" },
  { id: 13, name: "Cleaning & Household",   icon: "🧹", color: "#7c3aed" },
  { id: 14, name: "Cooking & Spices",       icon: "🌶️", color: "#dc2626" },
  { id: 15, name: "Baby Care",              icon: "👶", color: "#f472b6" },
  { id: 16, name: "Pharmacy & Health",      icon: "💊", color: "#059669" },
  { id: 17, name: "Pet Supplies",           icon: "🐾", color: "#92400e" },
  { id: 18, name: "Stationery & Office",    icon: "✏️", color: "#475569" }
];

/* ------------------------------------------------------------ */

const DATA_STORES = [
  { id: 1,  name: "Sobji Bazar Fresh",        category_ids: [1, 2, 14], owner_id: 201,
    division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi",   area: "Dhanmondi 27",   street: "Road 27, House 14",
    hours: "7:00 AM – 10:00 PM", phone: "+880 1711-234567", rating: 4.7, reviews_count: 312,
    description: "Family-run produce shop sourcing daily from Karwan Bazar. Crisp greens, seasonal fruit, whole grains.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" },

  { id: 2,  name: "Banani Bake House",        category_ids: [5, 7, 10], owner_id: 202,
    division: "Dhaka", district: "Dhaka", upazila: "Banani",      area: "Banani 11",       street: "Road 11, Block F",
    hours: "6:30 AM – 11:00 PM", phone: "+880 1712-345678", rating: 4.8, reviews_count: 528,
    description: "Sourdough, croissants, hand-pulled coffee. Slow bakery with stone-ground flour.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80" },

  { id: 3,  name: "Gulshan Daily Mart",       category_ids: [2, 3, 13], owner_id: 203,
    division: "Dhaka", district: "Dhaka", upazila: "Gulshan",     area: "Gulshan 2",        street: "Road 113, Plot 6",
    hours: "24 hours", phone: "+880 1713-456789", rating: 4.5, reviews_count: 891,
    description: "Round-the-clock supermarket. Pantry, dairy, household — restocked nightly.",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80" },

  { id: 4,  name: "Mirpur Meat & Fish Co.",   category_ids: [4],         owner_id: 204,
    division: "Dhaka", district: "Dhaka", upazila: "Mirpur",      area: "Mirpur 10",        street: "Sec 10, Block C",
    hours: "6:00 AM – 9:00 PM", phone: "+880 1714-567890", rating: 4.4, reviews_count: 207,
    description: "Halal butcher and live fish counter. Cut to order, vacuum-packed for delivery.",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80" },

  { id: 5,  name: "Uttara Beauty Lounge",     category_ids: [11, 12],    owner_id: 205,
    division: "Dhaka", district: "Dhaka", upazila: "Uttara",      area: "Uttara Sector 7",  street: "Road 17, House 8",
    hours: "10:00 AM – 9:00 PM", phone: "+880 1715-678901", rating: 4.9, reviews_count: 643,
    description: "Korean and indie skincare, fragrances, and clean haircare. Curated weekly.",
    image: "https://images.unsplash.com/photo-1522335789203-aaa2103e0b6a?w=800&q=80" },

  { id: 6,  name: "Mohammadpur Pharma+",      category_ids: [16, 15],    owner_id: 206,
    division: "Dhaka", district: "Dhaka", upazila: "Mohammadpur", area: "Tajmahal Road",    street: "Block A, House 22",
    hours: "8:00 AM – 11:30 PM", phone: "+880 1716-789012", rating: 4.6, reviews_count: 420,
    description: "Licensed pharmacy with baby care aisle. Free BP checks every Friday.",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80" },

  { id: 7,  name: "Bashundhara Cold Press",   category_ids: [6, 1],      owner_id: 207,
    division: "Dhaka", district: "Dhaka", upazila: "Bashundhara", area: "Block J",          street: "Avenue 5, Plot 12",
    hours: "8:00 AM – 10:00 PM", phone: "+880 1717-890123", rating: 4.7, reviews_count: 198,
    description: "Cold-pressed juice, tonics, and seasonal smoothies. No added sugar.",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80" },

  { id: 8,  name: "Rayer Bazar Spice House",  category_ids: [14, 2],     owner_id: 208,
    division: "Dhaka", district: "Dhaka", upazila: "Mohammadpur", area: "Rayer Bazar",      street: "Tin Rasta More",
    hours: "9:00 AM – 9:30 PM", phone: "+880 1718-901234", rating: 4.5, reviews_count: 276,
    description: "Whole spices, masala blends, mustard oil — milled and packed in-house.",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80" },

  { id: 9,  name: "Shyamoli Scoops",          category_ids: [8, 10],     owner_id: 209,
    division: "Dhaka", district: "Dhaka", upazila: "Mohammadpur", area: "Shyamoli",         street: "Ring Road, House 4",
    hours: "11:00 AM – 11:00 PM", phone: "+880 1719-012345", rating: 4.6, reviews_count: 384,
    description: "Small-batch ice cream, kulfi, and falooda. Mango, cardamom, dark chocolate.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80" },

  { id: 10, name: "Kalabagan Quick Bites",    category_ids: [9, 6],      owner_id: 210,
    division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi",   area: "Kalabagan",        street: "Lake Circus",
    hours: "11:00 AM – 1:00 AM", phone: "+880 1710-123450", rating: 4.3, reviews_count: 712,
    description: "Burgers, fuchka, kacchi rolls. Late-night menu after 10 PM.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },

  { id: 11, name: "Green Road Grocers",       category_ids: [2, 1, 3],   owner_id: 211,
    division: "Dhaka", district: "Dhaka", upazila: "Tejgaon",     area: "Green Road",       street: "House 16/A",
    hours: "7:00 AM – 10:00 PM", phone: "+880 1721-234561", rating: 4.4, reviews_count: 256,
    description: "Neighbourhood grocery with imported pantry, organic eggs, and farm cheese.",
    image: "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&q=80" },

  { id: 12, name: "Tejgaon Coffee Atelier",   category_ids: [7, 5],      owner_id: 212,
    division: "Dhaka", district: "Dhaka", upazila: "Tejgaon",     area: "Tejgaon I/A",      street: "Industrial Plot 9",
    hours: "8:00 AM – 11:00 PM", phone: "+880 1722-345672", rating: 4.9, reviews_count: 489,
    description: "Single-origin espresso, pour-over, fresh boba. Roasted on-site every Sunday.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80" },

  { id: 13, name: "Khilgaon Clean Co.",       category_ids: [13, 12],    owner_id: 213,
    division: "Dhaka", district: "Dhaka", upazila: "Khilgaon",    area: "Khilgaon Chowdhurypara", street: "House 38, Lane 2",
    hours: "9:00 AM – 9:00 PM", phone: "+880 1723-456783", rating: 4.2, reviews_count: 142,
    description: "Eco-friendly cleaning, detergents, refill bar. Zero-plastic loyalty discount.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80" },

  { id: 14, name: "Badda Pet Pavilion",       category_ids: [17, 16],    owner_id: 214,
    division: "Dhaka", district: "Dhaka", upazila: "Badda",       area: "Middle Badda",     street: "Pragati Sarani, Plot 21",
    hours: "10:00 AM – 9:00 PM", phone: "+880 1724-567894", rating: 4.7, reviews_count: 188,
    description: "Premium dog and cat food, accessories, and a free Saturday vet clinic.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80" },

  { id: 15, name: "Pallabi Stationery Hub",   category_ids: [18, 15],    owner_id: 215,
    division: "Dhaka", district: "Dhaka", upazila: "Mirpur",      area: "Pallabi",          street: "Sec 11, Block A",
    hours: "9:00 AM – 9:00 PM", phone: "+880 1725-678905", rating: 4.5, reviews_count: 231,
    description: "School and office supplies, art papers, and gift wrapping bar.",
    image: "https://images.unsplash.com/photo-1568871391351-3f6c79b09c1e?w=800&q=80" },

  { id: 16, name: "Dhanmondi Daily Loaf",     category_ids: [5, 3],      owner_id: 216,
    division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi",   area: "Dhanmondi 15",     street: "Road 15A, House 9",
    hours: "6:30 AM – 9:30 PM", phone: "+880 1726-789016", rating: 4.6, reviews_count: 367,
    description: "Daily bread, brioche, milk, butter. Subscription delivery before sunrise.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80" }
];

/* ------------------------------------------------------------ */

const DATA_PRODUCTS = [
  /* Fruits & Vegetables — store 1, 11, 7 */
  { id: 1001, name: "Himsagar Mango (1 kg)",      category_id: 1, store_id: 1, price: 220, discount: 15, stock: 45, unit: "kg",
    description: "Sweet Himsagar mangoes from Rajshahi. Hand-picked, ripe, ready to eat.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&q=80" },
  { id: 1002, name: "Cherry Tomato (500 g)",      category_id: 1, store_id: 1, price: 95,  discount: 0,  stock: 60, unit: "pack",
    description: "Locally grown cherry tomatoes. Crisp, tangy, no pesticide residue.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80" },
  { id: 1003, name: "Spinach Bunch",              category_id: 1, store_id: 1, price: 35,  discount: 10, stock: 80, unit: "bundle",
    description: "Fresh spinach harvested this morning. Wash, chop, and cook within 2 days.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80" },
  { id: 1004, name: "Sundarban Honey (500 g)",    category_id: 1, store_id: 11, price: 680, discount: 5,  stock: 18, unit: "bottle",
    description: "Raw multi-floral honey from the Sundarbans. Unfiltered, naturally crystallized.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80" },
  { id: 1005, name: "Banana Sagor (1 dozen)",     category_id: 1, store_id: 1, price: 110, discount: 0,  stock: 120, unit: "dozen",
    description: "Sweet Sagor bananas. Ideal for breakfast and smoothies.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80" },

  /* Grocery & Staples — store 3, 11, 8 */
  { id: 1006, name: "Miniket Rice (5 kg)",        category_id: 2, store_id: 3, price: 480, discount: 5,  stock: 60, unit: "pack",
    description: "Premium Miniket rice, polished and sorted. Soft, aromatic when cooked.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80" },
  { id: 1007, name: "Mustard Oil (1 L)",          category_id: 2, store_id: 8, price: 280, discount: 10, stock: 40, unit: "bottle",
    description: "Cold-pressed mustard oil from Pabna. Pungent, traditional cooking essential.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80" },
  { id: 1008, name: "Mug Daal (1 kg)",            category_id: 2, store_id: 3, price: 165, discount: 0,  stock: 90, unit: "pack",
    description: "Split mung beans. Quick-cooking, perfect for khichuri and stews.",
    image: "https://images.unsplash.com/photo-1599909533730-3f33b2cdebe3?w=600&q=80" },
  { id: 1009, name: "Atta Whole Wheat (2 kg)",    category_id: 2, store_id: 11, price: 145, discount: 5,  stock: 70, unit: "pack",
    description: "Stone-ground whole wheat flour. Soft rotis, perfect chapati texture.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80" },
  { id: 1010, name: "Cane Sugar (1 kg)",          category_id: 2, store_id: 3, price: 130, discount: 0,  stock: 200, unit: "pack",
    description: "Refined cane sugar. Standard kitchen staple.",
    image: "https://images.unsplash.com/photo-1610477523919-1eaab9b35a90?w=600&q=80" },

  /* Dairy & Eggs — store 3, 11, 16 */
  { id: 1011, name: "Aarong Cow Milk (1 L)",      category_id: 3, store_id: 3, price: 110, discount: 0,  stock: 50, unit: "bottle",
    description: "Pasteurized full-cream cow milk. Daily fresh from Aarong Dairy.",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80" },
  { id: 1012, name: "Farm Eggs (12 pcs)",         category_id: 3, store_id: 11, price: 165, discount: 10, stock: 75, unit: "dozen",
    description: "Free-range brown eggs from local farms. Larger yolk, deeper colour.",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80" },
  { id: 1013, name: "Sweet Curd 500 g",           category_id: 3, store_id: 16, price: 180, discount: 5,  stock: 30, unit: "pack",
    description: "Bogra-style sweet curd in a clay pot. Set overnight, cool and creamy.",
    image: "https://images.unsplash.com/photo-1571212058124-f1474429dccb?w=600&q=80" },
  { id: 1014, name: "Cheddar Block (250 g)",      category_id: 3, store_id: 3, price: 420, discount: 15, stock: 22, unit: "pack",
    description: "Imported aged cheddar. Sharp and slice-able.",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80" },
  { id: 1015, name: "Salted Butter (200 g)",      category_id: 3, store_id: 16, price: 320, discount: 0,  stock: 40, unit: "pack",
    description: "Cultured salted butter. Spread cold, melt over warm toast.",
    image: "https://images.unsplash.com/photo-1589985270958-bf087b2d4ed5?w=600&q=80" },

  /* Meat & Fish — store 4 */
  { id: 1016, name: "Beef Boneless (1 kg)",       category_id: 4, store_id: 4, price: 780, discount: 5,  stock: 25, unit: "kg",
    description: "Halal boneless beef cuts. Lean, ideal for kacchi and kebab.",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80" },
  { id: 1017, name: "Chicken Whole (1.2 kg)",     category_id: 4, store_id: 4, price: 290, discount: 10, stock: 35, unit: "piece",
    description: "Farm-raised broiler chicken, dressed and chilled.",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80" },
  { id: 1018, name: "Hilsa Fish (1 kg)",          category_id: 4, store_id: 4, price: 1450, discount: 0, stock: 12, unit: "kg",
    description: "Padma River Hilsa, medium size. Cleaned and scaled on request.",
    image: "https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=600&q=80" },
  { id: 1019, name: "Rohu Fish (1 kg)",           category_id: 4, store_id: 4, price: 380, discount: 15, stock: 28, unit: "kg",
    description: "Live Rohu carp, cleaned to order. Firm, sweet flesh.",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80" },
  { id: 1020, name: "Mutton Curry Cut (1 kg)",    category_id: 4, store_id: 4, price: 1100, discount: 5, stock: 8,  unit: "kg",
    description: "Bone-in goat mutton. Hand-cut for slow curries.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },

  /* Bakery & Bread — store 2, 16 */
  { id: 1021, name: "Sourdough Boule",            category_id: 5, store_id: 2, price: 320, discount: 0,  stock: 14, unit: "piece",
    description: "Naturally leavened country loaf. 24-hour cold ferment.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" },
  { id: 1022, name: "Almond Croissant",           category_id: 5, store_id: 2, price: 180, discount: 10, stock: 22, unit: "piece",
    description: "Buttery laminated dough, almond cream filling, toasted flakes.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80" },
  { id: 1023, name: "Brioche Loaf",               category_id: 5, store_id: 16, price: 240, discount: 5,  stock: 18, unit: "piece",
    description: "Soft, eggy brioche. Perfect for French toast.",
    image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80" },
  { id: 1024, name: "Cinnamon Roll (4 pack)",     category_id: 5, store_id: 2, price: 380, discount: 15, stock: 16, unit: "pack",
    description: "Glazed cinnamon rolls. Reheat for 30 seconds before serving.",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80" },

  /* Cold Drinks & Juice — store 7, 10 */
  { id: 1025, name: "Cold-Press Orange (500 ml)", category_id: 6, store_id: 7, price: 220, discount: 0, stock: 40, unit: "bottle",
    description: "Single-press orange juice. No water, no sugar added.",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80" },
  { id: 1026, name: "Watermelon Cooler (500 ml)", category_id: 6, store_id: 7, price: 180, discount: 10, stock: 32, unit: "bottle",
    description: "Watermelon, mint, lime. Refreshing summer pick.",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80" },
  { id: 1027, name: "Mojito Lime (500 ml)",       category_id: 6, store_id: 10, price: 150, discount: 0,  stock: 45, unit: "bottle",
    description: "Lime, mint, sparkling water. Zero sugar.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80" },
  { id: 1028, name: "Mango Lassi (400 ml)",       category_id: 6, store_id: 9, price: 160, discount: 5,  stock: 28, unit: "bottle",
    description: "Yogurt-based mango lassi, lightly sweetened with cardamom.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80" },

  /* Coffee, Tea & Boba — store 12, 2 */
  { id: 1029, name: "Single-Origin Espresso Beans (250 g)", category_id: 7, store_id: 12, price: 880, discount: 10, stock: 20, unit: "pack",
    description: "Ethiopian Yirgacheffe. Bright, floral, citrus finish.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80" },
  { id: 1030, name: "Brown Sugar Boba",           category_id: 7, store_id: 12, price: 220, discount: 0,  stock: 50, unit: "piece",
    description: "Tapioca pearls in caramelized brown sugar, topped with milk foam.",
    image: "https://images.unsplash.com/photo-1558857563-c3c63ee47e09?w=600&q=80" },
  { id: 1031, name: "Sylhet Black Tea (200 g)",   category_id: 7, store_id: 12, price: 320, discount: 5,  stock: 36, unit: "pack",
    description: "Bold black tea from Sylhet hills. Brews a deep amber cup.",
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80" },
  { id: 1032, name: "Matcha Latte Mix (100 g)",   category_id: 7, store_id: 12, price: 480, discount: 15, stock: 14, unit: "pack",
    description: "Ceremonial-grade matcha blended with cane sugar.",
    image: "https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&q=80" },

  /* Ice Cream & Desserts — store 9 */
  { id: 1033, name: "Mango Kulfi (4 pack)",       category_id: 8, store_id: 9, price: 280, discount: 0,  stock: 30, unit: "pack",
    description: "Cardamom-spiced mango kulfi. Slow-churned, no stabilizers.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80" },
  { id: 1034, name: "Dark Chocolate Tub (500 ml)",category_id: 8, store_id: 9, price: 420, discount: 10, stock: 18, unit: "pack",
    description: "70% dark chocolate ice cream. Made with Belgian cocoa.",
    image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&q=80" },
  { id: 1035, name: "Faluda Glass",               category_id: 8, store_id: 9, price: 220, discount: 5,  stock: 24, unit: "piece",
    description: "Vermicelli, rose syrup, kulfi, basil seeds. Layered classic.",
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80" },

  /* Fast Food & Snacks — store 10 */
  { id: 1036, name: "Spicy Chicken Burger",       category_id: 9, store_id: 10, price: 320, discount: 10, stock: 50, unit: "piece",
    description: "Crispy chicken thigh, jalapeño slaw, brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { id: 1037, name: "Beef Kacchi Roll",           category_id: 9, store_id: 10, price: 250, discount: 0,  stock: 40, unit: "piece",
    description: "Slow-cooked kacchi beef, onion, fresh roti, mint chutney.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80" },
  { id: 1038, name: "Fuchka (1 plate)",           category_id: 9, store_id: 10, price: 90,  discount: 0,  stock: 80, unit: "pack",
    description: "Crisp fuchka shells, chickpea-potato filling, tamarind water.",
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80" },
  { id: 1039, name: "Cheesy Fries",               category_id: 9, store_id: 10, price: 180, discount: 15, stock: 60, unit: "pack",
    description: "Golden fries, cheddar sauce, smoked paprika.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80" },

  /* Sweets & Confectionery — store 9, 10 */
  { id: 1040, name: "Rosogolla (1 kg)",           category_id: 10, store_id: 9, price: 380, discount: 5,  stock: 22, unit: "kg",
    description: "Spongy chenna in light sugar syrup. Bengali classic.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80" },
  { id: 1041, name: "Mishti Doi (500 g)",         category_id: 10, store_id: 9, price: 160, discount: 0,  stock: 30, unit: "pack",
    description: "Caramelised sweet yogurt set in a clay bowl.",
    image: "https://images.unsplash.com/photo-1571212058124-f1474429dccb?w=600&q=80" },
  { id: 1042, name: "Chum Chum Box (12 pcs)",     category_id: 10, store_id: 9, price: 420, discount: 10, stock: 18, unit: "pack",
    description: "Soft chum chum dusted with khoya and pistachio.",
    image: "https://images.unsplash.com/photo-1631452180773-65a3a4ad8c95?w=600&q=80" },

  /* Beauty & Skincare — store 5 */
  { id: 1043, name: "Vitamin C Serum (30 ml)",    category_id: 11, store_id: 5, price: 1450, discount: 20, stock: 24, unit: "bottle",
    description: "Stable 15% L-ascorbic acid with ferulic acid. Brightens dull skin.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" },
  { id: 1044, name: "Hydrating Toner (200 ml)",   category_id: 11, store_id: 5, price: 980, discount: 10, stock: 30, unit: "bottle",
    description: "Hyaluronic acid + panthenol. Lightweight, fragrance-free.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80" },
  { id: 1045, name: "Sheet Mask (5 pack)",        category_id: 11, store_id: 5, price: 750, discount: 15, stock: 40, unit: "pack",
    description: "Korean cellulose sheet masks. Niacinamide, centella, snail.",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80" },
  { id: 1046, name: "Lip Tint Velvet",            category_id: 11, store_id: 5, price: 620, discount: 5,  stock: 35, unit: "piece",
    description: "Long-wear matte tint, weightless feel, four shades.",
    image: "https://images.unsplash.com/photo-1631214540242-c0fd2bb5f5b8?w=600&q=80" },

  /* Personal Hygiene — store 5, 6, 13 */
  { id: 1047, name: "Charcoal Soap Bar",          category_id: 12, store_id: 5, price: 220, discount: 0,  stock: 60, unit: "piece",
    description: "Activated charcoal soap with shea butter. Detoxifies pores.",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80" },
  { id: 1048, name: "Bamboo Toothbrush",          category_id: 12, store_id: 13, price: 95,  discount: 10, stock: 80, unit: "piece",
    description: "Plant-based bristles, biodegradable handle.",
    image: "https://images.unsplash.com/photo-1559591935-c6c92c6e1a18?w=600&q=80" },
  { id: 1049, name: "Herbal Shampoo (300 ml)",    category_id: 12, store_id: 6, price: 380, discount: 5,  stock: 40, unit: "bottle",
    description: "Sulphate-free shampoo with amla and bhringraj.",
    image: "https://images.unsplash.com/photo-1626015449634-f8a83b2a5a7c?w=600&q=80" },

  /* Cleaning & Household — store 13, 3 */
  { id: 1050, name: "Eco Dish Liquid (1 L)",      category_id: 13, store_id: 13, price: 240, discount: 10, stock: 50, unit: "bottle",
    description: "Plant-based dish soap. Cuts grease without harsh fragrance.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80" },
  { id: 1051, name: "Microfibre Cloth (3 pack)",  category_id: 13, store_id: 3,  price: 180, discount: 0,  stock: 70, unit: "pack",
    description: "Lint-free cloths for dusting, polishing, and screens.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80" },
  { id: 1052, name: "Floor Cleaner (1.5 L)",      category_id: 13, store_id: 13, price: 320, discount: 15, stock: 36, unit: "bottle",
    description: "Phenyl-free floor disinfectant. Lemongrass scent.",
    image: "https://images.unsplash.com/photo-1605542283571-de7e0aab8e62?w=600&q=80" },

  /* Cooking & Spices — store 8 */
  { id: 1053, name: "Garam Masala (100 g)",       category_id: 14, store_id: 8, price: 180, discount: 5,  stock: 50, unit: "pack",
    description: "Hand-blended garam masala. Cardamom, clove, cinnamon, mace.",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80" },
  { id: 1054, name: "Turmeric Powder (200 g)",    category_id: 14, store_id: 8, price: 110, discount: 0,  stock: 80, unit: "pack",
    description: "Stone-ground turmeric. High curcumin content.",
    image: "https://images.unsplash.com/photo-1599909533730-3f33b2cdebe3?w=600&q=80" },
  { id: 1055, name: "Naga Chili Pickle (200 g)",  category_id: 14, store_id: 8, price: 260, discount: 10, stock: 24, unit: "bottle",
    description: "Fiery naga chili pickle. A teaspoon goes a long way.",
    image: "https://images.unsplash.com/photo-1604908176997-431f9b1d8e18?w=600&q=80" },

  /* Baby Care — store 6, 15 */
  { id: 1056, name: "Diapers M (40 pack)",        category_id: 15, store_id: 6, price: 980, discount: 15, stock: 28, unit: "pack",
    description: "Ultra-absorbent diapers, 5–10 kg. Hypoallergenic.",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80" },
  { id: 1057, name: "Baby Lotion (200 ml)",       category_id: 15, store_id: 6, price: 420, discount: 5,  stock: 32, unit: "bottle",
    description: "Pediatrician-tested lotion with chamomile.",
    image: "https://images.unsplash.com/photo-1555776648-13bbe43efeae?w=600&q=80" },
  { id: 1058, name: "Wooden Rattle Set",          category_id: 15, store_id: 15, price: 380, discount: 0,  stock: 18, unit: "pack",
    description: "Natural beechwood rattles. Non-toxic finish, smooth edges.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80" },

  /* Pharmacy & Health — store 6 */
  { id: 1059, name: "Multivitamin (60 caps)",     category_id: 16, store_id: 6, price: 580, discount: 10, stock: 35, unit: "pack",
    description: "A–Z multivitamin and minerals. Once-daily, vegan caps.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" },
  { id: 1060, name: "Digital BP Monitor",         category_id: 16, store_id: 6, price: 2400, discount: 20, stock: 8,  unit: "piece",
    description: "Upper-arm cuff, memory for 60 readings, irregular heartbeat alert.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
  { id: 1061, name: "Hand Sanitizer (250 ml)",    category_id: 16, store_id: 6, price: 180, discount: 0,  stock: 60, unit: "bottle",
    description: "70% alcohol gel with aloe. Skin-kind formula.",
    image: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&q=80" },

  /* Pet Supplies — store 14 */
  { id: 1062, name: "Premium Dog Food (3 kg)",    category_id: 17, store_id: 14, price: 1850, discount: 10, stock: 22, unit: "pack",
    description: "Chicken and rice formula, no fillers. For adult dogs.",
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&q=80" },
  { id: 1063, name: "Cat Litter (5 kg)",          category_id: 17, store_id: 14, price: 720, discount: 5,  stock: 18, unit: "pack",
    description: "Clumping bentonite, low dust, lavender scent.",
    image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&q=80" },
  { id: 1064, name: "Chew Toy (Rubber)",          category_id: 17, store_id: 14, price: 320, discount: 0,  stock: 30, unit: "piece",
    description: "Natural rubber dog toy with treat pocket.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80" },

  /* Stationery & Office — store 15 */
  { id: 1065, name: "A5 Notebook (Linen)",        category_id: 18, store_id: 15, price: 320, discount: 5,  stock: 40, unit: "piece",
    description: "Linen-bound dotted notebook, 192 pages, lay-flat binding.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80" },
  { id: 1066, name: "Gel Pen Set (10 pcs)",       category_id: 18, store_id: 15, price: 280, discount: 10, stock: 80, unit: "pack",
    description: "Smooth 0.5 mm gel pens. Quick-dry, smudge-free.",
    image: "https://images.unsplash.com/photo-1568871391351-3f6c79b09c1e?w=600&q=80" },
  { id: 1067, name: "Watercolor Pad A4",          category_id: 18, store_id: 15, price: 480, discount: 15, stock: 24, unit: "piece",
    description: "200 gsm cold-press watercolour paper, 20 sheets.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
  { id: 1068, name: "Desk Organizer Wood",        category_id: 18, store_id: 15, price: 850, discount: 20, stock: 12, unit: "piece",
    description: "Solid mango wood desk organizer with brass pen slot.",
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80" }
];

/* ------------------------------------------------------------ */

const DATA_USERS = [
  /* Customers */
  { id: 101, type: "customer", name: "Ayesha Rahman",  email: "ayesha@example.com",  phone: "+880 1811-100001", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi", area: "Dhanmondi 27",
    addresses: [
      { id: 1, label: "Home",   division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi", area: "Dhanmondi 27", street: "Road 27, House 14, Apt 3B", default: true  },
      { id: 2, label: "Office", division: "Dhaka", district: "Dhaka", upazila: "Tejgaon",   area: "Gulshan Link Road", street: "Plot 9, Floor 4", default: false }
    ],
    coins: 340, tier: "Silver", joined: "2024-08-12", notifications: { orders: true, promotions: true, nearby: false } },

  { id: 102, type: "customer", name: "Tanvir Hossain", email: "tanvir@example.com", phone: "+880 1811-100002", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
    division: "Dhaka", district: "Dhaka", upazila: "Mirpur",    area: "Mirpur 10",
    addresses: [
      { id: 1, label: "Home", division: "Dhaka", district: "Dhaka", upazila: "Mirpur", area: "Mirpur 10", street: "Sec 10, Block C, Road 4", default: true }
    ],
    coins: 1240, tier: "Platinum", joined: "2024-03-04", notifications: { orders: true, promotions: false, nearby: true } },

  { id: 103, type: "customer", name: "Nazia Karim",    email: "nazia@example.com",   phone: "+880 1811-100003", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    division: "Dhaka", district: "Dhaka", upazila: "Gulshan",   area: "Gulshan 2",
    addresses: [
      { id: 1, label: "Home", division: "Dhaka", district: "Dhaka", upazila: "Gulshan", area: "Gulshan 2", street: "Road 113, Plot 6, Apt 7A", default: true }
    ],
    coins: 75, tier: "Bronze", joined: "2025-01-19", notifications: { orders: true, promotions: true, nearby: true } },

  /* Shopkeepers */
  { id: 201, type: "shopkeeper", name: "Mizanur Rahman",   email: "mizan@sobji.com",      phone: "+880 1711-234567", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    store_id: 1, joined: "2023-11-01" },
  { id: 202, type: "shopkeeper", name: "Sadia Akter",      email: "sadia@bananibake.com", phone: "+880 1712-345678", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    store_id: 2, joined: "2023-09-21" },
  { id: 203, type: "shopkeeper", name: "Rafiq Ahmed",      email: "rafiq@gulshanmart.com",phone: "+880 1713-456789", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    store_id: 3, joined: "2023-07-14" },

  /* Admins */
  { id: 301, type: "admin", name: "Imran Hossain",  email: "imran@easymart.com", phone: "+880 1900-000001", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    role_level: "Super Admin", joined: "2023-05-02", actions_taken: 1842, shops_suspended: 7, ads_paused: 23, status: "active" },
  { id: 302, type: "admin", name: "Sara Iqbal",     email: "sara@easymart.com",  phone: "+880 1900-000002", password: "merciful",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    role_level: "Moderator",   joined: "2024-02-18", actions_taken: 612,  shops_suspended: 2, ads_paused: 9,  status: "active" }
];

/* ------------------------------------------------------------ */

const DATA_ORDERS = [
  { id: 5001, customer_id: 101, store_id: 1,  date: "2026-05-08T09:14:00", status: "Delivered",
    items: [ { product_id: 1001, name: "Himsagar Mango (1 kg)", qty: 2, price: 220, discount: 15 },
             { product_id: 1003, name: "Spinach Bunch", qty: 3, price: 35, discount: 10 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 468, total: 528 },

  { id: 5002, customer_id: 101, store_id: 2,  date: "2026-05-07T18:30:00", status: "Delivered",
    items: [ { product_id: 1021, name: "Sourdough Boule", qty: 1, price: 320, discount: 0 },
             { product_id: 1022, name: "Almond Croissant", qty: 4, price: 180, discount: 10 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 50, subtotal: 968, total: 1023 },

  { id: 5003, customer_id: 101, store_id: 5,  date: "2026-05-05T13:22:00", status: "Shipped",
    items: [ { product_id: 1043, name: "Vitamin C Serum (30 ml)", qty: 1, price: 1450, discount: 20 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: 50, coins_redeemed: 0, subtotal: 1160, total: 1144 },

  { id: 5004, customer_id: 102, store_id: 4,  date: "2026-05-08T07:45:00", status: "Preparing",
    items: [ { product_id: 1018, name: "Hilsa Fish (1 kg)", qty: 1, price: 1450, discount: 0 },
             { product_id: 1017, name: "Chicken Whole (1.2 kg)", qty: 2, price: 290, discount: 10 } ],
    delivery_type: "Store Pickup",   delivery_fee: 0,  coupon: null, coins_redeemed: 100, subtotal: 1972, total: 1872 },

  { id: 5005, customer_id: 102, store_id: 12, date: "2026-05-06T10:10:00", status: "Delivered",
    items: [ { product_id: 1029, name: "Single-Origin Espresso Beans (250 g)", qty: 2, price: 880, discount: 10 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 1584, total: 1644 },

  { id: 5006, customer_id: 102, store_id: 9,  date: "2026-05-04T20:00:00", status: "Delivered",
    items: [ { product_id: 1033, name: "Mango Kulfi (4 pack)", qty: 2, price: 280, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 560, total: 620 },

  { id: 5007, customer_id: 103, store_id: 3,  date: "2026-05-08T11:00:00", status: "Confirmed",
    items: [ { product_id: 1006, name: "Miniket Rice (5 kg)", qty: 1, price: 480, discount: 5 },
             { product_id: 1011, name: "Aarong Cow Milk (1 L)", qty: 2, price: 110, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 676, total: 736 },

  { id: 5008, customer_id: 103, store_id: 10, date: "2026-05-07T22:15:00", status: "Delivered",
    items: [ { product_id: 1036, name: "Spicy Chicken Burger", qty: 2, price: 320, discount: 10 },
             { product_id: 1039, name: "Cheesy Fries", qty: 1, price: 180, discount: 15 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 729, total: 789 },

  { id: 5009, customer_id: 103, store_id: 7,  date: "2026-05-05T16:50:00", status: "Cancelled",
    items: [ { product_id: 1025, name: "Cold-Press Orange (500 ml)", qty: 3, price: 220, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 660, total: 720 },

  { id: 5010, customer_id: 101, store_id: 8,  date: "2026-05-03T12:00:00", status: "Delivered",
    items: [ { product_id: 1053, name: "Garam Masala (100 g)", qty: 2, price: 180, discount: 5 },
             { product_id: 1055, name: "Naga Chili Pickle (200 g)", qty: 1, price: 260, discount: 10 } ],
    delivery_type: "Store Pickup",   delivery_fee: 0,  coupon: null, coins_redeemed: 0, subtotal: 576, total: 576 },

  { id: 5011, customer_id: 102, store_id: 14, date: "2026-05-02T15:00:00", status: "Delivered",
    items: [ { product_id: 1062, name: "Premium Dog Food (3 kg)", qty: 1, price: 1850, discount: 10 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 1665, total: 1725 },

  { id: 5012, customer_id: 103, store_id: 15, date: "2026-05-08T14:25:00", status: "Pending",
    items: [ { product_id: 1065, name: "A5 Notebook (Linen)", qty: 2, price: 320, discount: 5 },
             { product_id: 1066, name: "Gel Pen Set (10 pcs)", qty: 1, price: 280, discount: 10 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 860, total: 920 },

  { id: 5013, customer_id: 101, store_id: 16, date: "2026-04-30T07:00:00", status: "Delivered",
    items: [ { product_id: 1023, name: "Brioche Loaf", qty: 1, price: 240, discount: 5 },
             { product_id: 1015, name: "Salted Butter (200 g)", qty: 1, price: 320, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 548, total: 608 },

  { id: 5014, customer_id: 102, store_id: 6,  date: "2026-04-28T18:00:00", status: "Delivered",
    items: [ { product_id: 1059, name: "Multivitamin (60 caps)", qty: 1, price: 580, discount: 10 },
             { product_id: 1061, name: "Hand Sanitizer (250 ml)", qty: 2, price: 180, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 200, subtotal: 882, total: 742 },

  { id: 5015, customer_id: 103, store_id: 13, date: "2026-04-27T11:30:00", status: "Delivered",
    items: [ { product_id: 1050, name: "Eco Dish Liquid (1 L)", qty: 2, price: 240, discount: 10 },
             { product_id: 1052, name: "Floor Cleaner (1.5 L)", qty: 1, price: 320, discount: 15 } ],
    delivery_type: "Store Pickup",   delivery_fee: 0,  coupon: null, coins_redeemed: 0, subtotal: 704, total: 704 },

  { id: 5016, customer_id: 101, store_id: 11, date: "2026-04-25T09:00:00", status: "Delivered",
    items: [ { product_id: 1004, name: "Sundarban Honey (500 g)", qty: 1, price: 680, discount: 5 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 646, total: 706 },

  { id: 5017, customer_id: 102, store_id: 12, date: "2026-04-24T08:30:00", status: "Delivered",
    items: [ { product_id: 1031, name: "Sylhet Black Tea (200 g)", qty: 2, price: 320, discount: 5 },
             { product_id: 1030, name: "Brown Sugar Boba", qty: 1, price: 220, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 828, total: 888 },

  { id: 5018, customer_id: 103, store_id: 5,  date: "2026-04-22T17:45:00", status: "Delivered",
    items: [ { product_id: 1045, name: "Sheet Mask (5 pack)", qty: 2, price: 750, discount: 15 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: 50, coins_redeemed: 0, subtotal: 1275, total: 1208 },

  { id: 5019, customer_id: 101, store_id: 4,  date: "2026-04-20T07:30:00", status: "Delivered",
    items: [ { product_id: 1019, name: "Rohu Fish (1 kg)", qty: 2, price: 380, discount: 15 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 646, total: 706 },

  { id: 5020, customer_id: 102, store_id: 9,  date: "2026-04-18T21:00:00", status: "Delivered",
    items: [ { product_id: 1040, name: "Rosogolla (1 kg)", qty: 1, price: 380, discount: 5 },
             { product_id: 1041, name: "Mishti Doi (500 g)", qty: 2, price: 160, discount: 0 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 681, total: 741 },

  { id: 5021, customer_id: 103, store_id: 2,  date: "2026-04-15T08:00:00", status: "Delivered",
    items: [ { product_id: 1024, name: "Cinnamon Roll (4 pack)", qty: 1, price: 380, discount: 15 } ],
    delivery_type: "Home Delivery", delivery_fee: 60, coupon: null, coins_redeemed: 0, subtotal: 323, total: 383 }
];

/* ------------------------------------------------------------ */

const DATA_ADVERTISEMENTS = [
  { id: 9001, store_id: 5,  product_id: 1043, title: "Glow Season — 20% Off Vitamin C",   banner: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
    status: "Active",  views: 3420, clicks: 412, start: "2026-05-01", end: "2026-05-31", created_by: 205 },
  { id: 9002, store_id: 9,  product_id: 1033, title: "Mango Kulfi — Scoop Up Summer",     banner: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=1200&q=80",
    status: "Active",  views: 1980, clicks: 267, start: "2026-05-03", end: "2026-05-25", created_by: 209 },
  { id: 9003, store_id: 12, product_id: 1029, title: "Yirgacheffe — 10% Off Single Origin",banner: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80",
    status: "Active",  views: 2670, clicks: 304, start: "2026-04-28", end: "2026-05-28", created_by: 212 },
  { id: 9004, store_id: 4,  product_id: 1019, title: "Rohu Fish — 15% Off Fresh Catch",   banner: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=1200&q=80",
    status: "Active",  views: 1450, clicks: 189, start: "2026-05-05", end: "2026-05-20", created_by: 204 },
  { id: 9005, store_id: 2,  product_id: 1024, title: "Cinnamon Roll Wednesdays",          banner: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80",
    status: "Paused",  views: 980,  clicks: 88,  start: "2026-04-20", end: "2026-05-15", created_by: 202 },
  { id: 9006, store_id: 7,  product_id: 1025, title: "Cold-Press Orange — Healthy Pour",  banner: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200&q=80",
    status: "Active",  views: 1740, clicks: 198, start: "2026-05-02", end: "2026-05-25", created_by: 207 },
  { id: 9007, store_id: 10, product_id: 1036, title: "Late-Night Burgers — 10% Off",      banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
    status: "Expired", views: 4220, clicks: 510, start: "2026-03-15", end: "2026-04-30", created_by: 210 }
];

/* ------------------------------------------------------------ */

const DATA_COINS = [
  /* Customer 101 — Ayesha */
  { id: 1, customer_id: 101, date: "2026-05-08T09:30:00", action: "Order placed (#5001)",      change: +52,  balance: 340 },
  { id: 2, customer_id: 101, date: "2026-05-07T19:00:00", action: "Order placed (#5002)",      change: +102, balance: 288 },
  { id: 3, customer_id: 101, date: "2026-05-07T18:45:00", action: "Coins redeemed (#5002)",    change: -50,  balance: 186 },
  { id: 4, customer_id: 101, date: "2026-05-06T08:00:00", action: "Daily login bonus",         change: +2,   balance: 236 },
  { id: 5, customer_id: 101, date: "2026-05-05T13:50:00", action: "Order placed (#5003)",      change: +114, balance: 234 },
  { id: 6, customer_id: 101, date: "2026-05-04T10:00:00", action: "Review submitted",          change: +10,  balance: 120 },
  { id: 7, customer_id: 101, date: "2026-05-03T12:30:00", action: "Order placed (#5010)",      change: +57,  balance: 110 },
  { id: 8, customer_id: 101, date: "2026-04-25T09:30:00", action: "Order placed (#5016)",      change: +70,  balance: 53  },

  /* Customer 102 — Tanvir */
  { id: 9,  customer_id: 102, date: "2026-05-08T08:00:00", action: "Order placed (#5004)",     change: +187, balance: 1240 },
  { id: 10, customer_id: 102, date: "2026-05-08T07:50:00", action: "Coins redeemed (#5004)",   change: -100, balance: 1053 },
  { id: 11, customer_id: 102, date: "2026-05-06T10:30:00", action: "Order placed (#5005)",     change: +164, balance: 1153 },
  { id: 12, customer_id: 102, date: "2026-05-04T20:30:00", action: "Order placed (#5006)",     change: +62,  balance: 989  },
  { id: 13, customer_id: 102, date: "2026-04-28T18:30:00", action: "Order placed (#5014)",     change: +74,  balance: 927  },
  { id: 14, customer_id: 102, date: "2026-04-28T18:15:00", action: "Coins redeemed (#5014)",   change: -200, balance: 853  },
  { id: 15, customer_id: 102, date: "2026-04-24T09:00:00", action: "Order placed (#5017)",     change: +88,  balance: 1053 },

  /* Customer 103 — Nazia */
  { id: 16, customer_id: 103, date: "2026-05-08T11:30:00", action: "Order placed (#5007)",     change: +73,  balance: 75  },
  { id: 17, customer_id: 103, date: "2026-05-07T22:30:00", action: "Order placed (#5008)",     change: +78,  balance: 2   },
  { id: 18, customer_id: 103, date: "2026-04-22T18:00:00", action: "Daily login bonus",        change: +2,   balance: -76 }
];

/* ------------------------------------------------------------ */

const DATA_AUDIT_LOGS = [
  { id: 1,  datetime: "2026-05-08T11:30:00", user_id: 103, user_name: "Nazia Karim",      user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5007, description: "Placed order #5007 at Gulshan Daily Mart" },
  { id: 2,  datetime: "2026-05-08T11:00:00", user_id: 103, user_name: "Nazia Karim",      user_type: "customer",   action: "LOGIN",   entity: "users",    entity_id: 103,  description: "Logged in" },
  { id: 3,  datetime: "2026-05-08T10:14:00", user_id: 301, user_name: "Imran Hossain",    user_type: "admin",      action: "SUSPEND", entity: "shops",    entity_id: 999,  description: "Suspended shop pending review (test entry)" },
  { id: 4,  datetime: "2026-05-08T09:30:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5001, description: "Placed order #5001 at Sobji Bazar Fresh" },
  { id: 5,  datetime: "2026-05-08T09:14:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "LOGIN",   entity: "users",    entity_id: 101,  description: "Logged in" },
  { id: 6,  datetime: "2026-05-08T08:00:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5004, description: "Placed order #5004 at Mirpur Meat & Fish Co." },
  { id: 7,  datetime: "2026-05-08T07:00:00", user_id: 201, user_name: "Mizanur Rahman",   user_type: "shopkeeper", action: "UPDATE",  entity: "products", entity_id: 1003, description: "Updated stock for Spinach Bunch (60 → 80)" },
  { id: 8,  datetime: "2026-05-08T06:45:00", user_id: 201, user_name: "Mizanur Rahman",   user_type: "shopkeeper", action: "LOGIN",   entity: "users",    entity_id: 201,  description: "Logged in" },
  { id: 9,  datetime: "2026-05-07T22:30:00", user_id: 103, user_name: "Nazia Karim",      user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5008, description: "Placed order #5008 at Kalabagan Quick Bites" },
  { id: 10, datetime: "2026-05-07T20:10:00", user_id: 302, user_name: "Sara Iqbal",       user_type: "admin",      action: "UPDATE",  entity: "ads",      entity_id: 9005, description: "Paused ad — Cinnamon Roll Wednesdays" },
  { id: 11, datetime: "2026-05-07T19:00:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5002, description: "Placed order #5002 at Banani Bake House" },
  { id: 12, datetime: "2026-05-07T18:45:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "UPDATE",  entity: "coins",    entity_id: 101,  description: "Redeemed 50 coins on order #5002" },
  { id: 13, datetime: "2026-05-07T15:30:00", user_id: 202, user_name: "Sadia Akter",      user_type: "shopkeeper", action: "CREATE",  entity: "products", entity_id: 1024, description: "Added Cinnamon Roll (4 pack)" },
  { id: 14, datetime: "2026-05-07T14:00:00", user_id: 203, user_name: "Rafiq Ahmed",      user_type: "shopkeeper", action: "UPDATE",  entity: "shops",    entity_id: 3,    description: "Updated shop hours — now 24 hours" },
  { id: 15, datetime: "2026-05-07T11:20:00", user_id: 301, user_name: "Imran Hossain",    user_type: "admin",      action: "LOGIN",   entity: "users",    entity_id: 301,  description: "Logged in" },
  { id: 16, datetime: "2026-05-07T10:00:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "UPDATE",  entity: "users",    entity_id: 102,  description: "Updated profile — phone number" },
  { id: 17, datetime: "2026-05-07T09:30:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "UPDATE",  entity: "reviews",  entity_id: 5005, description: "Reviewed order #5005 — 5 stars" },
  { id: 18, datetime: "2026-05-06T18:00:00", user_id: 205, user_name: "Uttara Beauty Lounge", user_type: "shopkeeper", action: "CREATE", entity: "ads", entity_id: 9001, description: "Created ad — Glow Season Vitamin C" },
  { id: 19, datetime: "2026-05-06T15:45:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "reviews",  entity_id: 5010, description: "Reviewed order #5010 — 4 stars" },
  { id: 20, datetime: "2026-05-06T08:00:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "UPDATE",  entity: "coins",    entity_id: 101,  description: "Daily login bonus — earned 2 coins" },
  { id: 21, datetime: "2026-05-05T16:50:00", user_id: 103, user_name: "Nazia Karim",      user_type: "customer",   action: "UPDATE",  entity: "orders",   entity_id: 5009, description: "Cancelled order #5009" },
  { id: 22, datetime: "2026-05-05T13:22:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5003, description: "Placed order #5003 at Uttara Beauty Lounge" },
  { id: 23, datetime: "2026-05-05T10:00:00", user_id: 204, user_name: "Mirpur Meat & Fish Co.", user_type: "shopkeeper", action: "UPDATE", entity: "products", entity_id: 1018, description: "Updated price for Hilsa Fish (1300 → 1450)" },
  { id: 24, datetime: "2026-05-05T08:30:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "CREATE",  entity: "favorites",entity_id: 12,   description: "Added Tejgaon Coffee Atelier to favorites" },
  { id: 25, datetime: "2026-05-04T20:30:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5006, description: "Placed order #5006 at Shyamoli Scoops" },
  { id: 26, datetime: "2026-05-04T11:00:00", user_id: 302, user_name: "Sara Iqbal",       user_type: "admin",      action: "UPDATE",  entity: "users",    entity_id: 215,  description: "Updated admin moderator permissions" },
  { id: 27, datetime: "2026-05-03T12:30:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5010, description: "Placed order #5010 at Rayer Bazar Spice House" },
  { id: 28, datetime: "2026-05-03T09:00:00", user_id: 207, user_name: "Bashundhara Cold Press", user_type: "shopkeeper", action: "CREATE", entity: "ads", entity_id: 9006, description: "Created ad — Cold-Press Orange" },
  { id: 29, datetime: "2026-05-02T15:00:00", user_id: 102, user_name: "Tanvir Hossain",   user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5011, description: "Placed order #5011 at Badda Pet Pavilion" },
  { id: 30, datetime: "2026-05-01T10:00:00", user_id: 301, user_name: "Imran Hossain",    user_type: "admin",      action: "UPDATE",  entity: "ads",      entity_id: 9001, description: "Curated Vitamin C Serum into homepage slider" },
  { id: 31, datetime: "2026-04-30T07:00:00", user_id: 101, user_name: "Ayesha Rahman",    user_type: "customer",   action: "CREATE",  entity: "orders",   entity_id: 5013, description: "Placed order #5013 at Dhanmondi Daily Loaf" },
  { id: 32, datetime: "2026-04-29T19:00:00", user_id: 209, user_name: "Shyamoli Scoops",  user_type: "shopkeeper", action: "UPDATE",  entity: "products", entity_id: 1034, description: "Updated discount for Dark Chocolate Tub (5% → 10%)" }
];

/* ------------------------------------------------------------ */

const DATA_ANALYTICS = {
  /* Per-shopkeeper aggregates — keyed by store_id */
  store: {
    1:  { revenue_week: 28400, orders_week: 64,  avg_order: 444, customers: 41 },
    2:  { revenue_week: 41200, orders_week: 92,  avg_order: 448, customers: 58 },
    3:  { revenue_week: 67800, orders_week: 138, avg_order: 491, customers: 84 },
    4:  { revenue_week: 52600, orders_week: 71,  avg_order: 741, customers: 49 },
    5:  { revenue_week: 38900, orders_week: 47,  avg_order: 828, customers: 35 },
    6:  { revenue_week: 33500, orders_week: 78,  avg_order: 429, customers: 56 },
    7:  { revenue_week: 17200, orders_week: 51,  avg_order: 337, customers: 38 },
    8:  { revenue_week: 14600, orders_week: 44,  avg_order: 332, customers: 30 },
    9:  { revenue_week: 22300, orders_week: 73,  avg_order: 305, customers: 51 },
    10: { revenue_week: 39400, orders_week: 124, avg_order: 318, customers: 88 },
    11: { revenue_week: 25800, orders_week: 58,  avg_order: 445, customers: 42 },
    12: { revenue_week: 31200, orders_week: 82,  avg_order: 380, customers: 60 },
    13: { revenue_week: 12400, orders_week: 39,  avg_order: 318, customers: 28 },
    14: { revenue_week: 18900, orders_week: 31,  avg_order: 610, customers: 24 },
    15: { revenue_week: 9800,  orders_week: 36,  avg_order: 272, customers: 27 },
    16: { revenue_week: 21500, orders_week: 67,  avg_order: 321, customers: 47 }
  },
  /* Platform-wide aggregates */
  platform: {
    total_users: 8420, total_shops: 16, total_products: 68, orders_today: 47,
    new_customers_per_day: [12, 18, 14, 21, 17, 26, 23],
    new_shopkeepers_per_day: [1, 0, 2, 1, 1, 3, 2],
    revenue_per_week: [218000, 245000, 289000, 312000, 358000, 401000, 472500],
    category_share: [
      { name: "Grocery & Staples",    value: 22 },
      { name: "Fruits & Vegetables",  value: 18 },
      { name: "Fast Food & Snacks",   value: 14 },
      { name: "Dairy & Eggs",         value: 11 },
      { name: "Bakery & Bread",       value: 9  },
      { name: "Coffee, Tea & Boba",   value: 8  },
      { name: "Beauty & Skincare",    value: 7  },
      { name: "Other",                value: 11 }
    ],
    most_searched: [
      { term: "hilsa fish",      count: 412 },
      { term: "miniket rice",    count: 387 },
      { term: "vitamin c serum", count: 264 },
      { term: "sourdough",       count: 198 },
      { term: "mango kulfi",     count: 173 },
      { term: "dog food",        count: 142 }
    ],
    most_active_areas: [
      { name: "Dhanmondi",   activity: 1240 },
      { name: "Gulshan",     activity: 1080 },
      { name: "Mirpur 10",   activity:  890 },
      { name: "Banani",      activity:  812 },
      { name: "Uttara",      activity:  704 },
      { name: "Mohammadpur", activity:  651 }
    ],
    funnel: [
      { step: "Search", count: 12480 },
      { step: "View",   count:  7820 },
      { step: "Cart",   count:  3210 },
      { step: "Order",  count:  1840 }
    ],
    /* Customer-facing chart series — order timeline by hour */
    orders_per_hour: [2, 1, 0, 0, 0, 0, 4, 12, 22, 31, 38, 44, 52, 41, 33, 38, 47, 58, 71, 64, 49, 32, 18, 9],
    /* Per-day order counts for a shopkeeper-style line chart */
    orders_per_day_30:  [12,15,18,14,17,21,19,23,27,22,26,31,28,34,29,33,38,41,36,42,45,39,47,44,49,52,48,55,51,58]
  }
};

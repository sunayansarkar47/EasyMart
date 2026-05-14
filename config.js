/* ============================================================
   config.js — Supabase configuration
   ------------------------------------------------------------
   1. Create a Supabase project at https://supabase.com
   2. Go to Project Settings → API
   3. Copy the "Project URL" and the "anon / public" API key
   4. Paste them below, replacing YOUR_SUPABASE_URL and
      YOUR_SUPABASE_ANON_KEY.
   5. Open the Supabase SQL Editor and run schema.sql once.
   6. Reload the site — you're now on Supabase.

   While these placeholders are unchanged, the site automatically
   falls back to the bundled demo data (js/data.js + localStorage),
   so it works offline / out-of-the-box for development.

   The anon key is safe to expose in client-side code: Row Level
   Security policies in schema.sql restrict what each role can
   read and write.
   ============================================================ */

window.EASYMART_CONFIG = {
  SUPABASE_URL:      "https://xzczljgkjdoazefowyze.supabase.co",       // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Y3psamdramRvYXplZm93eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDgwODQsImV4cCI6MjA5NDI4NDA4NH0.n8Vk17A5JyV9sf2HP2QEAS09YaU_on7OVg1Nj9TBDfM"   // looks like "eyJhbGciOi..."
};

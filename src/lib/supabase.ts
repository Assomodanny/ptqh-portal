/**
 * Supabase client for the school's EXISTING project.
 * Publishable anon key — safe for browser use. No new project is provisioned here.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rupickfdkegwguhkdntz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cGlja2Zka2Vnd2d1aGtkbnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjgwNzQsImV4cCI6MjEwMzQ0NDA3NH0.2B15F4ocLWXJZ5ylHz0xLNAYYgZGrcv4j49FcmSUlCM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

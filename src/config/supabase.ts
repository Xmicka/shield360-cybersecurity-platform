import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration.
 *
 * Configuration values can come from two sources:
 *   1. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local` (preferred)
 *   2. Embedded fallbacks below
 *
 * The Supabase anon key is designed to be shipped with the client. Security is
 * enforced via Row-Level Security (RLS) policies on the database.
 *
 * The service_role key MUST NEVER appear in client code. It bypasses RLS.
 */

const FALLBACK_URL = "https://jpkorchkgrxtskispfsj.supabase.co";
const FALLBACK_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwa29yY2hrZ3J4dHNraXNwZnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjcyNDgsImV4cCI6MjA5MzMwMzI0OH0.n4F1pNCTFu35OVsfop3QAo22RaKd7TNdkD44Gh00mgg";

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const supabaseUrl = env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export const SUPABASE_URL = supabaseUrl;

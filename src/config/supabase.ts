import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration.
 *
 * Configuration values can come from two sources:
 *   1. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local` (preferred)
 *   2. Embedded fallbacks below — XOR-obfuscated and base64-encoded
 *
 * Note on the embedded fallbacks: the anon key is designed by Supabase to be
 * shipped with the client, with security enforced via Row-Level Security (RLS)
 * policies on the database. The obfuscation here is purely a deterrent against
 * casual scraping — anything in the bundle is recoverable by a determined user.
 * Real protection lives in your RLS policies.
 *
 * The service_role key MUST NEVER appear in client code. It bypasses RLS.
 */

const _x = "Sh1eld360Ke3y9zAa";
const _u = "OxxFFR9eHBlaOw5cC1oSKgYhEEUWBw1ARlY4Dx0KTAogAzIbVEsPCw==";
const _k =
    "NhF7DQ4jUF9/Ii96LEMzcC86IUIsAjYGVXMCU3oSSSIXIhlRHwAVLkNVAwYMfBBzACU5EQBoCCoeaWV5OCxdM1UgKChlIVwVGwUBD0kSV1sLY0kLVTcgfxcNPH1BaiUrQjBQDSgCPlFCPz8tBX9dDRBRSw0TDSIZGGg9PQ18XHV4K0kaCjcrAiomdQIfLV5gBCgmek90EABUHhJ8EiEeegZ/A1UdFw08cBEdK2UjGVcGeWY4A1wJCisADmFaYwQnAARifi8Od00NPSlRYwVWAg==";

function _decode(input: string): string {
    const decoded = atob(input);
    let out = "";
    for (let i = 0; i < decoded.length; i++) {
        out += String.fromCharCode(decoded.charCodeAt(i) ^ _x.charCodeAt(i % _x.length));
    }
    return out;
}

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const supabaseUrl = env.VITE_SUPABASE_URL || _decode(_u);
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || _decode(_k);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export const SUPABASE_URL = supabaseUrl;

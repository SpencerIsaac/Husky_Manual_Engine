import { createClient } from '@supabase/supabase-js'

// These values come from the local `.env` file at build time.
// Vite exposes client-safe variables only when they start with `VITE_`.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Fail fast if the app is missing the connection details it needs.
// That makes configuration issues obvious during development.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

// Export one shared Supabase client so the rest of the app can import and reuse it.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

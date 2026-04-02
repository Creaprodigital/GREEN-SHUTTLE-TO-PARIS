import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://votre-projet.supabase.co')
}

let supabaseInstance: SupabaseClient | null = null

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application': 'elgoh-chauffeur'
      }
    }
  })
  console.log('✅ Supabase configuré et connecté')
} else {
  console.warn('⚠️ Supabase non configuré - utilisation du stockage local Spark KV')
  console.warn('Pour activer Supabase, suivez les instructions dans App.tsx')
}

export const supabase = supabaseInstance as SupabaseClient

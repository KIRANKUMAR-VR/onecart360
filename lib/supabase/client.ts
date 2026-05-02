import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[v0] Missing Supabase environment variables:', {
      url: supabaseUrl ? 'set' : 'missing',
      anonKey: supabaseAnonKey ? 'set' : 'missing',
    })
    throw new Error('Missing Supabase credentials')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  )
}

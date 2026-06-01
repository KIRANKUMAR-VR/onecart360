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

/**
 * Browser client configured for the IMPLICIT auth flow.
 *
 * Use this ONLY for sending password-reset emails.
 *
 * WHY: The default PKCE client makes resetPasswordForEmail() generate a
 * `pkce_`-prefixed token AND store a secret code-verifier in the browser that
 * requested it. verifyOtp() then needs that verifier to succeed — which means
 * the reset link only works on the exact same browser/device that requested it.
 * Password-reset emails are almost always opened on a different device, so the
 * verifier is missing and the link fails ("invalid/expired").
 *
 * The implicit flow generates a plain recovery token (no `pkce_` prefix) that
 * verifyOtp() can confirm on ANY device with no stored verifier, while staying
 * scanner-safe because verification still happens in client-side JavaScript.
 */
export function createImplicitClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: 'implicit' },
  })
}

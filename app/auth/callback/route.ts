import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Auth Callback Route
 *
 * Supabase sends users here after clicking an email link.
 * The URL contains either:
 *   - ?code=XXX  (PKCE flow — default for modern Supabase)
 *   - #access_token=XXX&type=recovery  (implicit/hash flow — legacy)
 *
 * CRITICAL: For password recovery, we must NOT exchange the code server-side.
 * Reason: The proxy middleware calls supabase.auth.getUser() on every request,
 * which refreshes the session. If we exchange server-side and then redirect,
 * the proxy consumes the recovery session before the client page loads.
 * The client then cannot call updateUser() because the session is gone.
 *
 * Solution: Forward the raw code to /auth/reset-password and let the CLIENT
 * call exchangeCodeForSession() exactly once, after which it owns the session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type')         // Supabase sets this on its verify URLs
  const tokenHash = searchParams.get('token_hash') // alternative token format
  const next = searchParams.get('next') ?? '/'

  // ── Recovery flow (PKCE) ──────────────────────────────────────────────────
  // Supabase appends ?type=recovery to the callback URL for password resets.
  // Forward the raw code to the reset-password page for CLIENT-side exchange.
  if (code && type === 'recovery') {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('code', code)
    return NextResponse.redirect(url.toString())
  }

  // ── Recovery flow (token_hash) ────────────────────────────────────────────
  // Some Supabase email templates use token_hash + type instead of a PKCE code.
  if (tokenHash && type === 'recovery') {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // ── Hash-fragment flow ────────────────────────────────────────────────────
  // The server never sees URL hash fragments (#access_token=...&type=recovery).
  // If there is no code and type is recovery, redirect cleanly so the client
  // JS can read window.location.hash and fire PASSWORD_RECOVERY.
  if (!code && type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // ── All other flows (email confirm, OAuth, magic link) ────────────────────
  // These are safe to exchange server-side — the proxy consuming the session
  // is fine because subsequent requests just use the refreshed session cookie.
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

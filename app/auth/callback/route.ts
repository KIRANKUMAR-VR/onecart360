import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * /auth/callback — handles all Supabase email redirect flows (PKCE).
 *
 * Supabase appends ?code=XXX to whatever redirectTo URL we specify.
 * For password reset we set redirectTo to:
 *   https://onecart360.com/auth/callback?next=/auth/reset-password
 *
 * So this route receives:
 *   ?code=XXX&next=/auth/reset-password
 *
 * We exchange the code server-side (sets session cookies), then redirect
 * to the `next` param. The reset-password page reads the session from
 * the cookie and shows the new-password form.
 *
 * For token_hash flows (OTP email templates) we forward to reset-password
 * for client-side verifyOtp().
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')
  const next      = searchParams.get('next') ?? '/dashboard'

  // ── token_hash / OTP flow ─────────────────────────────────────────────────
  if (tokenHash) {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', type ?? 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // ── PKCE code flow ────────────────────────────────────────────────────────
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Link expired or already used — send to reset-password with error param
      // (the reset-password page has better UX for this case)
      return NextResponse.redirect(
        `${origin}/auth/reset-password?error=invalid_token`
      )
    }

    // Redirect to wherever `next` says — for password reset this is
    // /auth/reset-password, which reads the session cookie we just set.
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Auth Callback — handles all Supabase email link flows.
 *
 * For password recovery the flow is:
 *   1. Supabase emails: https://onecart360.com/auth/callback?code=XXX
 *   2. This route exchanges the code server-side → session cookies set
 *   3. Redirects to /auth/reset-password
 *   4. The reset-password page uses onAuthStateChange to pick up the
 *      PASSWORD_RECOVERY event fired by the Supabase JS client when it
 *      detects the server-set session on load.
 *
 * The proxy's getUser() runs AFTER the cookies are set by exchangeCodeForSession,
 * so it refreshes (not consumes) the session. updateUser() then succeeds because
 * the session cookie is valid and the client picks it up via onAuthStateChange.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')
  const next      = searchParams.get('next') ?? '/dashboard'

  console.log('[auth/callback] hit — code:', !!code, '| token_hash:', !!tokenHash, '| type:', type)

  // ── PKCE code flow (primary — used by modern Supabase) ────────────────────
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[auth/callback] exchange result — user:', data?.user?.id ?? null, '| error:', error?.message ?? null)

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
      return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`)
    }

    // Detect recovery: Supabase sets type=recovery in the URL it generates,
    // OR we can check if the user arrived via a password recovery flow by
    // looking at the AMR (Authentication Methods Reference) claims.
    const isRecovery =
      type === 'recovery' ||
      (data.session?.user?.recovery_sent_at &&
        new Date(data.session.user.recovery_sent_at).getTime() >
          Date.now() - 24 * 60 * 60 * 1000) // within 24h

    console.log('[auth/callback] isRecovery:', isRecovery)

    if (isRecovery) {
      // Redirect to reset-password. The session is now in cookies.
      // The client page uses onAuthStateChange which fires PASSWORD_RECOVERY
      // when the Supabase JS client initialises and finds the recovery session.
      return NextResponse.redirect(`${origin}/auth/reset-password`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  // ── token_hash flow (alternative Supabase email template format) ──────────
  if (tokenHash && type === 'recovery') {
    console.log('[auth/callback] token_hash recovery flow')
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // ── Hash-fragment flow — server never sees #access_token ─────────────────
  // The client JS reads window.location.hash and fires PASSWORD_RECOVERY.
  if (type === 'recovery') {
    console.log('[auth/callback] hash-fragment recovery flow — redirecting to reset-password')
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  console.log('[auth/callback] no code/token — redirecting to login')
  return NextResponse.redirect(`${origin}/auth/login`)
}

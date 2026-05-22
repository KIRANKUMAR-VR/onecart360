import { NextRequest, NextResponse } from 'next/server'

/**
 * Auth Callback — handles all Supabase email link flows.
 *
 * PASSWORD RECOVERY FLOW (mobile-safe):
 *   1. Supabase emails: https://onecart360.com/auth/callback?code=XXX
 *   2. This route detects the recovery type and forwards the raw code to
 *      /auth/reset-password?code=XXX — NO server-side exchange.
 *   3. The client page calls exchangeCodeForSession(code) in the browser.
 *
 * WHY NOT SERVER-SIDE EXCHANGE FOR RECOVERY:
 *   On iPhone Safari / Gmail in-app browser, cookies set during a cross-origin
 *   redirect chain (Supabase → your app) are blocked by SameSite=Lax policy.
 *   The session cookie from exchangeCodeForSession never reaches the browser.
 *   The client finds no session, and after the timeout shows "Link Expired".
 *   Passing the raw code to the client and exchanging there bypasses this
 *   entirely — no cookies needed for the exchange itself.
 *
 * ALL OTHER FLOWS (email confirm, OAuth, magic link):
 *   Exchanged server-side as normal — these don't have the same issue because
 *   they redirect to a page that doesn't require the session to be available
 *   immediately in the same render cycle.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')
  const next      = searchParams.get('next') ?? '/dashboard'

  // ── Password recovery — forward code to client ────────────────────────────
  // For recovery flows we NEVER exchange server-side. We pass the raw code
  // to the reset-password page so the client exchanges it in the browser,
  // which works correctly on all mobile browsers including iPhone Safari and
  // Gmail in-app browser (avoids SameSite cookie restrictions).
  if (type === 'recovery') {
    const url = new URL(`${origin}/auth/reset-password`)
    if (code)      url.searchParams.set('code', code)
    if (tokenHash) url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // ── PKCE code flow — all other flows (email confirm, OAuth, etc.) ─────────
  if (code) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  // ── token_hash without type=recovery — forward to reset-password ──────────
  if (tokenHash) {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', type ?? 'recovery')
    return NextResponse.redirect(url.toString())
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

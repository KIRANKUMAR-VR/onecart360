import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * /auth/callback — PKCE code exchange handler.
 *
 * The email template links directly to:
 *   {{ .SiteURL }}/auth/callback?code={{ .Code }}&next=/auth/reset-password
 *
 * So this route receives ?code=XXX&next=/auth/reset-password
 * We exchange the code, set session cookies, then redirect to `next`.
 *
 * For token_hash (OTP-style templates) we forward directly to reset-password.
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
      return NextResponse.redirect(
        `${origin}/auth/forgot-password?error=link_expired`
      )
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

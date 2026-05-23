import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Auth Callback — handles all Supabase email link flows.
 *
 * PKCE PASSWORD RECOVERY FLOW:
 *   Supabase emails a link to:  https://onecart360.com/auth/callback?code=XXX
 *   There is NO ?type=recovery in PKCE mode — Supabase does not add it.
 *   We detect recovery by inspecting the user's `recovery_sent_at` field
 *   after exchangeCodeForSession(). If recovery_sent_at is recent (within
 *   10 minutes), this is a password reset flow → redirect to reset-password
 *   with a ?recovered=1 flag so the client knows to show the form.
 *
 * WHY ?recovered=1 AND NOT FORWARDING THE CODE:
 *   The server has already exchanged the code and set the session cookie.
 *   The browser client reads that cookie and has a valid session immediately.
 *   We just need to signal "go to reset-password" without any further exchange.
 *
 * OTP / token_hash FLOW (Supabase email templates using {{ .ConfirmationURL }}):
 *   These come with ?token_hash=XXX&type=recovery — forwarded to reset-password
 *   for client-side verifyOtp().
 *
 * HASH FRAGMENT FLOW (#access_token=...&type=recovery):
 *   The server never sees hash fragments. We redirect to reset-password and
 *   the client's onAuthStateChange fires PASSWORD_RECOVERY automatically.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')
  const next      = searchParams.get('next') ?? '/dashboard'

  // ── OTP / token_hash flow ─────────────────────────────────────────────────
  // type=recovery is present — forward to reset-password for client-side verifyOtp
  if (tokenHash) {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('token_hash', tokenHash)
    url.searchParams.set('type', type ?? 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // ── PKCE code flow ────────────────────────────────────────────────────────
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`)
    }

    // Detect password recovery: Supabase sets recovery_sent_at on the user
    // when a reset email is sent. If it's within the last 10 minutes, this
    // is a password reset flow.
    const user = data.user
    const recoverySentAt = user?.recovery_sent_at
      ? new Date(user.recovery_sent_at).getTime()
      : null
    const isRecovery =
      type === 'recovery' ||
      (recoverySentAt !== null && Date.now() - recoverySentAt < 10 * 60 * 1000)

    if (isRecovery) {
      // Session is already set via cookies — just redirect, no code needed
      return NextResponse.redirect(`${origin}/auth/reset-password?recovered=1`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

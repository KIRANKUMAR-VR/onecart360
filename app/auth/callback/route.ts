import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    // No code — could be a hash-fragment flow (#access_token=...&type=recovery).
    // The server never sees hash fragments. Send to reset-password and let the
    // client-side Supabase JS detect the token from window.location.hash.
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // Exchange the PKCE code for a session server-side.
  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/auth/reset-password?error=invalid_token`)
  }

  // Detect if this is a password recovery flow by inspecting the session's
  // AMR (Authentication Methods Reference) claims. Supabase sets amr to
  // ["otp"] with a method of "otp" for recovery sessions.
  // This is more reliable than reading ?type= from the URL.
  const amr = (data.session as { amr?: Array<{ method: string }> } | null)?.amr
  const isRecovery =
    Array.isArray(amr) && amr.some((a) => a.method === 'otp') &&
    data.session?.user?.recovery_sent_at != null

  if (isRecovery) {
    // Pass the code to reset-password so the CLIENT re-exchanges it.
    // The server session is about to be consumed by the proxy's getUser(),
    // so we cannot rely on the server-side session surviving to the next page.
    // The client will call exchangeCodeForSession(code) again — Supabase
    // handles duplicate exchanges gracefully when using PKCE.
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('code', code)
    return NextResponse.redirect(url.toString())
  }

  // All other flows (email confirm, OAuth, magic link): use the server session.
  return NextResponse.redirect(`${origin}${next}`)
}

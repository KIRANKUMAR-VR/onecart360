import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  // For recovery flows: redirect to reset-password WITH the code in the URL
  // so the CLIENT can exchange it via exchangeCodeForSession().
  // We must NOT exchange the code server-side for recovery — the server-side
  // session gets consumed by the proxy's getUser() before the page loads,
  // leaving the client with no valid session to call updateUser().
  if (type === 'recovery' && code) {
    const url = new URL(`${origin}/auth/reset-password`)
    url.searchParams.set('code', code)
    url.searchParams.set('type', 'recovery')
    return NextResponse.redirect(url.toString())
  }

  // Hash-fragment recovery (#access_token=...&type=recovery):
  // The server never sees hash fragments — redirect cleanly to reset-password
  // so the client-side onAuthStateChange picks up the PASSWORD_RECOVERY event.
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // Non-recovery PKCE flows (email confirm, OAuth, magic link):
  // Exchange server-side as normal.
  if (code) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}

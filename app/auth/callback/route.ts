import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  // PKCE / code-based flow (Supabase newer versions)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    // Code exchange failed — expired or already used
    return NextResponse.redirect(
      `${origin}/auth/reset-password?error=invalid_token`
    )
  }

  // Hash-fragment flow: Supabase puts #access_token=...&type=recovery in the URL.
  // The server never sees hash fragments, so redirect to reset-password and let
  // the client-side onAuthStateChange pick up the PASSWORD_RECOVERY event.
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // No code and no recovery type — generic error
  return NextResponse.redirect(
    `${origin}/auth/reset-password?error=invalid_token`
  )
}

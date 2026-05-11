import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  // PKCE / code-based flow
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Detect recovery type either from URL param or from the session's AMR claims
      const isRecovery =
        type === 'recovery' ||
        (data.session?.user?.recovery_sent_at != null &&
          data.session?.user?.last_sign_in_at ===
            data.session?.user?.recovery_sent_at)

      if (isRecovery || type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(
      `${origin}/auth/reset-password?error=invalid_token`
    )
  }

  // Hash-fragment flow: Supabase puts #access_token=...&type=recovery in the URL.
  // The server never sees hash fragments — redirect to reset-password so
  // the client-side onAuthStateChange can pick up the PASSWORD_RECOVERY event.
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`)
  }

  // No code and no recovery type
  return NextResponse.redirect(`${origin}/auth/reset-password?error=invalid_token`)
}

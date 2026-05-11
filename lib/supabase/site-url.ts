/**
 * Returns the redirect URL for Supabase auth flows (password reset, email confirm).
 *
 * The URL returned MUST be whitelisted in Supabase Auth > URL Configuration > Redirect URLs.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_APP_URL         — production domain set by the team (e.g. https://onecart360.com)
 *   2. NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL — v0 dev redirect, already whitelisted in Supabase
 *   3. window.location.origin      — local dev fallback (http://localhost:3000 must be whitelisted)
 *
 * NEXT_PUBLIC_SITE_URL is intentionally skipped here — it was set to a v0 internal callback
 * URL and is not the app's own domain.
 */
function isAppUrl(value: string | undefined): boolean {
  if (!value) return false
  // Must start with http(s) and NOT be a v0.app internal callback or supabase URL
  return (
    (value.startsWith('http://') || value.startsWith('https://')) &&
    !value.includes('v0.app') &&
    !value.includes('supabase.co')
  )
}

export function getSiteUrl(): string {
  // 1. Explicit production app URL (must be configured in Vercel project settings)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (isAppUrl(appUrl)) return appUrl!.replace(/\/$/, '')

  // 2. v0 dev redirect URL — already whitelisted in Supabase for development
  const devRedirect = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
  if (devRedirect && (devRedirect.startsWith('http://') || devRedirect.startsWith('https://'))) {
    // Strip any query params — we only need the base origin + path for redirectTo
    try {
      const parsed = new URL(devRedirect)
      return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '')
    } catch {
      return devRedirect.replace(/\/$/, '')
    }
  }

  // 3. Client-side fallback — localhost:3000 must be whitelisted in Supabase
  if (typeof window !== 'undefined') return window.location.origin

  return 'http://localhost:3000'
}

/**
 * Returns the canonical site URL for use in Supabase auth redirects.
 *
 * Resolution order (first valid URL wins):
 *   1. NEXT_PUBLIC_SITE_URL        — explicitly set in Vercel project vars
 *   2. NEXT_PUBLIC_VERCEL_URL      — injected automatically by Vercel on every deploy
 *   3. window.location.origin      — last resort for local dev only
 *
 * The returned value has NO trailing slash.
 * Invalid values (e.g. API keys accidentally set) are silently skipped.
 */
function isValidUrl(value: string | undefined): boolean {
  if (!value) return false
  return value.startsWith('http://') || value.startsWith('https://')
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  const vercel   = process.env.NEXT_PUBLIC_VERCEL_URL

  // 1. Explicit site URL — must be a real URL, not an API key
  if (isValidUrl(explicit)) return explicit!.replace(/\/$/, '')

  // 2. Vercel auto-injected URL (no protocol prefix on Vercel)
  if (vercel) {
    const withProtocol = vercel.startsWith('http') ? vercel : `https://${vercel}`
    return withProtocol.replace(/\/$/, '')
  }

  // 3. Client-side fallback — only safe in local development
  if (typeof window !== 'undefined') return window.location.origin

  return 'http://localhost:3000'
}

/**
 * Returns the canonical site URL for use in Supabase auth redirects.
 *
 * Resolution order (first truthy value wins):
 *   1. NEXT_PUBLIC_SITE_URL  — explicitly set in Vercel / .env.local
 *   2. NEXT_PUBLIC_VERCEL_URL — injected automatically by Vercel on every deploy
 *   3. window.location.origin — last resort (dev only, never in production email links)
 *
 * The returned value has NO trailing slash.
 */
export function getSiteUrl(): string {
  // Server-safe env vars (available at build time and runtime)
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  const vercel   = process.env.NEXT_PUBLIC_VERCEL_URL

  if (explicit) return explicit.replace(/\/$/, '')

  // NEXT_PUBLIC_VERCEL_URL does not include the protocol on Vercel
  if (vercel) return `https://${vercel}`.replace(/\/$/, '')

  // Client-side fallback — only acceptable in local dev
  if (typeof window !== 'undefined') return window.location.origin

  return 'http://localhost:3000'
}

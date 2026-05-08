/**
 * Returns the canonical site URL used for auth email redirects.
 *
 * Priority order:
 *  1. NEXT_PUBLIC_SITE_URL  — explicitly set (recommended for production)
 *  2. NEXT_PUBLIC_VERCEL_URL — automatically injected by Vercel on preview/prod deployments
 *  3. window.location.origin — client-side fallback for local dev
 *  4. http://localhost:3000  — last-resort fallback
 *
 * Always returns a URL without a trailing slash.
 */
export function getSiteUrl(): string {
  // 1. Explicit env var (highest priority — set this in Vercel project settings)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  // 2. Vercel automatically sets NEXT_PUBLIC_VERCEL_URL on deployments
  //    It doesn't include the protocol, so we add https://
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`.replace(/\/$/, '')
  }

  // 3. Client-side fallback — works in browser context
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // 4. Last-resort server-side fallback
  return 'http://localhost:3000'
}

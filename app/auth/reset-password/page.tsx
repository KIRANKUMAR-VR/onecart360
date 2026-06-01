// Server Component — route segment config must live here, not in 'use client' files.
// Next.js ignores `dynamic` exports from client components.
export const dynamic = 'force-dynamic'

import ResetPasswordClient from './reset-password-client'

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}

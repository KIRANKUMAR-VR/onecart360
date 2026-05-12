'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Dashboard from './dashboard'
import { LandingPage } from '@/components/landing-page'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Supabase fires PASSWORD_RECOVERY before any other event when the email
    // link contains #access_token=...&type=recovery. Catch it here first so
    // we can redirect while the hash is still in the URL (the Supabase client
    // reads it automatically from window.location.hash).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Use window.location.assign so the full hash is preserved for the
        // reset-password page's own onAuthStateChange to pick up.
        window.location.assign(`/auth/reset-password${window.location.hash}`)
        return
      }
      setUser(session?.user || null)
      setIsLoading(false)
    })

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    checkUser()

    return () => subscription.unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show dashboard
  if (user) {
    return <Dashboard />
  }

  // Otherwise show landing page
  return <LandingPage />
}


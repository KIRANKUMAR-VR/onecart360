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
    // Detect hash-fragment recovery tokens that Supabase sends when its own
    // Site URL is used as the redirect target (e.g. https://yourapp.com/#type=recovery).
    // The server never sees hash fragments, so we must intercept them here on the client.
    if (typeof window !== 'undefined') {
      const hash = new URLSearchParams(window.location.hash.slice(1))
      if (hash.get('type') === 'recovery') {
        router.replace('/auth/reset-password')
        return
      }
    }

    const supabase = createClient()

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/reset-password')
        return
      }
      setUser(session?.user || null)
    })

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


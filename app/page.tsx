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

    // Check for recovery hash BEFORE setting up any auth listeners.
    // If the URL contains #type=recovery the Supabase client will fire
    // PASSWORD_RECOVERY — we must navigate away immediately so the hash
    // is preserved for the reset-password page to process.
    if (typeof window !== 'undefined') {
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      if (hashParams.get('type') === 'recovery') {
        window.location.replace(`/auth/reset-password${window.location.hash}`)
        return
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.replace(`/auth/reset-password${window.location.hash}`)
        return
      }
      setUser(session?.user || null)
      setIsLoading(false)
    })

    // Only run checkUser after confirming this is NOT a recovery flow
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


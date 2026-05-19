'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, XCircle, CheckCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldError('')

    if (!email.trim()) {
      setFieldError('Email is required')
      return
    }
    if (!validateEmail(email)) {
      setFieldError('Enter a valid email address')
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      // Build the redirectTo URL.
      // Use NEXT_PUBLIC_APP_URL when set (production), otherwise fall back to
      // window.location.origin (works for localhost and preview deployments).
      // This URL must be whitelisted in Supabase Auth > URL Configuration > Redirect URLs.
      const appOrigin =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
        window.location.origin
      const redirectTo = `${appOrigin}/auth/callback?type=recovery`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      setIsSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">

          {/* Branding */}
          <Link
            href="/"
            className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="OneCart360" width={56} height={56} className="h-14 w-14" />
            <h1 className="text-2xl font-bold text-foreground">OneCart360</h1>
            <p className="text-xs text-muted-foreground">Track. Manage. Never Run Out.</p>
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6">

            {isSent ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    We sent a password reset link to{' '}
                    <span className="font-medium text-foreground">{email}</span>.
                    Check your spam folder if you don&apos;t see it.
                  </p>
                </div>
                <div className="w-full pt-2 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setIsSent(false); setEmail('') }}
                  >
                    Try a different email
                  </Button>
                  <Link href="/auth/login" className="w-full">
                    <Button variant="ghost" className="w-full gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Log In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-foreground">Forgot Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-4">

                    {/* Email */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="email">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (fieldError) setFieldError('')
                          if (error) setError(null)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
                        className={cn(
                          fieldError && 'border-destructive focus-visible:ring-destructive/30'
                        )}
                      />
                      {fieldError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> {fieldError}
                        </p>
                      )}
                    </div>

                    {/* Global error */}
                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <XCircle className="h-4 w-4 shrink-0" /> {error}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold mt-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>

                  </div>
                </form>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  Remembered your password?{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
                  >
                    Log In
                  </Link>
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

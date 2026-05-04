'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const passwordRef = useRef<HTMLInputElement>(null)

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateFields = () => {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    return errors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errors = validateFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (
          error.message.toLowerCase().includes('invalid') ||
          error.message.toLowerCase().includes('credentials')
        ) {
          setError('Invalid email or password. Please try again.')
        } else {
          throw error
        }
        return
      }
      router.push('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
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
            <div className="mb-5">
              <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Log in to manage your household pantry
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate>
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
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                      if (error) setError(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && passwordRef.current?.focus()}
                    className={cn(
                      fieldErrors.email && 'border-destructive focus-visible:ring-destructive/30'
                    )}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      ref={passwordRef}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                        if (error) setError(null)
                      }}
                      className={cn(
                        'pr-10',
                        fieldErrors.password && 'border-destructive focus-visible:ring-destructive/30'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> {fieldErrors.password}
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
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Logging In...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </Button>

              </div>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
              >
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

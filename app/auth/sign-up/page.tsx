'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, CheckCircle2, XCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  checks: { label: string; passed: boolean }[]
} {
  const checks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'Number', passed: /[0-9]/.test(password) },
    { label: 'Special character', passed: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.passed).length
  const label =
    score <= 1 ? 'Weak' : score <= 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong'
  const color =
    score <= 1
      ? 'bg-destructive'
      : score <= 3
      ? 'bg-yellow-400'
      : score === 4
      ? 'bg-blue-500'
      : 'bg-primary'
  return { score, label, color, checks }
}

export default function Page() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Refs for auto-focus next field
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const householdRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const strength = getPasswordStrength(password)

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateFields = () => {
    const errors: Record<string, string> = {}
    if (!fullName.trim()) errors.fullName = 'Full name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    else if (strength.score < 2) errors.password = 'Password is too weak'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!agreedToTerms) errors.terms = 'You must agree to the Terms & Conditions'
    return errors
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const errors = validateFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            household_name: householdName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
        },
      })
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('already') || msg.includes('registered')) {
          setFieldErrors({ email: 'An account with this email already exists.' })
        } else if (msg.includes('email') && (msg.includes('send') || msg.includes('confirmation'))) {
          setError('Unable to send confirmation email. Please check your email address and try again, or contact support.')
        } else if (msg.includes('rate limit') || msg.includes('too many')) {
          setError('Too many sign-up attempts. Please wait a few minutes and try again.')
        } else {
          setError(error.message || 'Account creation failed. Please try again.')
        }
        return
      }
      setSuccess(true)
      setTimeout(() => { window.location.href = '/auth/sign-up-success' }, 1200)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
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
            <p className="text-xs text-muted-foreground">All Your Essentials. One Place.</p>
          </Link>

          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Account Created!</h2>
              <p className="text-sm text-muted-foreground">
                Check your email to verify your account before logging in.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-foreground">Create Account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign up to get started with OneCart360
                </p>
              </div>

              <form onSubmit={handleSignUp} noValidate>
                <div className="flex flex-col gap-4">

                  {/* Full Name */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Kiran Kumar"
                      autoComplete="name"
                      autoFocus
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: '' }))
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && emailRef.current?.focus()}
                      className={cn(fieldErrors.fullName && 'border-destructive focus-visible:ring-destructive/30')}
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      ref={emailRef}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && phoneRef.current?.focus()}
                      className={cn(fieldErrors.email && 'border-destructive focus-visible:ring-destructive/30')}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone (optional) */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="phone"
                      ref={phoneRef}
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && householdRef.current?.focus()}
                    />
                  </div>

                  {/* Household Name (optional) */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="householdName">Household Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="householdName"
                      ref={householdRef}
                      type="text"
                      placeholder="Kiran's Home"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && passwordRef.current?.focus()}
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && confirmPasswordRef.current?.focus()}
                        className={cn('pr-10', fieldErrors.password && 'border-destructive focus-visible:ring-destructive/30')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password Strength Bar */}
                    {password.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                'flex-1 rounded-full transition-all duration-300',
                                i <= strength.score ? strength.color : 'bg-border'
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength: <span className={cn(
                            'font-medium',
                            strength.score <= 1 ? 'text-destructive' :
                            strength.score <= 3 ? 'text-yellow-600' :
                            strength.score === 4 ? 'text-blue-600' : 'text-primary'
                          )}>{strength.label}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {strength.checks.map((check) => (
                            <p key={check.label} className={cn(
                              'text-xs flex items-center gap-1',
                              check.passed ? 'text-primary' : 'text-muted-foreground'
                            )}>
                              {check.passed
                                ? <CheckCircle2 className="h-3 w-3 shrink-0" />
                                : <Circle className="h-3 w-3 shrink-0" />
                              }
                              {check.label}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {fieldErrors.password && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        ref={confirmPasswordRef}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: '' }))
                        }}
                        className={cn('pr-10', fieldErrors.confirmPassword && 'border-destructive focus-visible:ring-destructive/30')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <p className={cn(
                        'text-xs flex items-center gap-1',
                        password === confirmPassword ? 'text-primary' : 'text-destructive'
                      )}>
                        {password === confirmPassword
                          ? <><CheckCircle2 className="h-3 w-3" /> Passwords match</>
                          : <><XCircle className="h-3 w-3" /> Passwords do not match</>
                        }
                      </p>
                    )}
                    {fieldErrors.confirmPassword && !confirmPassword.length && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-2">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked)
                        if (fieldErrors.terms) setFieldErrors((p) => ({ ...p, terms: '' }))
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" className="text-primary underline underline-offset-2 hover:opacity-80">
                        Terms &amp; Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2 hover:opacity-80">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {fieldErrors.terms && (
                    <p className="text-xs text-destructive flex items-center gap-1 -mt-2">
                      <XCircle className="h-3 w-3" /> {fieldErrors.terms}
                    </p>
                  )}

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
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : 'Create Account'}
                  </Button>

                </div>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-medium underline underline-offset-4 hover:opacity-80">
                  Log In
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

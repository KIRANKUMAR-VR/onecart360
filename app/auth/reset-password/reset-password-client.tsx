'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Eye, EyeOff, XCircle, CheckCircle2, Check, X,
  ShieldCheck, Lock, AlertTriangle, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { label: 'At least 8 characters',     test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',       test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',       test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number',                 test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character',      test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password: string) {
  return PASSWORD_RULES.filter((r) => r.test(password)).length
}

// ── Strength bar ──────────────────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
  if (!password) return null
  const score = getStrength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors  = ['', 'bg-destructive', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-500', 'bg-primary']
  const texts   = ['', 'text-destructive', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-primary']

  return (
    <div className="space-y-2 mt-1" aria-live="polite" aria-label="Password strength">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i <= score ? colors[score] : 'bg-muted'
            )}
          />
        ))}
        <span className={cn('text-xs font-semibold ml-1 w-20 text-right', texts[score])}>
          {labels[score]}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-1" role="list">
        {PASSWORD_RULES.map((rule) => {
          const passes = rule.test(password)
          return (
            <li key={rule.label} className="flex items-center gap-1.5 text-xs">
              {passes
                ? <Check className="h-3 w-3 text-primary shrink-0" aria-hidden />
                : <X     className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden />}
              <span className={passes ? 'text-foreground' : 'text-muted-foreground'}>
                {rule.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path  className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

// ── Screen types ──────────────────────────────────────────────────────────────
type Screen = 'verifying' | 'confirm' | 'form' | 'success' | 'error'

// ── Dev debug panel ───────────────────────────────────────────────────────────
interface DebugInfo {
  url: string
  hash: string
  hasAccessToken: boolean
  hasCode: boolean
  type: string | null
  sessionStatus: string
}

function DevDebugPanel({ info }: { info: DebugInfo }) {
  if (process.env.NODE_ENV !== 'development') return null
  return (
    <div className="rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 p-4 text-xs font-mono space-y-1">
      <p className="font-bold text-yellow-700 mb-2">Dev Debug Panel</p>
      <p><span className="text-muted-foreground">URL:</span> {info.url}</p>
      <p><span className="text-muted-foreground">Hash params:</span> {info.hash || '(none)'}</p>
      <p><span className="text-muted-foreground">access_token:</span> {info.hasAccessToken ? 'present' : 'missing'}</p>
      <p><span className="text-muted-foreground">code:</span> {info.hasCode ? 'present' : 'missing'}</p>
      <p><span className="text-muted-foreground">type:</span> {info.type ?? '(none)'}</p>
      <p><span className="text-muted-foreground">session:</span> {info.sessionStatus}</p>
    </div>
  )
}

// ── Loading fallback ──────────────────────────────────────────────────────────
function ResetPasswordFallback() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading&hellip;</p>
      </div>
    </div>
  )
}

// ── Inner component (uses useSearchParams — must be inside Suspense) ──────────
function ResetPasswordInner() {
  const [screen,          setScreen]          = useState<Screen>('verifying')
  const [errorMessage,    setErrorMessage]    = useState<string>('')
  const [password,        setPassword]        = useState('')
  const [confirm,         setConfirm]         = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [fieldErrors,     setFieldErrors]     = useState<Record<string, string>>({})
  const [globalError,     setGlobalError]     = useState<string | null>(null)
  const [isSubmitting,    setIsSubmitting]    = useState(false)
  const [submitCount,     setSubmitCount]     = useState(0)
  const [debugInfo,       setDebugInfo]       = useState<DebugInfo | null>(null)
  const hasSubmitted      = useRef(false)

  const router       = useRouter()
  const searchParams = useSearchParams()

  // ── Session / token verification ──────────────────────────────────────────
  //
  // ROOT CAUSE OF "LINK EXPIRED":
  //   Gmail's link pre-fetcher (and Google Safe Browsing) sends a GET request
  //   to every link in an email BEFORE the user clicks it. Since Supabase
  //   one-time tokens are single-use, the pre-fetcher consumes the token,
  //   so when the user actually clicks, it's already expired.
  //
  // FIX — token_hash flow (PRIMARY PATH):
  //   The Supabase email template links to THIS app with ?token_hash=XXX&type=recovery.
  //   We show a "confirm" screen with a button. The token is NOT exchanged until
  //   the user explicitly clicks "Reset My Password". Pre-fetchers see a normal
  //   page and cannot consume the token because we don't call verifyOtp() on load.
  //
  // OTHER PATHS:
  //   ?recovered=1  → PKCE flow, session already set by /auth/callback
  //   #access_token= → hash fragment, handled by onAuthStateChange
  //
  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const recovered = searchParams.get('recovered')
    const urlError  = searchParams.get('error')

    const hashParams   = new URLSearchParams(window.location.hash.slice(1))
    const hasHashToken = hashParams.has('access_token') && hashParams.get('type') === 'recovery'

    if (process.env.NODE_ENV === 'development') {
      setDebugInfo({
        url:            window.location.href,
        hash:           window.location.hash ? window.location.hash.substring(0, 60) + '…' : '',
        hasAccessToken: hashParams.has('access_token'),
        hasCode:        !!recovered || !!tokenHash,
        type:           hashParams.get('type') ?? searchParams.get('type') ?? null,
        sessionStatus:  'checking…',
      })
    }

    if (urlError) {
      setErrorMessage('This password reset link is invalid or has expired. Please request a new one.')
      setScreen('error')
      return
    }

    // ── Path 1: token_hash — show confirm screen, exchange on button click ─
    // This is the safe path: the token is not consumed until the user clicks.
    // Pre-fetchers (Gmail, Google Safe Browsing) cannot consume it on page load.
    if (tokenHash) {
      setScreen('confirm')
      return
    }

    // ── Path 2: PKCE — session already set by /auth/callback ──────────────
    if (recovered === '1') {
      const supabase = createClient()
      let attempts = 0
      const checkSession = () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            window.history.replaceState({}, '', '/auth/reset-password')
            setScreen('form')
          } else if (attempts++ < 8) {
            setTimeout(checkSession, 500)
          } else {
            setErrorMessage('Session could not be established. Please request a new reset link.')
            setScreen('error')
          }
        })
      }
      checkSession()
      return
    }

    // ── Path 3: Hash-fragment (#access_token=...&type=recovery) ───────────
    if (hasHashToken) {
      const supabase = createClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
          window.history.replaceState({}, '', '/auth/reset-password')
          setScreen('form')
        }
      })
      const timer = setTimeout(() => {
        setScreen((s) => s === 'verifying' ? 'error' : s)
        setErrorMessage('This password reset link is invalid or has expired. Please request a new one.')
      }, 12000)
      return () => { subscription.unsubscribe(); clearTimeout(timer) }
    }

    // ── Path 4: No token ───────────────────────────────────────────────────
    setErrorMessage('No valid reset token found. Please request a new password reset link.')
    setScreen('error')
  }, [searchParams])

  // ── Exchange token_hash on user button click ───────────────────────────────
  const handleConfirmReset = useCallback(async () => {
    const tokenHash = searchParams.get('token_hash')
    if (!tokenHash) return
    setScreen('verifying')
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
    if (error) {
      setErrorMessage('This password reset link is invalid or has expired. Please request a new one.')
      setScreen('error')
    } else {
      window.history.replaceState({}, '', '/auth/reset-password')
      setScreen('form')
    }
  }, [searchParams])

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errors: Record<string, string> = {}
    if (!password)               errors.password = 'Password is required'
    else if (getStrength(password) < 4)
                                 errors.password = 'Password is too weak. Meet all requirements.'
    if (!confirm)                errors.confirm  = 'Please confirm your password'
    else if (password !== confirm) errors.confirm = 'Passwords do not match'
    return errors
  }, [password, confirm])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmitted.current || isSubmitting) return

    setGlobalError(null)
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (submitCount >= 3) {
      setGlobalError('Too many attempts. Please wait a moment before trying again.')
      return
    }

    hasSubmitted.current = true
    setIsSubmitting(true)
    setSubmitCount((c) => c + 1)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('same') || msg.includes('different')) {
          setGlobalError('New password must be different from your current password.')
        } else if (msg.includes('weak') || msg.includes('strength')) {
          setFieldErrors({ password: 'Password is too weak.' })
        } else if (msg.includes('rate') || msg.includes('too many')) {
          setGlobalError('Too many requests. Please wait a few minutes and try again.')
        } else {
          setGlobalError('Unable to update your password. Please request a new reset link.')
        }
        hasSubmitted.current = false
        return
      }

      setPassword('')
      setConfirm('')
      setScreen('success')
      setTimeout(() => router.push('/auth/login'), 4000)
    } catch {
      setGlobalError('An unexpected error occurred. Please try again.')
      hasSubmitted.current = false
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">

          {/* Branding */}
          <Link
            href="/"
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="OneCart360" width={56} height={56} className="h-14 w-14" />
            <h1 className="text-2xl font-bold text-foreground">OneCart360</h1>
            <p className="text-xs text-muted-foreground">Track. Manage. Never Run Out.</p>
          </Link>

          {/* VERIFYING */}
          {screen === 'verifying' && (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Verifying Link</h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we validate your reset link&hellip;
                </p>
              </div>
            </div>
          )}

          {/* CONFIRM — shown on page load when token_hash is present.
              The token is NOT exchanged here. The user must click the button.
              This defeats Gmail/Google pre-fetch attacks that consume OTP tokens. */}
          {screen === 'confirm' && (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Reset Your Password</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click the button below to continue setting your new password.
                </p>
              </div>
              <Button
                className="w-full h-11 text-base font-semibold"
                onClick={handleConfirmReset}
              >
                Continue to Reset Password
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/login">Back to Log In</Link>
              </Button>
            </div>
          )}

          {/* ERROR / EXPIRED */}
          {screen === 'error' && (
            <div className="rounded-2xl border border-destructive/30 bg-card shadow-sm p-8 flex flex-col items-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Link Expired</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {errorMessage || 'This password reset link is invalid or has expired.'}
                </p>
              </div>
              <div className="w-full flex flex-col gap-3">
                <Button asChild className="w-full h-11 font-semibold">
                  <Link href="/auth/forgot-password">Request New Link</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/auth/login">Back to Log In</Link>
                </Button>
              </div>
              <div className="w-full rounded-lg bg-muted/60 border border-border p-3 flex items-start gap-2 text-left">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reset links expire after 24 hours and can only be used once. Request a new one if needed.
                </p>
              </div>
            </div>
          )}

          {/* FORM */}
          {screen === 'form' && (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground leading-tight">Set New Password</h2>
                  <p className="text-sm text-muted-foreground">Choose a strong password below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate aria-label="Reset password form">
                <div className="flex flex-col gap-4">

                  {/* New Password */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="password">
                      New Password <span className="text-destructive" aria-hidden>*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        autoFocus
                        value={password}
                        aria-describedby={fieldErrors.password ? 'pw-error' : undefined}
                        aria-invalid={!!fieldErrors.password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                          if (globalError) setGlobalError(null)
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p id="pw-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                        <XCircle className="h-3 w-3 shrink-0" /> {fieldErrors.password}
                      </p>
                    )}
                    <StrengthBar password={password} />
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-1.5">
                    <Label htmlFor="confirm">
                      Confirm Password <span className="text-destructive" aria-hidden>*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        value={confirm}
                        aria-describedby={fieldErrors.confirm ? 'confirm-error' : undefined}
                        aria-invalid={!!fieldErrors.confirm}
                        onChange={(e) => {
                          setConfirm(e.target.value)
                          if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: '' }))
                        }}
                        className={cn(
                          'pr-10',
                          fieldErrors.confirm && 'border-destructive focus-visible:ring-destructive/30',
                          confirm && confirm === password && 'border-primary/50'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirm && confirm === password && !fieldErrors.confirm && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Check className="h-3 w-3" /> Passwords match
                      </p>
                    )}
                    {fieldErrors.confirm && (
                      <p id="confirm-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                        <XCircle className="h-3 w-3 shrink-0" /> {fieldErrors.confirm}
                      </p>
                    )}
                  </div>

                  {/* Global error */}
                  {globalError && (
                    <div
                      className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5"
                      role="alert"
                    >
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <XCircle className="h-4 w-4 shrink-0" /> {globalError}
                      </p>
                    </div>
                  )}

                  {/* Security tips */}
                  <div className="rounded-lg bg-muted/60 border border-border p-3 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use a unique password you don&apos;t use on other sites. Never share it with anyone.
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-semibold mt-1"
                    disabled={isSubmitting || getStrength(password) < 4}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" /> Updating Password&hellip;
                      </span>
                    ) : (
                      'Update Password'
                    )}
                  </Button>

                </div>
              </form>
            </div>
          )}

          {/* SUCCESS */}
          {screen === 'success' && (
            <div className="rounded-2xl border border-primary/20 bg-card shadow-sm p-8 flex flex-col items-center gap-5 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Password Updated!</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your password has been updated successfully. You&apos;ll be redirected to login in a few seconds.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button asChild className="w-full h-11 font-semibold">
                  <Link href="/auth/login">Go to Log In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Open OneCart360</Link>
                </Button>
              </div>

              <div className="w-full rounded-lg bg-muted/60 border border-border p-3 flex items-start gap-2 text-left">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For security, you&apos;ve been signed out of all other devices. Please log in again.
                </p>
              </div>
            </div>
          )}

          {/* Dev debug panel — only visible in development */}
          {debugInfo && <DevDebugPanel info={debugInfo} />}

        </div>
      </div>
    </div>
  )
}

// ── Shell — wraps inner with Suspense so useSearchParams is safe ──────────────
export default function ResetPasswordClient() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordInner />
    </Suspense>
  )
}

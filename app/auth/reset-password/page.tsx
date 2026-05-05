'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, XCircle, CheckCircle, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][score]
  const strengthColor = [
    '',
    'text-destructive',
    'text-yellow-500',
    'text-blue-500',
    'text-primary',
  ][score]
  const barColor = [
    'bg-muted',
    'bg-destructive',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-primary',
  ]

  if (!password) return null

  return (
    <div className="space-y-2 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < score ? barColor[score] : 'bg-muted'
            )}
          />
        ))}
        <span className={cn('text-xs font-medium ml-1', strengthColor)}>{strengthLabel}</span>
      </div>
      <ul className="space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5 text-xs">
            {c.pass ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={c.pass ? 'text-foreground' : 'text-muted-foreground'}>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setIsValidSession(!!data.session)
    })
  }, [])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!password) errors.password = 'Password is required'
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (!confirmPassword) errors.confirm = 'Please confirm your password'
    else if (password !== confirmPassword) errors.confirm = 'Passwords do not match'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsDone(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password. Please try again.'
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

            {isDone ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Password Updated!</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your password has been reset successfully. Redirecting you to login...
                  </p>
                </div>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full">Go to Log In</Button>
                </Link>
              </div>
            ) : isValidSession === false ? (
              /* Invalid / expired link */
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-7 w-7 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Link Expired</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    This reset link has expired or is invalid. Please request a new one.
                  </p>
                </div>
                <Link href="/auth/forgot-password" className="w-full">
                  <Button className="w-full">Request New Link</Button>
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-foreground">Set New Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-4">

                    {/* New Password */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="password">
                        New Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          autoFocus
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> {fieldErrors.password}
                        </p>
                      )}
                      <PasswordStrength password={password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="confirm">
                        Confirm Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: '' }))
                          }}
                          className={cn(
                            'pr-10',
                            fieldErrors.confirm && 'border-destructive focus-visible:ring-destructive/30'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldErrors.confirm && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> {fieldErrors.confirm}
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
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </Button>

                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

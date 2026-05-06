'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
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

          {/* Success Card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center gap-5 text-center">

            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Account Created!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your account has been successfully created. We&apos;ve sent a confirmation email to verify your address.
              </p>
            </div>

            {/* Email Notice */}
            <div className="w-full rounded-lg bg-muted/60 border border-border p-4 flex items-start gap-3 text-left">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Check your inbox</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click the confirmation link in the email we sent you. Check your spam folder if you don&apos;t see it within a few minutes.
                </p>
              </div>
            </div>

            {/* Next steps */}
            <div className="w-full space-y-3">
              {[
                'Confirm your email address',
                'Log in to your account',
                'Start managing your pantry',
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground text-left">{step}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button asChild className="w-full h-11 text-base font-semibold">
              <Link href="/auth/login">
                Go to Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email?{' '}
              <Link href="/auth/sign-up" className="text-primary underline underline-offset-2 hover:opacity-80">
                Try signing up again
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

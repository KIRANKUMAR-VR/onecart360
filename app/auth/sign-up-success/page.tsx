import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Mail } from 'lucide-react'
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
          <div className="rounded-2xl border border-border bg-card shadow-sm p-8 text-center flex flex-col items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Account Created!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your account has been successfully created. Please check your email inbox and verify your address to activate your account.
              </p>
            </div>

            <div className="w-full rounded-xl bg-muted/60 border border-border px-4 py-3 flex items-start gap-3 text-left">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Check your inbox</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A verification link has been sent to your email. The link expires in 24 hours.
                </p>
              </div>
            </div>

            <Button asChild className="w-full h-11 font-semibold">
              <Link href="/auth/login">Go to Login</Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Did not receive the email?{' '}
              <Link
                href="/auth/sign-up"
                className="text-primary underline underline-offset-4 hover:opacity-80"
              >
                Try signing up again
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

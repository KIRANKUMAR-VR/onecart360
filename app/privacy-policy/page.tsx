import Link from 'next/link'
import { ArrowLeft, Package, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – OneCart360',
  description:
    'Learn how OneCart360 collects, uses, and protects your personal information. Our privacy policy explains your rights and how we handle your data.',
}

const LAST_UPDATED = 'May 15, 2026'

const sections = [
  {
    id: 'information-collection',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2">a. Personal Information</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number (optional)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">b. Usage Data</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Items added and managed within the app</li>
            <li>App usage patterns and feature interactions</li>
            <li>Device and browser information</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: (
      <div>
        <p className="text-muted-foreground mb-3">We use your data to:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Provide and continuously improve our services</li>
          <li>Manage your account and authenticate your identity</li>
          <li>Send notifications such as low-stock alerts and updates</li>
          <li>Enhance and personalise your user experience</li>
          <li>Analyse usage trends to improve app functionality</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p className="font-medium text-foreground">We do not sell your personal data.</p>
        <p>We may share data in the following limited circumstances:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>With trusted service providers (e.g. cloud hosting, analytics platforms)</li>
          <li>If required by applicable law or legal process</li>
          <li>To protect the rights, safety, or property of OneCart360 or its users</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: (
      <p className="text-muted-foreground">
        We implement industry-standard security measures — including encryption in transit and at
        rest, access controls, and regular security reviews — to protect your data. However, no
        system can guarantee absolute security. We encourage you to use a strong, unique password
        and to contact us immediately if you suspect unauthorised access to your account.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We may use cookies and similar tracking technologies to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Maintain your authenticated session</li>
          <li>Remember your preferences and settings</li>
          <li>Analyse usage and improve the service</li>
        </ul>
        <p>
          You can control or disable cookies via your browser settings. Note that disabling
          essential cookies may affect the functionality of the app.
        </p>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: '6. Third-Party Services',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          OneCart360 uses third-party services to operate and improve the platform. These include:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="text-foreground font-medium">Supabase</span> — authentication and
            database hosting
          </li>
          <li>
            <span className="text-foreground font-medium">Vercel</span> — application hosting and
            deployment
          </li>
        </ul>
        <p>
          Each third-party provider has its own privacy policy governing how it handles data.
        </p>
      </div>
    ),
  },
  {
    id: 'user-rights',
    title: '7. Your Rights',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Update or correct your profile information at any time</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with a relevant data protection authority</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a
            href="mailto:support@onecart360.com"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            support@onecart360.com
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: 'account-deletion',
    title: '8. Account Deletion',
    content: (
      <p className="text-muted-foreground">
        You may request deletion of your account at any time by emailing{' '}
        <a
          href="mailto:support@onecart360.com"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          support@onecart360.com
        </a>{' '}
        with the subject line "Account Deletion Request". We will process your request within 30
        days and confirm once your data has been permanently removed.
      </p>
    ),
  },
  {
    id: 'data-retention',
    title: '9. Data Retention',
    content: (
      <p className="text-muted-foreground">
        We retain your personal data for as long as your account remains active or as needed to
        provide our services. If you delete your account, we will remove your data within 30 days,
        except where retention is required by law.
      </p>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "10. Children's Privacy",
    content: (
      <p className="text-muted-foreground">
        OneCart360 is not intended for children under the age of 13. We do not knowingly collect
        personal information from children. If you believe a child has provided us with their
        information, please contact us and we will delete it promptly.
      </p>
    ),
  },
  {
    id: 'policy-changes',
    title: '11. Changes to This Policy',
    content: (
      <p className="text-muted-foreground">
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        for legal reasons. We will notify you of material changes via email or a prominent notice
        in the app. Continued use of OneCart360 after changes take effect constitutes your
        acceptance of the revised policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    content: (
      <div className="text-muted-foreground space-y-1">
        <p>If you have questions or concerns about this Privacy Policy, please reach out:</p>
        <p>
          Email:{' '}
          <a
            href="mailto:support@onecart360.com"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            support@onecart360.com
          </a>
        </p>
      </div>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm">OneCart360</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy describes how <span className="font-medium text-foreground">OneCart360</span> collects,
              uses, and protects your personal information when you use our home inventory
              management application. By using OneCart360, you agree to the practices described
              in this policy.
            </p>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="mb-10 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h2>
          <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-primary hover:opacity-80 transition-opacity underline-offset-2 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Policy sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-xl border border-border bg-card px-6 py-5 scroll-mt-20"
            >
              <h2 className="text-base font-semibold text-foreground mb-3">{section.title}</h2>
              <div className="text-sm leading-relaxed">{section.content}</div>
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OneCart360. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
            <a
              href="mailto:support@onecart360.com"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

      </main>
    </div>
  )
}

import Link from 'next/link'
import { ArrowLeft, Package, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions – OneCart360',
  description:
    'Read the Terms & Conditions for OneCart360. These terms govern your use of our home inventory management application.',
}

const EFFECTIVE_DATE = 'May 15, 2026'

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <p className="text-muted-foreground">
        By accessing or using OneCart360 ("the Service"), you agree to be bound by these Terms &
        Conditions ("Terms"). If you do not agree to these Terms, you may not access or use the
        Service. These Terms constitute a legally binding agreement between you and OneCart360.
        Your continued use of the Service following any updates to these Terms constitutes
        acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: 'user-responsibilities',
    title: '2. User Responsibilities',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>As a user of OneCart360, you agree to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
          <li>Provide accurate, current, and complete information when creating your account</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Notify us immediately of any unauthorised use of your account</li>
          <li>Take responsibility for all activity that occurs under your account</li>
          <li>Not share your account with or allow access by any third party</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'account-registration',
    title: '3. Account Registration',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          To access certain features of the Service, you must register for an account. When
          registering, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Provide truthful and accurate registration information</li>
          <li>Keep your registration information up to date</li>
          <li>Use a strong, unique password and keep it confidential</li>
          <li>Be at least 13 years of age (or the age of digital consent in your jurisdiction)</li>
        </ul>
        <p>
          OneCart360 reserves the right to suspend or terminate accounts that contain inaccurate
          information or violate these Terms.
        </p>
      </div>
    ),
  },
  {
    id: 'prohibited-activities',
    title: '4. Prohibited Activities',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You must not engage in any of the following prohibited activities:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Attempting to gain unauthorised access to any part of the Service or its systems</li>
          <li>Uploading or transmitting malicious code, viruses, or harmful content</li>
          <li>Using the Service to harass, abuse, or harm others</li>
          <li>Reverse engineering, decompiling, or disassembling any part of the Service</li>
          <li>Scraping or data-mining the Service without explicit written consent</li>
          <li>Impersonating any person or entity, or misrepresenting your affiliation</li>
          <li>Using the Service for any illegal, fraudulent, or unauthorised purpose</li>
          <li>Interfering with or disrupting the integrity or performance of the Service</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'subscription-payments',
    title: '5. Subscription & Payments',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          OneCart360 may offer free and paid subscription tiers. By subscribing to a paid plan,
          you agree to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Pay all applicable fees as described on the pricing page at the time of purchase</li>
          <li>Provide valid payment information and keep it current</li>
          <li>
            Authorise us to charge your payment method on a recurring basis (where applicable)
          </li>
        </ul>
        <p>
          Subscription fees are non-refundable except as required by applicable law or as
          expressly stated in our refund policy. We reserve the right to modify pricing with
          reasonable advance notice.
        </p>
      </div>
    ),
  },
  {
    id: 'intellectual-property',
    title: '6. Intellectual Property',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          The Service and all of its content, features, and functionality — including but not
          limited to software, text, graphics, logos, and icons — are owned by OneCart360 and
          are protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You are granted a limited, non-exclusive, non-transferable licence to access and use
          the Service for personal, non-commercial purposes. You may not copy, modify, distribute,
          sell, or lease any part of the Service without our express written permission.
        </p>
        <p>
          Any content you upload or enter into the Service (e.g. inventory data) remains your
          property. By using the Service, you grant OneCart360 a limited licence to store and
          process that content solely to provide the Service to you.
        </p>
      </div>
    ),
  },
  {
    id: 'limitation-liability',
    title: '7. Limitation of Liability',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          To the fullest extent permitted by applicable law, OneCart360 and its directors,
          employees, agents, and affiliates shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising from:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your use of or inability to use the Service</li>
          <li>Any unauthorised access to or alteration of your data</li>
          <li>Any errors, inaccuracies, or omissions in Service content</li>
          <li>Any interruption or cessation of the Service</li>
        </ul>
        <p>
          Our total liability to you for any claim arising out of or relating to these Terms or
          the Service shall not exceed the amount you paid us in the 12 months preceding the
          claim, or USD $100, whichever is greater.
        </p>
      </div>
    ),
  },
  {
    id: 'privacy-reference',
    title: '8. Privacy Reference',
    content: (
      <p className="text-muted-foreground">
        Your use of the Service is also governed by our{' '}
        <Link
          href="/privacy-policy"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          Privacy Policy
        </Link>
        , which is incorporated into these Terms by reference. Please review our Privacy Policy
        to understand our practices regarding the collection, use, and disclosure of your personal
        information.
      </p>
    ),
  },
  {
    id: 'termination',
    title: '9. Termination of Service',
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          OneCart360 reserves the right to suspend or terminate your account and access to the
          Service at any time, with or without notice, for any reason, including but not limited
          to a breach of these Terms.
        </p>
        <p>
          You may terminate your account at any time by contacting us at{' '}
          <a
            href="mailto:support@onecart360.com"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            support@onecart360.com
          </a>
          . Upon termination, your right to use the Service will immediately cease.
        </p>
      </div>
    ),
  },
  {
    id: 'changes-to-terms',
    title: '10. Changes to Terms',
    content: (
      <p className="text-muted-foreground">
        We reserve the right to modify these Terms at any time. We will notify you of material
        changes by posting the updated Terms with a revised effective date and, where appropriate,
        by sending an email notification. Your continued use of the Service after changes take
        effect constitutes your acceptance of the revised Terms. We encourage you to review these
        Terms periodically.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '11. Governing Law',
    content: (
      <p className="text-muted-foreground">
        These Terms shall be governed by and construed in accordance with applicable laws, without
        regard to conflict of law principles. Any disputes arising under or in connection with
        these Terms shall be subject to the exclusive jurisdiction of the competent courts in the
        applicable jurisdiction. If any provision of these Terms is found to be unenforceable,
        the remaining provisions will continue in full force and effect.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact Information',
    content: (
      <div className="text-muted-foreground space-y-2">
        <p>
          If you have any questions, concerns, or requests regarding these Terms & Conditions,
          please contact us:
        </p>
        <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 space-y-1 text-sm">
          <p>
            <span className="font-medium text-foreground">Email:</span>{' '}
            <a
              href="mailto:support@onecart360.com"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              support@onecart360.com
            </a>
          </p>
          <p>
            <span className="font-medium text-foreground">Product:</span> OneCart360
          </p>
        </div>
        <p className="text-xs">
          We aim to respond to all enquiries within 2–3 business days.
        </p>
      </div>
    ),
  },
]

export default function TermsAndConditionsPage() {
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
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Terms &amp; Conditions
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Effective date: {EFFECTIVE_DATE}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please read these Terms &amp; Conditions carefully before using{' '}
              <span className="font-medium text-foreground">OneCart360</span>. These Terms govern
              your access to and use of our home inventory management application and constitute a
              binding legal agreement between you and OneCart360.
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

        {/* Sections */}
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
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
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

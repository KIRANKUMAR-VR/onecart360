'use client'

import { useEffect, useRef } from 'react'
import { X, FileText, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
export type LegalModalType = 'terms' | 'privacy' | null

interface LegalSection {
  id: string
  title: string
  content: React.ReactNode
}

// ── Terms & Conditions content ────────────────────────────────────────────────
const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <p>
        By accessing or using OneCart360 ("the Service"), you agree to be bound by these Terms &amp;
        Conditions ("Terms"). If you do not agree to these Terms, you may not access or use the
        Service. Your continued use following any updates constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: 'user-responsibilities',
    title: '2. User Responsibilities',
    content: (
      <div className="space-y-2">
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
    id: 'account-usage',
    title: '3. Account Usage',
    content: (
      <div className="space-y-2">
        <p>When registering, you agree to:</p>
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
    id: 'restrictions',
    title: '4. Restrictions',
    content: (
      <div className="space-y-2">
        <p>You must not engage in any of the following prohibited activities:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Attempting to gain unauthorised access to any part of the Service</li>
          <li>Uploading or transmitting malicious code, viruses, or harmful content</li>
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
    id: 'termination',
    title: '5. Termination',
    content: (
      <p>
        OneCart360 reserves the right to suspend or terminate your account and access to the Service
        at any time, with or without notice, for any reason, including but not limited to a breach of
        these Terms. You may terminate your account at any time by contacting us at{' '}
        <a href="mailto:support@onecart360.com" className="text-primary underline underline-offset-2 hover:opacity-80">
          support@onecart360.com
        </a>.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '6. Liability Disclaimer',
    content: (
      <div className="space-y-2">
        <p>
          To the fullest extent permitted by applicable law, OneCart360 and its directors, employees,
          agents, and affiliates shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of or inability to use the Service.
        </p>
        <p>
          Our total liability to you for any claim shall not exceed the amount you paid us in the 12
          months preceding the claim, or USD $100, whichever is greater.
        </p>
      </div>
    ),
  },
  {
    id: 'contact-terms',
    title: '7. Contact Information',
    content: (
      <div className="space-y-2">
        <p>For questions about these Terms, please contact us:</p>
        <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 space-y-1 text-sm">
          <p>
            <span className="font-medium text-foreground">Email:</span>{' '}
            <a href="mailto:support@onecart360.com" className="text-primary underline underline-offset-2 hover:opacity-80">
              support@onecart360.com
            </a>
          </p>
          <p><span className="font-medium text-foreground">Product:</span> OneCart360</p>
        </div>
      </div>
    ),
  },
]

// ── Privacy Policy content ─────────────────────────────────────────────────────
const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'information-collection',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-3">
        <div>
          <p className="font-medium text-foreground mb-1">Personal Information</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Name and email address</li>
            <li>Phone number (optional)</li>
            <li>Household name (optional)</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-foreground mb-1">Usage Data</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Items added and managed within the app</li>
            <li>App usage patterns and feature interactions</li>
            <li>Device and browser information</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'data-usage',
    title: '2. Data Usage',
    content: (
      <div className="space-y-2">
        <p>We use your data to:</p>
        <ul className="list-disc list-inside space-y-1">
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
    id: 'cookies',
    title: '3. Cookies',
    content: (
      <div className="space-y-2">
        <p>We may use cookies and similar tracking technologies to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Maintain your authenticated session</li>
          <li>Remember your preferences and settings</li>
          <li>Analyse usage and improve the service</li>
        </ul>
        <p>
          You can control or disable cookies via your browser settings. Note that disabling essential
          cookies may affect the functionality of the app.
        </p>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: '4. Third-Party Services',
    content: (
      <div className="space-y-2">
        <p>OneCart360 uses third-party services to operate and improve the platform:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><span className="font-medium text-foreground">Supabase</span> — authentication and database hosting</li>
          <li><span className="font-medium text-foreground">Vercel</span> — application hosting and deployment</li>
        </ul>
        <p>We do not sell your personal data. Each provider has its own privacy policy.</p>
      </div>
    ),
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    content: (
      <p>
        We implement industry-standard security measures — including encryption in transit and at
        rest, access controls, and regular security reviews — to protect your data. We encourage
        you to use a strong, unique password and to contact us immediately if you suspect
        unauthorised access to your account.
      </p>
    ),
  },
  {
    id: 'user-rights',
    title: '6. Your Rights',
    content: (
      <div className="space-y-2">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Update or correct your profile information at any time</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with a relevant data protection authority</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'account-deletion',
    title: '7. Account Deletion',
    content: (
      <p>
        You may request deletion of your account at any time by emailing{' '}
        <a href="mailto:support@onecart360.com" className="text-primary underline underline-offset-2 hover:opacity-80">
          support@onecart360.com
        </a>{' '}
        with the subject "Account Deletion Request". We will process your request within 30 days.
      </p>
    ),
  },
  {
    id: 'contact-privacy',
    title: '8. Contact Information',
    content: (
      <div className="space-y-2">
        <p>If you have questions about this Privacy Policy, please reach out:</p>
        <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 text-sm">
          <p>
            <span className="font-medium text-foreground">Email:</span>{' '}
            <a href="mailto:support@onecart360.com" className="text-primary underline underline-offset-2 hover:opacity-80">
              support@onecart360.com
            </a>
          </p>
        </div>
      </div>
    ),
  },
]

// ── Modal component ───────────────────────────────────────────────────────────
interface LegalModalProps {
  type: LegalModalType
  onClose: () => void
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const isTerms = type === 'terms'
  const title = isTerms ? 'Terms & Conditions' : 'Privacy Policy'
  const sections = isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS
  const Icon = isTerms ? FileText : Shield
  const effectiveDate = 'May 15, 2026'

  // Focus the close button when modal opens
  useEffect(() => {
    if (type) {
      closeButtonRef.current?.focus()
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [type])

  // ESC key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()

      // Focus trap: keep focus inside modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!type) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-10 flex flex-col w-full sm:max-w-lg max-h-[92svh] sm:max-h-[80vh]',
          'bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-xl',
          'animate-in fade-in-0 slide-in-from-bottom-4 duration-200'
        )}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base font-semibold text-foreground leading-tight">
                {title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isTerms ? 'Effective' : 'Last updated'}: {effectiveDate}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-5">
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold text-foreground mb-2">{section.title}</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 px-5 py-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="w-full h-10"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowRight,
  Package,
  TrendingDown,
  Users,
  AlertCircle,
  Shield,
  Home,
  CheckCircle2,
  ShoppingCart,
  Bell,
} from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  {
    icon: Package,
    title: 'Manage Your Items',
    description: 'Add and organise every household item in one unified list — no spreadsheets required.',
  },
  {
    icon: TrendingDown,
    title: 'Track Stock in Real Time',
    description: 'Monitor quantities as you use them and always know exactly what you have on hand.',
  },
  {
    icon: AlertCircle,
    title: 'Low-Stock Alerts',
    description: 'Get notified before you run out so you can restock at the right time, every time.',
  },
  {
    icon: Users,
    title: 'Share with Family',
    description: 'Invite household members so everyone stays in sync — no more duplicate purchases.',
  },
  {
    icon: Home,
    title: 'Stay Organised',
    description: 'Group items by category and location for a clear, structured view of your home.',
  },
  {
    icon: Shield,
    title: 'Avoid Waste',
    description: 'Know exactly what you already own to prevent over-buying and reduce spoilage.',
  },
]

const STEPS = [
  { step: 1, title: 'Add Items', description: 'Build your household inventory in minutes.' },
  { step: 2, title: 'Track Usage', description: 'Update quantities as you go.' },
  { step: 3, title: 'Get Alerts', description: 'Receive low-stock notifications.' },
  { step: 4, title: 'Shop Smart', description: 'Make informed, intentional purchases.' },
]

const BENEFITS = [
  {
    icon: CheckCircle2,
    title: 'Saves Time',
    description: 'Less time spent checking shelves, more time for what matters.',
  },
  {
    icon: ShoppingCart,
    title: 'Reduces Waste',
    description: 'Buy only what you need, when you need it.',
  },
  {
    icon: Home,
    title: 'Organised Home',
    description: 'Everything in its place — visible, structured, and accessible.',
  },
  {
    icon: Bell,
    title: 'Always Informed',
    description: 'Real-time alerts keep every family member updated.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-tight">OneCart360</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'About'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="text-sm bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary">Home Inventory, Simplified</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                All Your Essentials.{' '}
                <span className="text-primary">One Place.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                Manage, track, and organise your household items with ease.
                Never run out of supplies or buy what you already have again.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-12 px-6 text-base">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dashboard mock-up */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
              {/* Mock header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground">Good Morning</p>
                  <p className="text-sm font-semibold text-foreground">Your Pantry</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Stat chips */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Items', value: '48' },
                  { label: 'In Stock', value: '41' },
                  { label: 'Low Stock', value: '7' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Mock item rows */}
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Olive Oil', qty: '2 bottles', ok: true },
                  { name: 'Pasta', qty: '3 packs', ok: true },
                  { name: 'Dish Soap', qty: '0 left', ok: false },
                  { name: 'Rice', qty: '1 bag', ok: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm ${
                      item.ok
                        ? 'bg-card border-border/50'
                        : 'bg-low-stock-bg border-yellow-200'
                    }`}
                  >
                    <span className={`font-medium ${item.ok ? 'text-foreground' : 'text-low-stock'}`}>
                      {item.name}
                    </span>
                    <span className={`text-xs ${item.ok ? 'text-muted-foreground' : 'text-low-stock font-semibold'}`}>
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32 bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Smart Tools for Better Living
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-xl mx-auto">
              Everything you need to stay on top of your home inventory — nothing you don&apos;t.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="p-7 flex flex-col gap-4 border-border/60 bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Up and Running in Minutes
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-xl mx-auto">
              Four simple steps to a perfectly organised home.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[1.75rem] left-[12.5%] right-[12.5%] h-px bg-border" />

            {STEPS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4 relative">
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold z-10 shadow-sm">
                  {item.step}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">Why OneCart360</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Built Around Your Daily Life
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => (
              <Card
                key={benefit.title}
                className="p-6 flex flex-col gap-4 items-start border-border/60 bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">About</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            About OneCart360
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-balance">
            OneCart360 is a smart home inventory and grocery management platform designed to simplify your daily life.
            We help you manage, track, and organise household essentials with ease — no more guessing, no more
            last-minute runs. Just simple, efficient home management for every household.
          </p>
          <div className="pt-2">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground text-balance">
            Start Managing Your Home Today
          </h2>
          <p className="text-lg text-primary-foreground/80 text-balance">
            Join thousands of families organising their homes with OneCart360.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-low-stock text-foreground hover:bg-low-stock/90 h-12 px-8 text-base w-full sm:w-auto"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8 text-base w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-muted/40 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-sm">OneCart360</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage your home inventory with ease.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground">support@onecart360.com</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} OneCart360. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                <Package className="h-3 w-3 text-primary" />
              </div>
              <span>OneCart360</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

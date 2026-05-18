'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, Package, TrendingDown, Users, AlertCircle,
  Shield, Home, CheckCircle2, ShoppingCart, Bell, Zap,
  Star, ChevronRight, Leaf, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

// ── Honeycomb SVG ─────────────────────────────────────────────────────────────
function HoneycombBg({ color = '#16a34a', opacity = 0.05 }: { color?: string; opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={`hex-${color.replace('#', '')}`} x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="14,1 42,1 56,25 42,49 14,49 0,25" fill="none" stroke={color} strokeWidth="1" />
          <polygon points="42,25 70,25 84,49 70,73 42,73 28,49" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#hex-${color.replace('#', '')})`} opacity={opacity} />
    </svg>
  )
}

// ── Bee SVG ───────────────────────────────────────────────────────────────────
function Bee({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="24" cy="29" rx="10" ry="12" fill="#F59E0B" />
      <rect x="14" y="24" width="20" height="3.5" rx="1.5" fill="#1c1917" opacity="0.65" />
      <rect x="14" y="31" width="20" height="3.5" rx="1.5" fill="#1c1917" opacity="0.65" />
      <circle cx="24" cy="16" r="7" fill="#F59E0B" />
      <line x1="21" y1="10" x2="16" y2="4" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="15.5" cy="3" r="1.5" fill="#1c1917" />
      <line x1="27" y1="10" x2="32" y2="4" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="1.5" fill="#1c1917" />
      <ellipse cx="10" cy="22" rx="9" ry="4.5" fill="white" opacity="0.7" transform="rotate(-18 10 22)" />
      <ellipse cx="38" cy="22" rx="9" ry="4.5" fill="white" opacity="0.7" transform="rotate(18 38 22)" />
      <circle cx="21" cy="15" r="1.5" fill="#1c1917" />
      <circle cx="27" cy="15" r="1.5" fill="#1c1917" />
    </svg>
  )
}

// ── Grocery illustration ──────────────────────────────────────────────────────
function GroceryIllustration() {
  const items = [
    { icon: Leaf, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Vegetables', x: 20, y: 15 },
    { icon: ShoppingCart, color: '#16a34a', bg: 'rgba(22,163,74,0.12)', label: 'Cart', x: 70, y: 8 },
    { icon: Package, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Packaged', x: 15, y: 65 },
    { icon: RefreshCw, color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Sync', x: 75, y: 65 },
    { icon: Bell, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Alerts', x: 48, y: 78 },
  ]

  return (
    <div className="relative w-full h-full min-h-[340px]">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="absolute flex items-center justify-center rounded-2xl shadow-md"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: 52,
            height: 52,
            background: item.bg,
            border: `1.5px solid ${item.color}22`,
            backdropFilter: 'blur(8px)',
          }}
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4 + i * 0.8, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <item.icon style={{ color: item.color }} className="h-5 w-5" />
        </motion.div>
      ))}
    </div>
  )
}

// ── Floating bees config ──────────────────────────────────────────────────────
const BEES = [
  { x: 8,  y: 18, size: 32, delay: 0,  duration: 20 },
  { x: 78, y: 8,  size: 28, delay: 4,  duration: 24 },
  { x: 88, y: 60, size: 30, delay: 8,  duration: 18 },
  { x: 3,  y: 72, size: 26, delay: 12, duration: 22 },
]

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Package,       color: '#16a34a', title: 'Smart Inventory',      description: 'Add and organise every household item in one place — no spreadsheets ever again.' },
  { icon: TrendingDown,  color: '#22c55e', title: 'Real-Time Tracking',   description: 'Monitor quantities as you use them so you always know exactly what you have.' },
  { icon: AlertCircle,   color: '#F59E0B', title: 'Low-Stock Alerts',     description: 'Get notified before you run out so you can restock at the right time.' },
  { icon: Users,         color: '#16a34a', title: 'Family Sharing',       description: 'Invite household members so everyone stays in sync — no duplicate purchases.' },
  { icon: Home,          color: '#22c55e', title: 'Stay Organised',       description: 'Group items by category and location for a clear view of your home.' },
  { icon: Shield,        color: '#F59E0B', title: 'Reduce Waste',         description: 'Know exactly what you own to prevent over-buying and reduce spoilage.' },
]

const STEPS = [
  { step: 1, icon: Package,      color: '#16a34a', bg: 'rgba(22,163,74,0.10)',   title: 'Add Items',     description: 'Build your household inventory in minutes.' },
  { step: 2, icon: TrendingDown, color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   title: 'Track Usage',   description: 'Update quantities as you consume items.' },
  { step: 3, icon: Bell,         color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  title: 'Get Alerts',    description: 'Receive low-stock notifications instantly.' },
  { step: 4, icon: ShoppingCart, color: '#16a34a', bg: 'rgba(22,163,74,0.10)',   title: 'Shop Smart',    description: 'Make informed, waste-free purchases.' },
]

const BENEFITS = [
  { icon: CheckCircle2, color: '#16a34a', title: 'Saves Time',       description: 'Less time checking shelves, more time for what matters.' },
  { icon: ShoppingCart, color: '#22c55e', title: 'Reduces Waste',    description: 'Buy only what you need, exactly when you need it.' },
  { icon: Zap,          color: '#F59E0B', title: 'Real-Time Sync',   description: 'Instant updates across all household members.' },
  { icon: Star,         color: '#16a34a', title: 'Always Informed',  description: 'Smart alerts keep every family member updated.' },
]

const STATS = [
  { value: '10k+',  label: 'Happy Families',    color: '#16a34a' },
  { value: '500k+', label: 'Items Tracked',      color: '#22c55e' },
  { value: '98%',   label: 'Satisfaction Rate',  color: '#16a34a' },
  { value: '4.9',   label: 'App Rating',         color: '#F59E0B' },
]

// ── Glass card ────────────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border bg-white/70 backdrop-blur-lg shadow-xl ${className}`}
      style={{ borderColor: 'rgba(22,163,74,0.15)', boxShadow: '0 8px 40px rgba(22,163,74,0.08), 0 2px 12px rgba(0,0,0,0.05)' }}
    >
      {children}
    </div>
  )
}

// ── Fade-up wrapper ───────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -50])

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-white">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-foreground tracking-tight text-sm">OneCart360</span>
              <span className="text-[10px] text-primary font-semibold">Smart Shopping</span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {(['Features', 'How It Works', 'Benefits'] as const).map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium hidden sm:flex">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                Get Started <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center overflow-hidden pt-10 pb-20"
        style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fdf4 50%, #fefce8 100%)' }}
      >
        {/* Subtle honeycomb in corners */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-60 pointer-events-none overflow-hidden">
          <HoneycombBg color="#16a34a" opacity={0.06} />
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-60 pointer-events-none overflow-hidden">
          <HoneycombBg color="#F59E0B" opacity={0.05} />
        </div>

        {/* Green radial blob */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 65% 45%, rgba(34,197,94,0.10) 0%, transparent 70%)' }} />
        {/* Honey gold blob */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />

        {/* Floating bees */}
        {BEES.map((bee) => (
          <motion.div
            key={`${bee.x}-${bee.y}`}
            className="pointer-events-none absolute"
            style={{ left: `${bee.x}%`, top: `${bee.y}%` }}
            animate={{ x: [0, 25, -15, 8, 0], y: [0, -18, 12, -6, 0], rotate: [0, 6, -4, 2, 0] }}
            transition={{ duration: bee.duration, delay: bee.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bee size={bee.size} />
          </motion.div>
        ))}

        <motion.div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ y: heroY }}>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Copy */}
            <motion.div
              className="flex flex-col gap-7"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 border border-primary/20 bg-primary/5">
                <motion.span className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-xs font-semibold text-primary tracking-wide">Smart Shopping Simplified</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.07] text-balance text-foreground">
                One Cart.{' '}
                <span className="text-primary">Smart Home.</span>{' '}
                <span style={{ color: '#D97706' }}>Zero Waste.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-balance max-w-md">
                Manage, track, and organise every household essential with precision.
                Smart alerts, real-time family sync, and a frictionless shopping experience.
              </p>

              {/* Stats strip */}
              <div className="flex flex-wrap gap-6 pt-1">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="h-12 px-7 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md w-full sm:w-auto">
                    Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="h-12 px-7 text-base w-full sm:w-auto border-primary/30 text-foreground hover:bg-primary/5">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust line */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Free to use · No credit card required · Family-friendly
              </p>
            </motion.div>

            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="relative"
            >
              {/* Floating grocery items behind card */}
              <div className="absolute -inset-8 pointer-events-none">
                <GroceryIllustration />
              </div>

              <GlassCard className="p-6 flex flex-col gap-5 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Good Morning</p>
                    <p className="text-sm font-bold text-foreground">Pantry Overview</p>
                  </div>
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total', value: '48', color: 'text-foreground', bg: 'rgba(22,163,74,0.06)' },
                    { label: 'In Stock', value: '41', color: 'text-primary', bg: 'rgba(22,163,74,0.10)' },
                    { label: 'Low', value: '7', color: 'text-amber-600', bg: 'rgba(245,158,11,0.10)' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3 text-center border border-border/50"
                      style={{ background: s.bg }}>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock level</span>
                    <span className="font-semibold text-primary">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.4, delay: 0.7, ease: 'easeOut' }} />
                  </div>
                </div>

                {/* Item list */}
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Olive Oil',  qty: '2 bottles', cat: 'Kitchen',  ok: true },
                    { name: 'Pasta',      qty: '3 packs',   cat: 'Pantry',   ok: true },
                    { name: 'Dish Soap',  qty: '0 left',    cat: 'Cleaning', ok: false },
                    { name: 'Rice',       qty: '1 bag',      cat: 'Pantry',   ok: false },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm ${
                        item.ok ? 'bg-white/80 border-border/40' : 'border-amber-200/60'
                      }`}
                      style={!item.ok ? { background: 'rgba(254,252,232,0.8)' } : undefined}
                    >
                      <div>
                        <p className={`font-medium text-sm ${item.ok ? 'text-foreground' : 'text-amber-700'}`}>{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.cat}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${item.ok ? 'text-muted-foreground' : 'text-amber-600'}`}>{item.qty}</span>
                        {!item.ok && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">Low</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer strip */}
                <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                  {[Package, ShoppingCart, Bell, Home, Shield].map((Icon, i) => (
                    <motion.div key={i}
                      className="h-7 w-7 rounded-lg flex items-center justify-center bg-primary/8"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}>
                      <Icon className="h-3 w-3 text-primary" />
                    </motion.div>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">Smart tracking</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 md:py-32 overflow-hidden bg-white">
        {/* Faint honeycomb side accents */}
        <div className="absolute top-0 left-0 w-32 h-full opacity-50 pointer-events-none">
          <HoneycombBg color="#16a34a" opacity={0.07} />
        </div>
        <div className="absolute top-0 right-0 w-32 h-full opacity-50 pointer-events-none">
          <HoneycombBg color="#F59E0B" opacity={0.05} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 self-center rounded-full px-4 py-1.5 bg-primary/8 border border-primary/15">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
              Everything You Need to Shop Smart
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              OneCart360 gives your household superpowers — track every item, prevent waste, and always shop with confidence.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <motion.div
                  className="group rounded-2xl border border-border/60 bg-white p-6 flex flex-col gap-4 shadow-sm cursor-default"
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(22,163,74,0.10)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.color}14` }}>
                    <f.icon className="h-5 w-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #fefce8 50%, #f0fdf4 100%)' }}
      >
        <HoneycombBg color="#16a34a" opacity={0.05} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 self-center rounded-full px-4 py-1.5 bg-white border border-primary/20 shadow-sm">
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
              Up and Running in 4 Steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto text-balance">
              No complex setup. Start managing your home inventory in minutes.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.1}>
                <div className="relative flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                  {/* Step number */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{ background: s.color }}>
                      {s.step}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="hidden lg:block flex-1 h-px border-t border-dashed border-border/60" />
                    )}
                  </div>
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ background: s.bg }}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section id="benefits" className="relative py-24 md:py-32 bg-white overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-40">
          <HoneycombBg color="#F59E0B" opacity={0.08} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 bg-amber-50 border border-amber-200/60">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-700">Why OneCart360</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
                A Smarter Way to Manage Your Home
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-balance">
                Say goodbye to forgotten purchases, duplicate items, and last-minute dashes to the store.
                OneCart360 keeps your household organised with zero effort.
              </p>
              <div className="flex flex-col gap-4">
                {BENEFITS.map((b, i) => (
                  <FadeUp key={b.title} delay={i * 0.08}>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${b.color}12` }}>
                        <b.icon className="h-4.5 w-4.5" style={{ color: b.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-0.5">{b.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

            {/* Testimonial card */}
            <FadeUp delay={0.2}>
              <GlassCard className="p-8 flex flex-col gap-6"
                style={{ background: 'linear-gradient(135deg, #f0fdf4, #fefce8)' } as React.CSSProperties}>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-foreground font-medium leading-relaxed text-balance">
                  &ldquo;OneCart360 completely changed how our family shops. We never run out of essentials
                  and our grocery waste is down by half. It&rsquo;s genuinely brilliant.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">SK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Sana K.</p>
                    <p className="text-xs text-muted-foreground">Family of 4 · Mumbai</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { value: '↓ 47%', label: 'Less grocery waste', color: '#16a34a' },
                    { value: '2 hrs', label: 'Saved per week',      color: '#22c55e' },
                    { value: '100%', label: 'Family in sync',       color: '#16a34a' },
                    { value: '0',    label: 'Duplicate purchases',  color: '#D97706' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3 bg-white/60 border border-border/40">
                      <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)' }}>
        {/* Subtle honey-gold honeycomb */}
        <HoneycombBg color="#fef08a" opacity={0.06} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(254,240,138,0.08) 0%, transparent 70%)' }} />

        {/* Floating bees on banner */}
        {[{ x: 5, y: 20, size: 24, delay: 1 }, { x: 90, y: 60, size: 22, delay: 3 }].map((bee) => (
          <motion.div key={bee.x} className="pointer-events-none absolute"
            style={{ left: `${bee.x}%`, top: `${bee.y}%` }}
            animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
            transition={{ duration: 16, delay: bee.delay, repeat: Infinity, ease: 'easeInOut' }}>
            <Bee size={bee.size} />
          </motion.div>
        ))}

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp className="flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 self-center rounded-full px-4 py-1.5 bg-white/15 border border-white/25">
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              <span className="text-xs font-semibold text-white">Start Today — It&rsquo;s Free</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Ready for Smarter Shopping?
            </h2>
            <p className="text-green-100 text-lg leading-relaxed text-balance">
              Join thousands of families who never run out of essentials.
              OneCart360 is free, fast, and built for real life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg"
                  className="h-12 px-8 text-base font-semibold bg-white text-primary hover:bg-white/90 shadow-lg w-full sm:w-auto">
                  Create Free Account <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline"
                  className="h-12 px-8 text-base bg-low-stock-bg text-foreground hover:bg-low-stock-bg/80 border-0 w-full sm:w-auto font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-green-200 text-xs">Free forever · No credit card · 2-minute setup</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">OneCart360</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Smart home inventory management for modern families.
                Track, manage, and shop smarter — all in one place.
              </p>
            </div>

            {/* Product */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Product</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link href="/auth/sign-up" className="hover:text-foreground transition-colors">Get Started</Link></li>
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">Company</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
                <li><a href="mailto:support@onecart360.com" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} OneCart360. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with care for smarter homes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

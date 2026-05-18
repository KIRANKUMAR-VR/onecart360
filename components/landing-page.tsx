'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, Package, TrendingDown, Users, AlertCircle,
  Shield, Home, CheckCircle2, ShoppingCart, Bell, Zap,
  Star, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

// ── Honeycomb SVG background ──────────────────────────────────────────────────
function HoneycombBg({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          {/* Row 1 */}
          <polygon
            points="15,1 45,1 60,27 45,53 15,53 0,27"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Row 2 offset */}
          <polygon
            points="45,27 75,27 90,53 75,79 45,79 30,53"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#hex)"
        style={{ opacity, color: 'var(--honey-deep)' }}
      />
    </svg>
  )
}

// ── Floating bee SVG ──────────────────────────────────────────────────────────
function Bee({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Body */}
      <ellipse cx="24" cy="28" rx="10" ry="13" fill="#F5A623" />
      {/* Stripes */}
      <rect x="14" y="23" width="20" height="4" rx="2" fill="#1a1a1a" opacity="0.7" />
      <rect x="14" y="31" width="20" height="4" rx="2" fill="#1a1a1a" opacity="0.7" />
      {/* Head */}
      <circle cx="24" cy="15" r="7" fill="#F5A623" />
      {/* Antennae */}
      <line x1="21" y1="9" x2="16" y2="3" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.5" cy="2.5" r="1.5" fill="#1a1a1a" />
      <line x1="27" y1="9" x2="32" y2="3" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32.5" cy="2.5" r="1.5" fill="#1a1a1a" />
      {/* Wings */}
      <ellipse cx="10" cy="22" rx="9" ry="5" fill="white" opacity="0.75" transform="rotate(-20 10 22)" />
      <ellipse cx="38" cy="22" rx="9" ry="5" fill="white" opacity="0.75" transform="rotate(20 38 22)" />
      {/* Eyes */}
      <circle cx="21" cy="14" r="1.5" fill="#1a1a1a" />
      <circle cx="27" cy="14" r="1.5" fill="#1a1a1a" />
    </svg>
  )
}

// ── Floating particles ────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  duration: 6 + Math.random() * 6,
}))

const BEES = [
  { x: 10, y: 20, scale: 0.6, delay: 0, duration: 18 },
  { x: 75, y: 10, scale: 0.5, delay: 3, duration: 22 },
  { x: 85, y: 55, scale: 0.55, delay: 6, duration: 20 },
  { x: 5, y: 70, scale: 0.45, delay: 9, duration: 25 },
]

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Package, title: 'Manage Your Items', description: 'Add and organise every household item in one unified list — no spreadsheets required.' },
  { icon: TrendingDown, title: 'Track Stock in Real Time', description: 'Monitor quantities as you use them and always know exactly what you have on hand.' },
  { icon: AlertCircle, title: 'Low-Stock Alerts', description: 'Get notified before you run out so you can restock at the right time, every time.' },
  { icon: Users, title: 'Share with Family', description: 'Invite household members so everyone stays in sync — no more duplicate purchases.' },
  { icon: Home, title: 'Stay Organised', description: 'Group items by category and location for a clear, structured view of your home.' },
  { icon: Shield, title: 'Avoid Waste', description: 'Know exactly what you already own to prevent over-buying and reduce spoilage.' },
]

const STEPS = [
  { step: 1, title: 'Add Items', description: 'Build your household inventory in minutes.', icon: Package },
  { step: 2, title: 'Track Usage', description: 'Update quantities as you go.', icon: TrendingDown },
  { step: 3, title: 'Get Alerts', description: 'Receive low-stock notifications instantly.', icon: Bell },
  { step: 4, title: 'Shop Smart', description: 'Make informed, intentional purchases.', icon: ShoppingCart },
]

const BENEFITS = [
  { icon: CheckCircle2, title: 'Saves Time', description: 'Less time checking shelves, more time for what matters.' },
  { icon: ShoppingCart, title: 'Reduces Waste', description: 'Buy only what you need, when you need it.' },
  { icon: Zap, title: 'Real-Time Sync', description: 'Instant updates across all household members.' },
  { icon: Star, title: 'Always Informed', description: 'Smart alerts keep every family member updated.' },
]

const STATS = [
  { value: '10k+', label: 'Happy Families' },
  { value: '500k+', label: 'Items Tracked' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '4.9', label: 'App Rating' },
]

// ── Glassmorphism card ────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-honey/20 bg-white/60 backdrop-blur-md shadow-lg ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(245,166,35,0.10)' }}
    >
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: 'var(--cream)' }}>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-honey/20 backdrop-blur-xl"
        style={{ background: 'rgba(255,248,220,0.85)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
            >
              <Package className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-foreground tracking-tight text-sm">OneCart360</span>
              <span className="text-[10px] text-honey-deep font-medium">Smart Shopping</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[['Features', '#features'], ['How It Works', '#how-it-works'], ['About', '#about']].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="sm"
                className="text-sm font-semibold text-white shadow-sm"
                style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
              >
                Get Started
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden pt-12 pb-20"
        style={{ background: 'linear-gradient(160deg, #fffbeb 0%, #fef3c7 40%, #fffbf0 100%)' }}
      >
        {/* Honeycomb BG */}
        <HoneycombBg opacity={0.08} />

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(245,166,35,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Floating bees */}
        {BEES.map((bee) => (
          <motion.div
            key={bee.x}
            className="pointer-events-none absolute"
            style={{ left: `${bee.x}%`, top: `${bee.y}%` }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 15, -8, 0],
              rotate: [0, 8, -5, 3, 0],
            }}
            transition={{
              duration: bee.duration,
              delay: bee.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Bee className={`opacity-60`} style={{ width: `${bee.scale * 80}px`, height: `${bee.scale * 80}px` } as React.CSSProperties} />
          </motion.div>
        ))}

        {/* Floating glowing particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: 'radial-gradient(circle, #F5A623, #F59E0B)',
              boxShadow: '0 0 8px 2px rgba(245,166,35,0.5)',
            }}
            animate={{ y: [0, -18, 0], opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          style={{ y: heroY }}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <motion.div
              className="flex flex-col gap-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 border border-honey/30"
                style={{ background: 'rgba(245,166,35,0.12)', backdropFilter: 'blur(8px)' }}
              >
                <motion.span
                  className="h-2 w-2 rounded-full bg-honey"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-semibold text-honey-deep tracking-wide">
                  OneCart360 — Smart Shopping Simplified
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-balance text-foreground">
                Your Home.{' '}
                <span style={{ color: 'var(--honey-deep)' }}>One Cart.</span>{' '}
                360° Control.
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-balance max-w-md">
                Manage, track, and organise every household essential with precision.
                Smart alerts, real-time sync, and a frictionless shopping experience.
              </p>

              {/* Stats strip */}
              <div className="flex flex-wrap gap-6 pt-1">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="h-12 px-7 text-base font-semibold text-white w-full sm:w-auto shadow-md"
                    style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 text-base w-full sm:w-auto border-honey/40 text-foreground hover:bg-honey-light/60"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero glassmorphism card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            >
              <GlassCard className="p-6 flex flex-col gap-5">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Good Morning</p>
                    <p className="text-sm font-bold text-foreground">Your Pantry Overview</p>
                  </div>
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--honey-light), var(--honey-glow))' }}
                  >
                    <Package className="h-4 w-4 text-honey-deep" />
                  </div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Items', value: '48', color: 'text-foreground' },
                    { label: 'In Stock', value: '41', color: 'text-primary' },
                    { label: 'Low Stock', value: '7', color: 'text-honey-deep' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-honey/15 p-3 text-center"
                      style={{ background: 'rgba(255,248,220,0.7)' }}
                    >
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Honeycomb progress */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock level</span>
                    <span className="font-semibold text-honey-deep">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-honey-light/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, var(--honey-glow), var(--honey), var(--honey-deep))' }}
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Item rows */}
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Olive Oil', qty: '2 bottles', cat: 'Kitchen', ok: true },
                    { name: 'Pasta', qty: '3 packs', cat: 'Pantry', ok: true },
                    { name: 'Dish Soap', qty: '0 left', cat: 'Cleaning', ok: false },
                    { name: 'Rice', qty: '1 bag', cat: 'Pantry', ok: false },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm ${
                        item.ok
                          ? 'bg-white/70 border-honey/10'
                          : 'border-honey/30'
                      }`}
                      style={!item.ok ? { background: 'rgba(245,166,35,0.12)' } : undefined}
                    >
                      <div className="flex flex-col">
                        <span className={`font-medium text-sm ${item.ok ? 'text-foreground' : 'text-honey-deep'}`}>
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{item.cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${item.ok ? 'text-muted-foreground' : 'text-honey-deep'}`}>
                          {item.qty}
                        </span>
                        {!item.ok && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: 'var(--honey-deep)' }}
                          >
                            Low
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating grocery icons strip */}
                <div className="flex items-center gap-3 pt-1 border-t border-honey/10">
                  {[ShoppingCart, Package, Home, Bell, Shield].map((Icon, i) => (
                    <motion.div
                      key={i}
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(245,166,35,0.13)' }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Icon className="h-3.5 w-3.5 text-honey-deep" />
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
      <section
        id="features"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fffbf0 0%, #fff8e1 100%)' }}
      >
        <HoneycombBg opacity={0.05} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-deep">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Smart Tools for Better Living
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-xl mx-auto">
              Everything you need to stay on top of your home inventory — nothing you don&apos;t.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <GlassCard className="p-7 flex flex-col gap-4 h-full hover:border-honey/40 transition-colors duration-200">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--honey-light), var(--honey-glow))' }}
                  >
                    <feature.icon className="h-5 w-5 text-honey-deep" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: '#fffbeb' }}
      >
        <HoneycombBg opacity={0.07} />

        {/* Glowing connection lines behind steps */}
        <div className="pointer-events-none absolute top-1/2 left-[10%] right-[10%] h-px hidden md:block"
          style={{ background: 'linear-gradient(90deg, transparent, var(--honey-glow), var(--honey), var(--honey-glow), transparent)', boxShadow: '0 0 12px 2px rgba(245,166,35,0.3)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-deep">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Up and Running in Minutes
            </h2>
            <p className="text-lg text-muted-foreground text-balance max-w-xl mx-auto">
              Four simple steps to a perfectly organised home.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                className="flex flex-col items-center text-center gap-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <motion.div
                  className="relative h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10"
                  style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.step}
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{ boxShadow: '0 0 20px 6px rgba(245,166,35,0.5)' }}
                  />
                </motion.div>
                <div className="flex flex-col gap-1.5">
                  <div
                    className="h-8 w-8 rounded-lg mx-auto mb-1 flex items-center justify-center"
                    style={{ background: 'rgba(245,166,35,0.15)' }}
                  >
                    <item.icon className="h-4 w-4 text-honey-deep" />
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #fff8e1 0%, #fffbf0 100%)' }}
      >
        <HoneycombBg opacity={0.05} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-deep">Why OneCart360</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Built Around Your Daily Life
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <GlassCard className="p-7 flex flex-col gap-4 items-start h-full hover:border-honey/40 transition-colors duration-200">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--honey-light), var(--honey-glow))' }}
                  >
                    <benefit.icon className="h-5 w-5 text-honey-deep" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: '#fffbeb' }}
      >
        <HoneycombBg opacity={0.06} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-deep">About</p>
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
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--honey-deep) 0%, var(--honey) 60%, #fbbf24 100%)' }}
      >
        <HoneycombBg opacity={0.1} />

        {/* Floating bees in CTA */}
        <motion.div
          className="pointer-events-none absolute right-16 top-8"
          animate={{ x: [0, 20, -10, 0], y: [0, -12, 8, 0], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bee style={{ width: 60, height: 60, opacity: 0.35 } as React.CSSProperties} />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute left-12 bottom-8"
          animate={{ x: [0, -15, 10, 0], y: [0, 10, -8, 0], rotate: [0, -8, 4, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        >
          <Bee style={{ width: 44, height: 44, opacity: 0.25 } as React.CSSProperties} />
        </motion.div>

        <motion.div
          className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance drop-shadow-sm">
            Start Managing Your Home Today
          </h2>
          <p className="text-lg text-white/85 text-balance">
            Join thousands of families organising their homes with OneCart360.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold w-full sm:w-auto shadow-lg"
                style={{ background: 'white', color: 'var(--honey-deep)' }}
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/15"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-honey/15 py-12"
        style={{ background: '#fffbeb' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: 'linear-gradient(135deg, var(--honey), var(--honey-deep))' }}
                >
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-foreground text-sm">OneCart360</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Smart Shopping Simplified.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground">support@onecart360.com</p>
            </div>
          </div>

          <div className="border-t border-honey/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} OneCart360. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded bg-honey-light flex items-center justify-center"
              >
                <Package className="h-3 w-3 text-honey-deep" />
              </div>
              <span>OneCart360</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

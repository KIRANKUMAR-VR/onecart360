'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Package, TrendingDown, Users, AlertCircle, Shield, Home, Heart } from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">OneCart360</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">How It Works</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">About</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                All Your Essentials. One Place.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-balance">
                Manage, track, and organize your home items effortlessly. Never run out of supplies again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 min-h-96 flex items-center justify-center border border-primary/20">
                <div className="text-center">
                  <Package className="w-24 h-24 text-primary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Smart Features for Better Living
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Everything you need to manage your home inventory with ease
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: 'Manage Your Items',
                description: 'Easily add and organize all your household items in one place'
              },
              {
                icon: TrendingDown,
                title: 'Track Stock Easily',
                description: 'Monitor your stock levels in real-time and stay updated'
              },
              {
                icon: AlertCircle,
                title: 'Never Run Out',
                description: 'Get alerts before items finish so you can restock in time'
              },
              {
                icon: Users,
                title: 'Share with Family',
                description: 'Collaborate with family members for seamless home management'
              },
              {
                icon: Home,
                title: 'Stay Organized',
                description: 'Maintain a clear view of your inventory and daily needs'
              },
              {
                icon: Shield,
                title: 'Avoid Duplicates',
                description: 'Know exactly what you have to prevent unnecessary purchases'
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Simple steps to get your home inventory organized
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
            
            {[
              { step: 1, title: 'Add Items', description: 'Create a list of your household items' },
              { step: 2, title: 'Track Usage', description: 'Update quantities as you use items' },
              { step: 3, title: 'Get Alerts', description: 'Receive notifications for low stock' },
              { step: 4, title: 'Shop Smart', description: 'Make informed shopping decisions' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-lg z-10 relative">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Why Choose OneCart360?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '⏱️', title: 'Saves Time', description: 'Reduce time spent on shopping and inventory checks' },
              { icon: '♻️', title: 'Reduces Waste', description: 'Prevent spoilage with better tracking' },
              { icon: '🏠', title: 'Organized Home', description: 'Keep everything structured and accessible' },
              { icon: '👨‍👩‍👧‍👦', title: 'Family Friendly', description: 'Perfect solution for managing household needs' },
            ].map((benefit, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-md transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            About OneCart360
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
            OneCart360 is a smart home inventory and grocery management platform designed to simplify your daily life. 
            We help you manage, track, and organize household essentials with ease. No more guessing, no more last-minute runs. 
            Just simple, efficient home management.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Start Managing Your Home Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Join thousands of families organizing their homes with OneCart360
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">OneCart360</span>
              </div>
              <p className="text-sm text-muted-foreground">Manage your home inventory with ease</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">support@onecart360.com</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 OneCart360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

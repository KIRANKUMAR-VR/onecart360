'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Home, Bell, Settings, Lock, Zap, Upload, Mail, Phone, MapPin, Users, Copy, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [householdMembers, setHouseholdMembers] = useState('1')

  // Preferences state
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [shoppingTips, setShoppingTips] = useState(false)
  const [defaultUnit, setDefaultUnit] = useState('kg')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Family sharing state
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          router.push('/auth/login')
          return
        }

        // Get user profile from metadata or create default
        const profile: UserProfile = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
          phone: authUser.user_metadata?.phone || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
        }

        setUser(profile)
        setName(profile.name || '')
        setPhone(profile.phone || '')
        setHouseholdName(authUser.user_metadata?.household_name || `${profile.name}'s Home`)
        
        // Load preferences from localStorage for now (can be moved to database)
        const savedPrefs = localStorage.getItem('app_preferences')
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs)
          setLowStockAlerts(prefs.lowStockAlerts ?? true)
          setDailyReminders(prefs.dailyReminders ?? true)
          setShoppingTips(prefs.shoppingTips ?? false)
          setDefaultUnit(prefs.defaultUnit ?? 'kg')
          setTheme(prefs.theme ?? 'light')
        }
      } catch (err) {
        console.error('[v0] Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          phone,
          household_name: householdName,
        },
      })

      if (error) throw error
      
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('[v0] Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true)
      const prefs = {
        lowStockAlerts,
        dailyReminders,
        shoppingTips,
        defaultUnit,
        theme,
      }
      localStorage.setItem('app_preferences', JSON.stringify(prefs))
      setSuccess('Preferences saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      setError('Please enter an email address')
      return
    }

    try {
      setIsInviting(true)
      setError(null)
      
      // In a real app, this would send an invite email
      const newMember = {
        id: Math.random().toString(),
        email: inviteEmail,
        role: 'Member',
        status: 'pending',
      }
      
      setFamilyMembers([...familyMembers, newMember])
      setInviteEmail('')
      setSuccess('Invite sent to ' + inviteEmail)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to send invite')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== memberId))
    setSuccess('Member removed successfully')
    setTimeout(() => setSuccess(null), 3000)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen pb-8 bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24 bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">{user?.name || 'Profile'}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-2">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Personal Details Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground mb-1 block">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">
                Email (Read-only)
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="h-9 bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-1 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-9"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </Card>

        {/* Household Settings Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Household Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="household-name" className="text-sm font-medium text-foreground mb-1 block">
                Household Name
              </Label>
              <Input
                id="household-name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g., Kiran's Home"
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="members" className="text-sm font-medium text-foreground mb-1 block">
                Number of Members
              </Label>
              <Input
                id="members"
                type="number"
                min="1"
                value={householdMembers}
                onChange={(e) => setHouseholdMembers(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </Card>

        {/* Family Sharing Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Family Sharing
          </h3>
          
          <div className="space-y-4 mb-4">
            <div className="flex gap-2">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter family member email"
                className="h-9"
              />
              <Button
                onClick={handleSendInvite}
                disabled={isInviting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Invite
              </Button>
            </div>
          </div>

          {familyMembers.length > 0 ? (
            <div className="space-y-2">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">{member.role} • {member.status}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No family members added yet</p>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-foreground">Low Stock Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when items run out</p>
              </div>
              <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-foreground">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">Receive daily inventory reminders</p>
              </div>
              <Switch checked={dailyReminders} onCheckedChange={setDailyReminders} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-foreground">Shopping Tips</p>
                <p className="text-xs text-muted-foreground">Get smart shopping suggestions</p>
              </div>
              <Switch checked={shoppingTips} onCheckedChange={setShoppingTips} />
            </div>
            <Button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>

        {/* App Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            App Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="unit" className="text-sm font-medium text-foreground mb-1 block">
                Default Unit
              </Label>
              <select
                id="unit"
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value)}
                className="w-full h-9 px-3 border border-input rounded-md bg-background text-foreground"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ltr">Liters (ltr)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="theme" className="text-sm font-medium text-foreground mb-1 block">
                Theme
              </Label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="w-full h-9 px-3 border border-input rounded-md bg-background text-foreground"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
            <Button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security Settings
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your account security and access
          </p>
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/auth/login')
            }}
          >
            Logout
          </Button>
        </Card>
      </div>
    </main>
  )
}

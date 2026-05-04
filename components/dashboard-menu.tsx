'use client'

import { Menu, LogOut, Info, Mail, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function DashboardMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/auth/login')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 sm:w-80">
        <SheetHeader className="mb-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/#about"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
          >
            <Info className="h-5 w-5 text-primary" />
            <span className="font-medium">About Us</span>
          </Link>
          
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground"
          >
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-medium">Contact Us</span>
          </Link>

          <div className="my-2 h-px bg-border" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, ChevronDown, Package } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { PantryList } from "@/components/pantry-list"
import { CameraScan } from "@/components/camera-scan"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const { items, toggleStock, addItems, isLoading, error } = useItems()
  const isMobile = useIsMobile()
  const [stockInOpen, setStockInOpen] = useState(true)
  const [stockOutOpen, setStockOutOpen] = useState(true)

  const inStockItems = items.filter((item) => item.inStock)
  const outOfStockItems = items.filter((item) => !item.inStock)

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/5">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Image
                src="/logo.png"
                alt="OneCart360"
                width={40}
                height={40}
                className="h-10 w-10 flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">OneCart360</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {items.length === 0 
                    ? "Track your home inventory"
                    : `${inStockItems.length} in stock • ${outOfStockItems.length} need refill`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isMobile && <CameraScan onImport={addItems} />}
              <Button asChild size="sm" className="gap-2">
                <Link href="/items">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Item</span>
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading your inventory...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
            <p className="text-sm text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No items yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">Start by adding items to your inventory. Track your home essentials all in one place.</p>
            <Button asChild>
              <Link href="/items" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Item
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="space-y-6">
            {/* Out of Stock Section */}
            {outOfStockItems.length > 0 && (
              <div>
                <Collapsible open={stockOutOpen} onOpenChange={setStockOutOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-out-stock-bg hover:bg-opacity-80 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-out-stock" />
                        <span className="font-semibold text-out-stock">Out of Stock</span>
                        <span className="text-sm font-medium text-out-stock/70">({outOfStockItems.length})</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-out-stock transition-transform duration-200",
                        stockOutOpen && "rotate-180"
                      )} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-3">
                    <PantryList
                      items={outOfStockItems}
                      onToggleStock={toggleStock}
                      showStockToggle
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* In Stock Section */}
            {inStockItems.length > 0 && (
              <div>
                <Collapsible open={stockInOpen} onOpenChange={setStockInOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-in-stock-bg hover:bg-opacity-80 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-in-stock" />
                        <span className="font-semibold text-in-stock">In Stock</span>
                        <span className="text-sm font-medium text-in-stock/70">({inStockItems.length})</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-in-stock transition-transform duration-200",
                        stockInOpen && "rotate-180"
                      )} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-3">
                    <PantryList
                      items={inStockItems}
                      onToggleStock={toggleStock}
                      showStockToggle
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

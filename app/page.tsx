"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, ChevronDown, Package, PackageX } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { PantryList } from "@/components/pantry-list"
import { CameraScan } from "@/components/camera-scan"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export default function Home() {
  const { items, toggleStock, addItems } = useItems()
  const isMobile = useIsMobile()
  const [stockInOpen, setStockInOpen] = useState(true)
  const [stockOutOpen, setStockOutOpen] = useState(true)

  const inStockItems = items.filter((item) => item.inStock)
  const outOfStockItems = items.filter((item) => !item.inStock)

  return (
    <main className="min-h-screen pb-8">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="OneCart360"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-semibold text-balance">OneCart360</h1>
                <p className="text-sm text-muted-foreground">
                  {items.length === 0 
                    ? "Add items to get started"
                    : `${items.length} item${items.length !== 1 ? "s" : ""} • ${inStockItems.length} in stock`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMobile && <CameraScan onImport={addItems} />}
              <Button asChild size="sm">
                <Link href="/items">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 flex flex-col gap-4">
        {/* Stock Out Category */}
        <Collapsible open={stockOutOpen} onOpenChange={setStockOutOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full p-3 rounded-lg bg-destructive/10 hover:bg-destructive/15 transition-colors">
              <div className="flex items-center gap-2">
                <PackageX className="h-5 w-5 text-destructive" />
                <span className="font-medium text-foreground">Out of Stock</span>
                <span className="text-sm text-muted-foreground">({outOfStockItems.length})</span>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                stockOutOpen && "rotate-180"
              )} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <PantryList
              items={outOfStockItems}
              onToggleStock={toggleStock}
              showStockToggle
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Stock In Category */}
        <Collapsible open={stockInOpen} onOpenChange={setStockInOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">In Stock</span>
                <span className="text-sm text-muted-foreground">({inStockItems.length})</span>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                stockInOpen && "rotate-180"
              )} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <PantryList
              items={inStockItems}
              onToggleStock={toggleStock}
              showStockToggle
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </main>
  )
}

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus, ChevronDown, Package, PackageX,
  Search, X, AlertTriangle
} from "lucide-react"
import { useItems } from "@/contexts/items-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { CameraScan } from "@/components/camera-scan"
import { DashboardMenu } from "@/components/dashboard-menu"
import { EditQuantityDialog } from "@/components/edit-quantity-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { PantryItemData } from "@/components/pantry-item"

type FilterType = "all" | "in-stock" | "out-of-stock"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

// Inline modern card — only used on dashboard
function DashboardItemCard({
  item,
  onToggleStock,
  onEditClick,
}: {
  item: PantryItemData
  onToggleStock: (id: string, inStock: boolean) => Promise<void>
  onEditClick: (item: PantryItemData) => void
}) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    try {
      setIsToggling(true)
      await onToggleStock(item.id, !item.inStock)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-card shadow-sm border border-border/50 transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        !item.inStock && "bg-low-stock-bg border-yellow-200"
      )}
    >
      {/* Left: name + qty */}
      <button
        className="flex-1 min-w-0 text-left"
        onClick={() => onEditClick(item)}
        aria-label={`Edit ${item.name}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "font-semibold text-sm truncate",
            !item.inStock && "text-low-stock"
          )}>
            {item.name}
          </span>
          {!item.inStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 shrink-0">
              <AlertTriangle className="h-2.5 w-2.5" />
              Needs Refill
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.quantity} {item.unit} &middot; {item.category}
        </p>
      </button>

      {/* Right: status pill + toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 border",
            item.inStock
              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              : "bg-muted text-muted-foreground border-border hover:bg-accent",
            isToggling && "opacity-50 cursor-not-allowed"
          )}
          aria-label={item.inStock ? "Mark as out of stock" : "Mark as in stock"}
        >
          {isToggling ? "..." : item.inStock ? "In Stock" : "Out of Stock"}
        </button>
      </div>
    </div>
  )
}

// Loading skeleton
function SkeletonCard() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-card border border-border/50 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded w-2/5" />
        <div className="h-2.5 bg-muted rounded w-1/4" />
      </div>
      <div className="h-7 w-20 bg-muted rounded-full" />
    </div>
  )
}

export default function Dashboard() {
  const { items, toggleStock, addItems, updateItem, isLoading, error } = useItems()
  const isMobile = useIsMobile()
  const [stockInOpen, setStockInOpen] = useState(true)
  const [stockOutOpen, setStockOutOpen] = useState(true)
  const [editingItem, setEditingItem] = useState<PantryItemData | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  const handleSaveQuantity = async (newQuantity: number) => {
    if (!editingItem) return
    try {
      setIsUpdating(true)
      await updateItem(editingItem.id, editingItem.name, newQuantity, editingItem.unit, editingItem.category)
      setEditingItem(null)
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredItems = useMemo(() => {
    let result = items
    if (filter === "in-stock") result = result.filter(i => i.inStock)
    if (filter === "out-of-stock") result = result.filter(i => !i.inStock)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [items, filter, search])

  const inStockItems = filteredItems.filter(i => i.inStock)
  const outOfStockItems = filteredItems.filter(i => !i.inStock)
  const totalItems = items.length
  const outOfStockCount = items.filter(i => !i.inStock).length

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "In Stock", value: "in-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
  ]

  return (
    <main className="min-h-screen pb-24">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo + greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src="/logo.png"
                alt="OneCart360"
                width={38}
                height={38}
                className="h-9 w-9 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium leading-none mb-0.5">
                  {getGreeting()} 👋
                </p>
                <h1 className="text-lg font-bold text-foreground leading-tight truncate">
                  OneCart360
                </h1>
              </div>
            </div>

            {/* Summary badges */}
            {totalItems > 0 && (
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {totalItems} items
                </span>
                {outOfStockCount > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                    {outOfStockCount} low
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isMobile && <CameraScan onImport={addItems} />}
              <Button asChild size="sm" className="h-8 px-3 text-xs font-semibold">
                <Link href="/items">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Item
                </Link>
              </Button>
              <DashboardMenu />
            </div>
          </div>

          {/* Mobile summary row */}
          {totalItems > 0 && (
            <div className="flex sm:hidden items-center gap-2 mt-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {totalItems} items
              </span>
              {outOfStockCount > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                  {outOfStockCount} need refill
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 flex flex-col gap-4">

        {/* ── Search + Filter ── */}
        {!isLoading && items.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-9 h-10 bg-card border-border/60 rounded-xl text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2">
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200",
                    filter === f.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Package className="h-8 w-8 text-primary/60" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No items yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start adding your household essentials.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/items">
                <Plus className="h-4 w-4 mr-1" />
                Add your first item
              </Link>
            </Button>
          </div>
        )}

        {/* ── No search results ── */}
        {!isLoading && items.length > 0 && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try a different search or filter.
            </p>
          </div>
        )}

        {/* ── Item sections ── */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="flex flex-col gap-4">

            {/* Out of Stock */}
            {outOfStockItems.length > 0 && (
              <Collapsible open={stockOutOpen} onOpenChange={setStockOutOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <PackageX className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-sm text-yellow-800">Out of Stock</span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-yellow-200 text-yellow-700">
                        {outOfStockItems.length}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-yellow-600 transition-transform duration-200",
                      stockOutOpen && "rotate-180"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2 mt-2">
                    {outOfStockItems.map(item => (
                      <DashboardItemCard
                        key={item.id}
                        item={item}
                        onToggleStock={toggleStock}
                        onEditClick={setEditingItem}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* In Stock */}
            {inStockItems.length > 0 && (
              <Collapsible open={stockInOpen} onOpenChange={setStockInOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-primary/8 border border-primary/15 hover:bg-primary/12 transition-colors">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm text-primary">In Stock</span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                        {inStockItems.length}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-primary transition-transform duration-200",
                      stockInOpen && "rotate-180"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2 mt-2">
                    {inStockItems.map(item => (
                      <DashboardItemCard
                        key={item.id}
                        item={item}
                        onToggleStock={toggleStock}
                        onEditClick={setEditingItem}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
      </div>

      {/* ── Floating Add Button (mobile) ── */}
      {isMobile && (
        <Link
          href="/items"
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-200 font-semibold text-sm"
          aria-label="Add item"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </Link>
      )}

      {/* ── Edit Quantity Dialog ── */}
      <EditQuantityDialog
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveQuantity}
        isLoading={isUpdating}
      />
    </main>
  )
}

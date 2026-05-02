"use client"

import { Package } from "lucide-react"
import { PantryItem, type PantryItemData } from "./pantry-item"
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface PantryListProps {
  items: PantryItemData[]
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onToggleStock?: (id: string, inStock: boolean) => Promise<void>
  readOnly?: boolean
  showStockToggle?: boolean
}

export function PantryList({ items, onIncrease, onDecrease, onDelete, onEdit, onToggleStock, readOnly = false, showStockToggle = false }: PantryListProps) {
  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No items added yet</EmptyTitle>
          <EmptyDescription>
            Start by adding items to your kitchen stock using the form above.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <PantryItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleStock={onToggleStock}
          readOnly={readOnly}
          showStockToggle={showStockToggle}
        />
      ))}
    </div>
  )
}

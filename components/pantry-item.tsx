"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface PantryItemData {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  inStock: boolean
}

interface PantryItemProps {
  item: PantryItemData
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onToggleStock?: (id: string, inStock: boolean) => Promise<void>
  readOnly?: boolean
  showStockToggle?: boolean
}

export function PantryItem({ item, onIncrease, onDecrease, onDelete, onEdit, onToggleStock, readOnly = false, showStockToggle = false }: PantryItemProps) {
  const [isTogglingStock, setIsTogglingStock] = useState(false)
  const isLowStock = item.quantity <= 1
  
  const handleToggleStock = async (checked: boolean) => {
    try {
      setIsTogglingStock(true)
      await onToggleStock?.(item.id, checked)
    } catch (err) {
      console.error('[v0] Toggle stock error:', err)
    } finally {
      setIsTogglingStock(false)
    }
  }

  return (
    <Card className="p-4 border-0 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {item.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              {item.quantity} {item.unit}
            </span>
            {item.category && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                {item.category}
              </span>
            )}
            {isLowStock && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold text-out-stock bg-out-stock-bg rounded-full">
                Low Stock
              </span>
            )}
          </div>
        </div>
        
        {/* Right: Status & Actions */}
        <div className="flex flex-col items-end gap-3">
          {/* Status Pill */}
          {showStockToggle && onToggleStock && (
            <button
              onClick={() => handleToggleStock(!item.inStock)}
              disabled={isTogglingStock}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                item.inStock
                  ? "bg-in-stock-bg text-in-stock hover:bg-opacity-80"
                  : "bg-out-stock-bg text-out-stock hover:bg-opacity-80",
                isTogglingStock && "opacity-60 cursor-not-allowed"
              )}
            >
              {isTogglingStock ? "Updating..." : item.inStock ? "In Stock" : "Out of Stock"}
            </button>
          )}
          
          {/* Action Buttons */}
          {!readOnly && !showStockToggle && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDecrease?.(item.id)}
                disabled={item.quantity <= 0}
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center font-semibold tabular-nums text-sm">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onIncrease?.(item.id)}
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(item.id)}
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete?.(item.id)}
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

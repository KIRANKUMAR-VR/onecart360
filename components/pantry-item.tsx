"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface PantryItemData {
  id: string
  name: string
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
  onToggleStock?: (id: string, inStock: boolean) => void
  readOnly?: boolean
  showStockToggle?: boolean
}

export function PantryItem({ item, onIncrease, onDecrease, onDelete, onEdit, onToggleStock, readOnly = false, showStockToggle = false }: PantryItemProps) {
  const [isTogglingStock, setIsTogglingStock] = useState(false)
  const isLowStock = item.quantity <= 1 || !item.inStock
  
  const handleToggleStock = async (checked: boolean) => {
    if (!item.id) {
      console.error('[v0] Cannot toggle stock: item.id is undefined')
      return
    }
    
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
    <Card
      className={cn(
        "p-4 transition-all duration-200",
        isLowStock && "border-low-stock bg-low-stock-bg"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium truncate",
            isLowStock && "text-low-stock"
          )}>
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {item.quantity} {item.unit}
          </p>
        </div>
        
        {showStockToggle && onToggleStock && (
          <div className="flex items-center gap-2">
            <Switch
              id={`stock-toggle-${item.id}`}
              checked={item.inStock}
              disabled={isTogglingStock}
              onCheckedChange={handleToggleStock}
              aria-label={`Toggle stock for ${item.name}`}
            />
            <Label 
              htmlFor={`stock-toggle-${item.id}`}
              className={cn(
                "text-sm font-medium cursor-pointer",
                item.inStock ? "text-primary" : "text-muted-foreground",
                isTogglingStock && "opacity-50"
              )}
            >
              {isTogglingStock ? "Updating..." : item.inStock ? "In Stock" : "Out of Stock"}
            </Label>
          </div>
        )}
        
        {!readOnly && !showStockToggle && (
          <div className="flex items-center gap-2">
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
            
            <span className="w-8 text-center font-medium tabular-nums">
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
    </Card>
  )
}

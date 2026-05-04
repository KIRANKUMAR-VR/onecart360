"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EditQuantityDialog } from "@/components/edit-quantity-dialog"
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
  onUpdateQuantity?: (id: string, quantity: number) => Promise<void>
  onToggleStock?: (id: string, inStock: boolean) => Promise<void>
  readOnly?: boolean
  showStockToggle?: boolean
}

export function PantryItem({ item, onIncrease, onDecrease, onDelete, onEdit, onUpdateQuantity, onToggleStock, readOnly = false, showStockToggle = false }: PantryItemProps) {
  const [isTogglingStock, setIsTogglingStock] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const isLowStock = !item.inStock
  
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

  const handleSaveQuantity = async (newQuantity: number) => {
    try {
      setIsSaving(true)
      await onUpdateQuantity?.(item.id, newQuantity)
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error('[v0] Update quantity error:', err)
      alert('Failed to update quantity')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditClick = () => {
    setIsEditDialogOpen(true)
    onEdit?.(item.id)
  }

  return (
    <>
      <Card
        className={cn(
          "p-4 transition-all duration-200",
          isLowStock && "border-low-stock bg-low-stock-bg"
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium truncate",
                isLowStock && "text-low-stock"
              )}>
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
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
                    "text-sm font-medium cursor-pointer whitespace-nowrap",
                    item.inStock ? "text-primary" : "text-muted-foreground",
                    isTogglingStock && "opacity-50"
                  )}
                >
                  {isTogglingStock ? "Updating..." : item.inStock ? "In Stock" : "Out of Stock"}
                </Label>
              </div>
            )}
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Quantity</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3"
                  onClick={handleEditClick}
                  aria-label={`Edit ${item.name} quantity`}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {!showStockToggle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete?.(item.id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <EditQuantityDialog
        item={item}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveQuantity}
        isLoading={isSaving}
      />
    </>
  )
}

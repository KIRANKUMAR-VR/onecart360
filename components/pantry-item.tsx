"use client"

import { useState } from "react"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
  const [isEditingQuantity, setIsEditingQuantity] = useState(false)
  const [editQuantity, setEditQuantity] = useState(item.quantity.toString())
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

  const handleSaveQuantity = async () => {
    const newQuantity = parseFloat(editQuantity)
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Please enter a valid quantity')
      return
    }
    try {
      setIsSaving(true)
      await onUpdateQuantity?.(item.id, newQuantity)
      setIsEditingQuantity(false)
    } catch (err) {
      console.error('[v0] Update quantity error:', err)
      alert('Failed to update quantity')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditQuantity(item.quantity.toString())
    setIsEditingQuantity(false)
  }

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200",
        isLowStock && "border-low-stock bg-low-stock-bg",
        isEditingQuantity && "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-800"
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

        {!readOnly && !showStockToggle && (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor={`qty-${item.id}`} className="text-xs font-medium text-muted-foreground block mb-1">
                Quantity
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`qty-${item.id}`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  disabled={!isEditingQuantity || isSaving}
                  className={cn(
                    "h-9 flex-1 text-sm",
                    isEditingQuantity && "border-primary/50 focus:border-primary"
                  )}
                  placeholder="0"
                />
                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">{item.unit}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditingQuantity ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSaveQuantity}
                    disabled={isSaving}
                    aria-label="Save quantity"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => setIsEditingQuantity(true)}
                    aria-label={`Edit ${item.name} quantity`}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete?.(item.id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

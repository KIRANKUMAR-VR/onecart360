"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, Pencil, Check, X } from "lucide-react"
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
          <div className="flex items-center gap-2 mt-1">
            {isEditingQuantity ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="h-7 w-20 text-sm"
                  disabled={isSaving}
                  autoFocus
                />
                <span className="text-sm text-muted-foreground">{item.unit}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {item.quantity} {item.unit}
              </p>
            )}
          </div>
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
          isEditingQuantity ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleSaveQuantity}
                disabled={isSaving}
                aria-label="Save quantity"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-muted-foreground hover:bg-muted"
                onClick={handleCancelEdit}
                disabled={isSaving}
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditingQuantity(true)}
                  aria-label={`Edit ${item.name} quantity`}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
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
          )
        )}
      </div>
    </Card>
  )
}

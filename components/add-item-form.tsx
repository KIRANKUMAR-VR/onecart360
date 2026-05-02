"use client"

import { useState, useEffect } from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { PantryItemData } from "./pantry-item"

const CATEGORIES = [
  "Fruits & Vegetables",
  "Staples & Grains",
  "Pulses & Lentils",
  "Oils & Spices",
  "Dairy & Bakery",
  "Snacks & Packaged Food",
  "Household Essentials",
  "Personal Care",
  "Beverages",
]

const UNITS = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "liters", label: "liters" },
  { value: "ml", label: "ml" },
  { value: "packets", label: "packets" },
  { value: "bottles", label: "bottles" },
  { value: "cans", label: "cans" },
  { value: "boxes", label: "boxes" },
  { value: "pieces", label: "pieces" },
  { value: "dozen", label: "dozen" },
]

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, unit: string, category: string) => Promise<void>
  editingItem?: PantryItemData | null
  onCancel?: () => void
}

export function AddItemForm({ onAdd, editingItem, onCancel }: AddItemFormProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name)
      setCategory(editingItem.category || "")
      setQuantity(String(editingItem.quantity))
      setUnit(editingItem.unit)
    } else {
      setName("")
      setCategory("")
      setQuantity("")
      setUnit("")
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !category || !quantity || !unit) return
    
    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 0) return
    
    try {
      setIsLoading(true)
      await onAdd(name.trim(), qty, unit, category)
      setName("")
      setCategory("")
      setQuantity("")
      setUnit("")
    } catch (err) {
      // error handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!editingItem

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="item-name">Item Name</FieldLabel>
            <Input
              id="item-name"
              placeholder="e.g., Rice, Milk, Eggs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Field>
          
          <Field>
            <FieldLabel htmlFor="unit">Unit</FieldLabel>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        
        <div className="flex gap-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-1"
            disabled={!name.trim() || !category || !quantity || !unit || isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Item
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </>
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

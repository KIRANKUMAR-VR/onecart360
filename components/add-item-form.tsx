"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Save, ChevronDown } from "lucide-react"
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
  "Others",
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

interface CatalogItem {
  id: number
  category: string
  item_name: string
  quantity: number
  unit: string
}

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

  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
  const [suggestions, setSuggestions] = useState<CatalogItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFetchingCatalog, setIsFetchingCatalog] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Fetch catalog items when category changes
  useEffect(() => {
    if (!category || category === "Others") {
      setCatalogItems([])
      setSuggestions([])
      return
    }

    const fetchCatalog = async () => {
      setIsFetchingCatalog(true)
      try {
        const res = await fetch(`/api/product-catalog?category=${encodeURIComponent(category)}`)
        if (res.ok) {
          const data = await res.json()
          setCatalogItems(data)
        }
      } catch {
        // silently fail — user can still type manually
      } finally {
        setIsFetchingCatalog(false)
      }
    }

    fetchCatalog()
  }, [category])

  // Filter suggestions based on typed name
  useEffect(() => {
    if (!name.trim() || catalogItems.length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = catalogItems.filter((item) =>
      item.item_name.toLowerCase().includes(name.toLowerCase())
    )
    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [name, catalogItems])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectSuggestion = (item: CatalogItem) => {
    setName(item.item_name)
    setQuantity(String(item.quantity))
    setUnit(item.unit)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !category || !quantity || !unit) return

    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty < 0) return

    try {
      setIsLoading(true)
      await onAdd(name.trim(), qty, unit, category)
      setName("")
      setCategory("")
      setQuantity("")
      setUnit("")
      setCatalogItems([])
    } catch {
      // error handled by parent
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!editingItem

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FieldGroup>
        {/* Row 1: Item Name + Category */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="item-name">Item Name</FieldLabel>
            <div className="relative">
              <Input
                id="item-name"
                ref={inputRef}
                placeholder={isFetchingCatalog ? "Loading items..." : "Search or type item name"}
                value={name}
                disabled={false}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                  else if (name === "" && catalogItems.length > 0) {
                    setSuggestions(catalogItems)
                    setShowSuggestions(true)
                  }
                }}
                autoComplete="off"
              />
              {/* Dropdown suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto"
                >
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-2 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelectSuggestion(item)
                      }}
                    >
                      <span>{item.item_name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {item.quantity} {item.unit}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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

        {/* Row 2: Quantity + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.5"
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

        {/* Actions */}
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

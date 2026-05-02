"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, Save, Search, X } from "lucide-react"
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
  { value: "pcs", label: "pcs" },
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

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-primary font-semibold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function AddItemForm({ onAdd, editingItem, onCancel }: AddItemFormProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [suggestions, setSuggestions] = useState<CatalogItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Debounced search — fires 300ms after user stops typing
  const searchCatalog = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim()
    if (!query || query.length < 2 || query.length > 50) {
      setSuggestions([])
      setShowSuggestions(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setShowSuggestions(true) // keep dropdown open while searching
    try {
      const res = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data: CatalogItem[] = await res.json()
        setSuggestions(data)
        setActiveIndex(-1)
      } else {
        setSuggestions([])
      }
    } catch {
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchCatalog(value), 300)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[activeIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  const handleSelectSuggestion = (item: CatalogItem) => {
    setName(item.item_name)
    setCategory(item.category)
    setQuantity(String(item.quantity))
    setUnit(item.unit)
    setSuggestions([])
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  // Close on outside click
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

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
      setSuggestions([])
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="item-name"
                ref={inputRef}
                placeholder="Search or type item name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
                className="pl-9 pr-8"
                autoComplete="off"
              />
              {name && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setName("")
                    setSuggestions([])
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }}
                  tabIndex={-1}
                  aria-label="Clear item name"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  role="listbox"
                  aria-label="Item suggestions"
                  className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden"
                >
                  {isSearching ? (
                    <div className="px-3 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-3 w-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : !isSearching && suggestions.length === 0 ? (
                    <div className="px-3 py-2.5 text-sm text-muted-foreground">
                      No results found for &quot;{name}&quot;
                    </div>
                  ) : (
                    <ul className="max-h-52 overflow-y-auto py-1">
                      {suggestions.map((item, index) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={index === activeIndex}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-3 transition-colors ${
                              index === activeIndex
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleSelectSuggestion(item)
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate">
                                {highlightMatch(item.item_name, name)}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                              {item.quantity} {item.unit}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
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

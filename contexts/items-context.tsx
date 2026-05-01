"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { PantryItemData } from "@/components/pantry-item"

interface ItemsContextType {
  items: PantryItemData[]
  addItem: (name: string, quantity: number, unit: string) => void
  addItems: (items: { name: string; quantity: number; unit: string }[]) => void
  updateItem: (id: string, name: string, quantity: number, unit: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  deleteItem: (id: string) => void
  getItem: (id: string) => PantryItemData | undefined
  toggleStock: (id: string, inStock: boolean) => void
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PantryItemData[]>([])

  const addItem = (name: string, quantity: number, unit: string) => {
    const newItem: PantryItemData = {
      id: crypto.randomUUID(),
      name,
      quantity,
      unit,
      inStock: true,
    }
    setItems((prev) => [...prev, newItem])
  }

  const addItems = (newItems: { name: string; quantity: number; unit: string }[]) => {
    const itemsToAdd: PantryItemData[] = newItems.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      inStock: true,
    }))
    setItems((prev) => [...prev, ...itemsToAdd])
  }

  const updateItem = (id: string, name: string, quantity: number, unit: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name, quantity, unit } : item
      )
    )
  }

  const increaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getItem = (id: string) => {
    return items.find((item) => item.id === id)
  }

  const toggleStock = (id: string, inStock: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock } : item
      )
    )
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        addItems,
        updateItem,
        increaseQuantity,
        decreaseQuantity,
        deleteItem,
        getItem,
        toggleStock,
      }}
    >
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const context = useContext(ItemsContext)
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider")
  }
  return context
}

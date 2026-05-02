"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { PantryItemData } from "@/components/pantry-item"

interface ItemsContextType {
  items: PantryItemData[]
  addItem: (name: string, quantity: number, unit: string, category: string) => Promise<{ wasUpdated: boolean }>
  addItems: (items: { name: string; quantity: number; unit: string; category: string }[]) => Promise<void>
  updateItem: (id: string, name: string, quantity: number, unit: string, category: string) => Promise<void>
  increaseQuantity: (id: string) => Promise<void>
  decreaseQuantity: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  getItem: (id: string) => PantryItemData | undefined
  toggleStock: (id: string, inStock: boolean) => Promise<void>
  isLoading: boolean
  error: string | null
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

function transformItem(item: any): PantryItemData {
  return {
    id: item.id,
    name: item.name,
    category: item.category || 'Uncategorized',
    quantity: item.quantity,
    unit: item.unit,
    inStock: item.in_stock,
  }
}

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PantryItemData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Wait for a confirmed Supabase session before fetching items.
  // Using onAuthStateChange ensures cookies are set before the first API call.
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchItems()
      } else {
        setItems([])
        setIsLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/pantry-items', { cache: 'no-store' })

      if (response.status === 401) {
        setItems([])
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch items (${response.status})`)
      }

      const data = await response.json()
      setItems((data || []).map(transformItem))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (name: string, quantity: number, unit: string, category: string): Promise<{ wasUpdated: boolean }> => {
    const response = await fetch('/api/pantry-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity, unit, category }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to add item')
    }

    const data = await response.json()
    const transformed = transformItem(data)

    if (data.wasUpdated) {
      // Replace the existing item in state
      setItems((prev) => prev.map((i) => i.id === transformed.id ? transformed : i))
    } else {
      // Prepend the new item
      setItems((prev) => [transformed, ...prev])
    }

    return { wasUpdated: !!data.wasUpdated }
  }

  const addItems = async (newItems: { name: string; quantity: number; unit: string; category: string }[]) => {
    const responses = await Promise.all(
      newItems.map((item) =>
        fetch('/api/pantry-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
      )
    )

    const added: PantryItemData[] = []
    for (const response of responses) {
      if (!response.ok) throw new Error('Failed to add item')
      const data = await response.json()
      added.push(transformItem(data))
    }

    setItems((prev) => [...added, ...prev])
  }

  const updateItem = async (id: string, name: string, quantity: number, unit: string, category: string) => {
    const response = await fetch(`/api/pantry-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity, unit, category }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to update item')
    }

    const data = await response.json()
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name: data.name, category: data.category, quantity: data.quantity, unit: data.unit }
          : item
      )
    )
  }

  const increaseQuantity = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    await updateItem(id, item.name, item.quantity + 1, item.unit, item.category)
  }

  const decreaseQuantity = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item || item.quantity <= 0) return
    await updateItem(id, item.name, item.quantity - 1, item.unit, item.category)
  }

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/pantry-items/${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to delete item')
    }

    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getItem = (id: string) => items.find((item) => item.id === id)

  // toggleStock sends in_stock directly — does NOT look up the item in state
  // to avoid stale-closure issues where items[] might be empty at call time
  const toggleStock = async (id: string, inStock: boolean): Promise<void> => {
    const response = await fetch(`/api/pantry-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ in_stock: inStock }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to update stock status')
    }

    const data = await response.json()
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, inStock: data.in_stock } : i
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
        isLoading,
        error,
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

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { PantryItemData } from "@/components/pantry-item"

interface ItemsContextType {
  items: PantryItemData[]
  addItem: (name: string, quantity: number, unit: string) => Promise<void>
  addItems: (items: { name: string; quantity: number; unit: string }[]) => Promise<void>
  updateItem: (id: string, name: string, quantity: number, unit: string) => Promise<void>
  increaseQuantity: (id: string) => Promise<void>
  decreaseQuantity: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  getItem: (id: string) => PantryItemData | undefined
  toggleStock: (id: string, inStock: boolean) => Promise<void>
  isLoading: boolean
  error: string | null
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PantryItemData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch items on mount
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async (retryCount = 0) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/pantry-items')
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('[v0] Not authenticated, items will be empty')
          setItems([])
          setIsLoading(false)
          return
        }
        throw new Error(`Failed to fetch items: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('[v0] Fetched items:', data?.length || 0)
      const transformedItems: PantryItemData[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        inStock: item.in_stock,
      }))
      setItems(transformedItems)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items'
      console.log('[v0] Fetch items error:', message, 'Retry count:', retryCount)
      
      // Retry once after a delay if we haven't already
      if (retryCount < 1) {
        setTimeout(() => fetchItems(retryCount + 1), 1000)
        return
      }
      
      setError(message)
    } finally {
      if (retryCount === 0) {
        setIsLoading(false)
      }
    }
  }

  const addItem = async (name: string, quantity: number, unit: string) => {
    try {
      setError(null)
      const response = await fetch('/api/pantry-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, unit }),
      })

      if (!response.ok) {
        throw new Error('Failed to add item')
      }

      const data = await response.json()
      const newItem: PantryItemData = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        inStock: data.in_stock,
      }
      setItems((prev) => [newItem, ...prev])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item'
      console.log('[v0] Add item error:', message)
      setError(message)
      throw err
    }
  }

  const addItems = async (newItems: { name: string; quantity: number; unit: string }[]) => {
    try {
      setError(null)
      const addedItems: PantryItemData[] = []

      for (const item of newItems) {
        const response = await fetch('/api/pantry-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })

        if (!response.ok) {
          throw new Error('Failed to add item')
        }

        const data = await response.json()
        addedItems.push({
          id: data.id,
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          inStock: data.in_stock,
        })
      }

      setItems((prev) => [...addedItems, ...prev])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add items'
      console.log('[v0] Add items error:', message)
      setError(message)
      throw err
    }
  }

  const updateItem = async (id: string, name: string, quantity: number, unit: string) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid item ID')
    }

    try {
      setError(null)
      const response = await fetch(`/api/pantry-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, unit }),
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      const data = await response.json()
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: data.name,
                quantity: data.quantity,
                unit: data.unit,
              }
            : item
        )
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item'
      console.log('[v0] Update item error:', message)
      setError(message)
      throw err
    }
  }

  const increaseQuantity = async (id: string) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid item ID')
    }

    const item = items.find((i) => i.id === id)
    if (!item) {
      throw new Error(`Item with ID ${id} not found`)
    }

    try {
      await updateItem(id, item.name, item.quantity + 1, item.unit)
    } catch (err) {
      console.log('[v0] Increase quantity error:', err)
      throw err
    }
  }

  const decreaseQuantity = async (id: string) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid item ID')
    }

    const item = items.find((i) => i.id === id)
    if (!item || item.quantity <= 0) {
      throw new Error(`Item with ID ${id} not found or quantity is already 0`)
    }

    try {
      await updateItem(id, item.name, item.quantity - 1, item.unit)
    } catch (err) {
      console.log('[v0] Decrease quantity error:', err)
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid item ID')
    }

    try {
      setError(null)
      const response = await fetch(`/api/pantry-items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item'
      console.log('[v0] Delete item error:', message)
      setError(message)
      throw err
    }
  }

  const getItem = (id: string) => {
    return items.find((item) => item.id === id)
  }

  const toggleStock = async (id: string, inStock: boolean) => {
    // Validate id
    if (!id || id === 'undefined') {
      const message = 'Invalid item ID'
      console.log('[v0] Toggle stock error:', message)
      setError(message)
      throw new Error(message)
    }

    const item = items.find((i) => i.id === id)
    if (!item) {
      const message = `Item with ID ${id} not found`
      console.log('[v0] Toggle stock error:', message)
      setError(message)
      throw new Error(message)
    }

    try {
      setError(null)
      const response = await fetch(`/api/pantry-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          in_stock: inStock,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to toggle stock')
      }

      const data = await response.json()
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, inStock: data.in_stock !== undefined ? data.in_stock : inStock } : i
        )
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle stock'
      console.log('[v0] Toggle stock error:', message)
      setError(message)
      throw err
    }
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

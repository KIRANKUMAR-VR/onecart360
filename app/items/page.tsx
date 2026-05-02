"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Camera } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { AddItemForm } from "@/components/add-item-form"
import { ImportItems } from "@/components/import-items"
import { CameraScan } from "@/components/camera-scan"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { PantryItemData } from "@/components/pantry-item"

export default function ItemsPage() {
  const { items, addItem, addItems, updateItem, deleteItem, isLoading, error } = useItems()
  const isMobile = useIsMobile()
  const [editingItem, setEditingItem] = useState<PantryItemData | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleAddOrUpdate = async (name: string, quantity: number, unit: string, category: string) => {
    try {
      setApiError(null)
      if (editingItem) {
        await updateItem(editingItem.id, name, quantity, unit, category)
        setEditingItem(null)
        showSuccess('Item updated successfully.')
      } else {
        const { wasUpdated } = await addItem(name, quantity, unit, category)
        showSuccess(wasUpdated ? 'Item already exists. Updated successfully.' : 'Item added successfully.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setApiError(message)
    }
  }

  const handleEdit = (item: PantryItemData) => {
    setEditingItem(item)
    setApiError(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setApiError(null)
  }

  const handleDelete = async (id: string) => {
    try {
      setApiError(null)
      await deleteItem(id)
      if (editingItem?.id === id) {
        setEditingItem(null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item'
      setApiError(message)
      console.log('[v0] Delete error:', message)
    }
  }

  return (
    <main className="min-h-screen pb-8">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" aria-label="Back to dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Manage Items</h1>
              <p className="text-sm text-muted-foreground">
                Add or update your kitchen stock
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6">
        {successMessage && (
          <Card className="mb-4 border-green-500/50 bg-green-500/10">
            <CardContent className="p-4">
              <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        {(error || apiError) && (
          <Card className="mb-4 border-destructive/50 bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error || apiError}</p>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {editingItem ? "Update Item" : "Add New Items"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingItem ? (
              <AddItemForm
                onAdd={handleAddOrUpdate}
                editingItem={editingItem}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Tabs defaultValue="single" className="w-full">
                <TabsList className={`grid w-full mb-4 ${isMobile ? "grid-cols-3" : "grid-cols-2"}`}>
                  <TabsTrigger value="single">Add Single</TabsTrigger>
                  <TabsTrigger value="import">Import</TabsTrigger>
                  {isMobile && (
                    <TabsTrigger value="scan" className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      Scan
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="single">
                  <AddItemForm
                    onAdd={handleAddOrUpdate}
                    editingItem={editingItem}
                    onCancel={undefined}
                  />
                </TabsContent>
                <TabsContent value="import">
                  <ImportItems onImport={addItems} />
                </TabsContent>
                {isMobile && (
                  <TabsContent value="scan">
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Camera className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Scan Your List</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Take a photo of your shopping list, notepad, or receipt to quickly add items.
                        </p>
                      </div>
                      <CameraScan onImport={addItems} />
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <section aria-label="Added items">
          <h2 className="text-lg font-semibold mb-4">
            Added Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Package className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No items yet</EmptyTitle>
                <EmptyDescription>
                  Add your first item using the form above.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className={`transition-colors ${
                    editingItem?.id === item.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="secondary">
                            {item.quantity} {item.unit}
                          </Badge>
                          {item.quantity <= 1 && (
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

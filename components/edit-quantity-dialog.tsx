'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { PantryItemData } from '@/components/pantry-item'

interface EditQuantityDialogProps {
  item: PantryItemData | null
  isOpen: boolean
  onClose: () => void
  onSave: (quantity: number) => Promise<void>
  isLoading?: boolean
}

export function EditQuantityDialog({ item, isOpen, onClose, onSave, isLoading = false }: EditQuantityDialogProps) {
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity.toString())
    }
  }, [item])

  const handleSave = async () => {
    const newQuantity = parseFloat(quantity)
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Please enter a valid quantity')
      return
    }
    try {
      await onSave(newQuantity)
      onClose()
    } catch (err) {
      console.error('[v0] Save error:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quantity</DialogTitle>
          <DialogDescription>
            Update the quantity for {item?.name}. Enter the new quantity value below.
          </DialogDescription>
        </DialogHeader>
        {item && (
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

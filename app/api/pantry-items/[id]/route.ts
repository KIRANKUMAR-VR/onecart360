import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('[v0] PUT /api/pantry-items/[id]: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id || id === 'undefined') {
      console.error('[v0] PUT /api/pantry-items/[id]: Invalid ID:', id)
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, quantity, unit, in_stock } = body

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (quantity !== undefined) updateData.quantity = quantity
    if (unit !== undefined) updateData.unit = unit
    if (in_stock !== undefined) updateData.in_stock = in_stock

    const { data, error } = await supabase
      .from('pantry_items')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) {
      console.log('[v0] PUT /api/pantry-items/[id]: Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.log('[v0] PUT /api/pantry-items/[id]: Item not found:', id)
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    console.log('[v0] PUT /api/pantry-items/[id]: Updated item:', id)
    return NextResponse.json(data[0])
  } catch (err) {
    console.error('[v0] PUT /api/pantry-items/[id]: Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('[v0] DELETE /api/pantry-items/[id]: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id || id === 'undefined') {
      console.error('[v0] DELETE /api/pantry-items/[id]: Invalid ID:', id)
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.log('[v0] DELETE /api/pantry-items/[id]: Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] DELETE /api/pantry-items/[id]: Deleted item:', id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[v0] DELETE /api/pantry-items/[id]: Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

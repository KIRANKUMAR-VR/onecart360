import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, quantity, unit, category } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 })
    }

    // Check if item already exists for this user (case-insensitive)
    const { data: existing } = await supabase
      .from('pantry_items')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', name.trim())
      .maybeSingle()

    let item
    let wasUpdated = false

    if (existing) {
      // Update existing record
      wasUpdated = true
      const { data, error } = await supabase
        .from('pantry_items')
        .update({
          category: category || 'Uncategorized',
          quantity,
          unit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      item = data
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('pantry_items')
        .insert({ user_id: user.id, name: name.trim(), quantity, unit, category: category || 'Uncategorized', in_stock: true })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      item = data
    }

    if (!item) {
      return NextResponse.json({ error: 'Failed to save item' }, { status: 500 })
    }

    return NextResponse.json({ ...item, wasUpdated }, { status: wasUpdated ? 200 : 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

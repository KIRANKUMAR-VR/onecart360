import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('[v0] GET /api/pantry-items: Unauthorized -', userError?.message || 'No user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[v0] GET /api/pantry-items: Fetching for user:', user.id)

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] GET /api/pantry-items: Database error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] GET /api/pantry-items: Retrieved', data?.length || 0, 'items for user', user.id)
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[v0] GET /api/pantry-items: Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('[v0] POST /api/pantry-items: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, quantity, unit } = body

    const { data, error } = await supabase
      .from('pantry_items')
      .insert({
        user_id: user.id,
        name,
        quantity,
        unit,
        in_stock: true,
      })
      .select()

    if (error) {
      console.log('[v0] POST /api/pantry-items: Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const item = data?.[0]
    if (!item) {
      console.error('[v0] POST /api/pantry-items: No item returned from insert')
      return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
    }

    console.log('[v0] POST /api/pantry-items: Created item:', item.id)
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    console.error('[v0] POST /api/pantry-items: Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.trim()

    if (!query || query.length < 1) {
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from("product_catalog")
      .select("id, category, item_name, quantity, unit")
      .eq("is_active", true)
      .ilike("item_name", `%${query}%`)
      .order("item_name", { ascending: true })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

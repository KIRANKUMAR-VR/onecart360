import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // product_catalog is a public reference table — no auth needed
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("product_catalog")
      .select("id, category, item_name, quantity, unit")
      .eq("is_active", true)
      .ilike("item_name", `%${query}%`)
      .order("item_name", { ascending: true })
      .limit(10)

    if (error) {
      console.error("[v0] product catalog search error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error("[v0] product catalog search exception:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

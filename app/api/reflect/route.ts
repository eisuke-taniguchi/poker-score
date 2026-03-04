import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()
  const scores: Record<string, number> = body.scores

  console.log("受信scores:", scores)

  for (const [id, value] of Object.entries(scores)) {
    console.log("更新対象:", id, value)

    const { data, error } = await supabase.rpc("increment_score", {
      player_id_input: id,
      increment_value: value
    })

    console.log("更新件数:", data, "error:", error)
  }

  return NextResponse.json({ success: true })
}
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {

  const { playerId, delta } = await req.json()

  const { error } = await supabase.rpc("update_today_score", {
    player_id_input: playerId,
    delta_input: delta
  })

  if (error) {
    console.error(error)
    return Response.json({ success: false })
  }

  return Response.json({ success: true })
}
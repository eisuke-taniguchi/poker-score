import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {

  const { playerId, delta } = await req.json()
  console.log(playerId)

  const { data: player } = await supabase
    .from("players")
    .select("score")
    .eq("id", playerId)
    .single()

  const newScore = (player?.score ?? 0) + delta

  await supabase
    .from("players")
    .update({ score: newScore })
    .eq("id", playerId)

  // 履歴ログ保存
  const { error: logError } = await supabase
    .from("score_logs")
    .insert({
      player_id: playerId,
      amount: delta
    })

  if (logError) {
    console.error(logError)
  }

    // ログ件数取得
  const { count } = await supabase
    .from("score_logs")
    .select("*", { count: "exact", head: true })

  // 100件超えたら一番古いログ削除
  if ((count ?? 0) > 100) {

    const { data: oldest } = await supabase
      .from("score_logs")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (oldest) {
      await supabase
        .from("score_logs")
        .delete()
        .eq("id", oldest.id)
    }
  }

  return Response.json({ success: true })
}
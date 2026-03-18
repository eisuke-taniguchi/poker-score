'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getPlayers() {

  const { data: season } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_current", true)
    .single()

  if (!season) return []

  const { data, error } = await supabase
    .from("players")
    .select(`
      id,
      name,
      score,
      season_results (
        score,
        season_id
      )
    `)

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []).map((p: any) => {

    const result = p.season_results?.find(
      (r: any) => r.season_id === season.id
    )

    return {
      id: p.id,
      name: p.name,
      score: result?.score ?? 0,   // ← 今月
      today: p.score ?? 0          // ← 今日
    }
  })
}

export async function addPlayer(formData: FormData) {
  const name = formData.get('name') as string

  await supabase.from('players').insert({
    name,
    score: 0
  })

  revalidatePath('/players')
}

export async function deactivatePlayer(formData: FormData) {
  const id = formData.get('id') as string

  await supabase
    .from('players')
    .update({ is_active: false })
    .eq('id', id)

  revalidatePath('/players')
}

export async function getCurrentSeason() {
  const { data } = await supabase
    .from('seasons')
    .select('*')
    .eq('is_current', true)
    .single()

  return data
}

export async function finalizeSeason() {

  // 現在シーズン取得
  const { data: season } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_current", true)
    .single()

  if (!season) return

  // 次の月計算
  let newMonth = season.month + 1
  let newYear = season.year

  if (newMonth > 12) {
    newMonth = 1
    newYear += 1
  }

  // 新シーズン作成
  const { data: newSeason } = await supabase
    .from("seasons")
    .insert({
      season_number: season.season_number + 1,
      year: newYear,
      month: newMonth,
      is_current: true
    })
    .select()
    .single()

  // 全プレイヤー取得
  const { data: players } = await supabase
    .from("players")
    .select("id")

  // season_results作成
  if (players && newSeason) {

    const rows = players.map(p => ({
      player_id: p.id,
      season_id: newSeason.id,
      score: 0
    }))

    await supabase
      .from("season_results")
      .insert(rows)
  }

  // 今日スコアリセット
  await supabase
    .from("players")
    .update({ score: 0 })

  // 現在シーズン終了
  await supabase
    .from("seasons")
    .update({ is_current: false })
    .eq("id", season.id)

  revalidatePath("/")
}

export async function getScoreLogs() {
  const { data, error } = await supabase
    .from("score_logs")
    .select(`
      id,
      players (
        name
      ),
      amount,
      created_at
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error.message)
    console.error(error)
    return []
  }

  return data ?? []
}
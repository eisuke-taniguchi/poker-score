'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getPlayers() {
  const { data } = await supabase
    .from('players')
    .select('*')
    .eq('is_active', true)
    .order('created_at')

  return data ?? []
}

export async function addPlayer(formData: FormData) {
  const name = formData.get('name') as string

  await supabase.from('players').insert({
    name,
    total_score: 0
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

  // 🔥 現在のシーズン取得
  const { data: season } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_current", true)
    .single()

  if (!season) return

  // 🔥 アクティブプレイヤー取得
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("is_active", true)

  if (!players || players.length === 0) return

  // 🔥 履歴保存
  const results = players.map((p) => ({
    season_id: season.id,
    player_id: p.id,
    score: p.total_score
  }))

  await supabase.from("season_results").insert(results)

  // 🔥 プレイヤーリセット
  await supabase
    .from("players")
    .update({ total_score: 0 })
    .eq("is_active", true)

  // 🔥 現在シーズン終了
  await supabase
    .from("seasons")
    .update({ is_current: false })
    .eq("id", season.id)

  // 🔥 次の月計算
  let newMonth = season.month + 1
  let newYear = season.year

  if (newMonth > 12) {
    newMonth = 1
    newYear += 1
  }

  // 🔥 新シーズン作成
  await supabase.from("seasons").insert({
    season_number: season.season_number + 1,
    year: newYear,
    month: newMonth,
    is_current: true
  })

  revalidatePath("/")
}

export async function getScoreLogs() {
  const { data, error } = await supabase
    .from("score_logs")
    .select(`
      id,
      amount,
      created_at,
      players (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}
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
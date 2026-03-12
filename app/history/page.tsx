import { createClient } from "@supabase/supabase-js"
import HistoryClient from "./HistoryClient"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function HistoryPage() {

  const { data: results } = await supabase
    .from("season_results")
    .select(`
      score,
      players(name),
      seasons(year, month)
    `)
    .order("season_id", { ascending: false })

    
    return (
    <div>
        <h1>シーズン履歴</h1>
        <HistoryClient results={results} />
    </div>
    )
}
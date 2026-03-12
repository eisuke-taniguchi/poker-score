import Link from "next/link"
import { getPlayers, getCurrentSeason } from "./actions"
import ScoreTable from "./ScoreTable"
import FinalizeButton from "./components/FinalizeButton"

export const dynamic = "force-dynamic"

export default async function Home() {
  const players = await getPlayers()
  const season = await getCurrentSeason()

  return (
    <div className="min-h-screen bg-gray-100 py-10">

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            シーズン {season?.season_number}
          </h1>

          <p className="text-gray-500 mt-2">
            {season?.year}年 {season?.month}月
          </p>
        </div>

        {/* スコアテーブル */}
        <ScoreTable players={players} />

        {/* 下部ボタンエリア */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap">

          <FinalizeButton />

          <Link
            href="/history"
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            過去戦歴
          </Link>

          <Link
            href="/logs"
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            入力履歴
          </Link>

        </div>

      </div>
  )
}
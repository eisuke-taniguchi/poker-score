"use client"

import { useState } from "react"
import ReflectButton from "./ReflectButton"

type Player = {
  id: string
  name: string
  score: number   // 今月
  today: number   // 今日
}

export default function ScoreTable({ players }: { players: Player[] }) {
  const [dailyScores, setDailyScores] = useState<Record<string, number>>({})
  const [deltas, setDeltas] = useState<Record<string, number>>({})

  const updateDaily = (id: number, value: number) => {
    setDailyScores(prev => ({
      ...prev,
      [id]: value
    }))
  }

const scores: Record<string, number> = {}

players.forEach(p => {
  scores[p.id] = p.today
})

const totalToday = players.reduce(
  (sum, p) => sum + p.today,
  0
)

const applyDelta = async (id: string, sign: 1 | -1) => {

  const amount = deltas[id] || 0
  if (!amount) return

  await fetch("/api/updateScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      playerId: id,
      delta: amount * sign
    })
  })

  location.reload()
}

  return (
    <>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-center text-gray-900">
              名前
            </th>
            <th className="border border-gray-300 p-2 text-center text-gray-900">
              今月
            </th>
            <th className="border border-gray-300 p-2 text-center text-gray-900">
              本日
            </th>
          </tr>
        </thead>

        <tbody>
          {[...players]
            .sort((a, b) => b.score - a.score).map(p => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
              
              {/* 名前（中央） */}
              <td className="border border-gray-300 p-2 text-center">
                {p.name}
              </td>

              {/* 今月（右揃え） */}
              <td className="border border-gray-300 p-2 text-right">
                {p.score}
              </td>

              {/* 本日 */}
<td className="border border-gray-300 px-2 py-1">
  <div className="flex items-center justify-between">

    {/* 現在値（左側） */}
    <span>
    {p.today > 0 ? `+${p.today}` : p.today}
    </span>

    {/* 調整エリア（右側に固定） */}
    <div className="flex items-center gap-2 text-sm text-gray-500">

      <input
        type="number"
        className="border border-gray-300 rounded px-2 py-1 w-14 text-right"
        placeholder="金額"
        value={deltas[p.id] || ""}
        onChange={(e) =>
          setDeltas(prev => ({
            ...prev,
            [p.id]: Number(e.target.value)
          }))
        }
      />

      <button
        type="button"
        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        onClick={() => {
            applyDelta(p.id, 1)}}
      >
        ＋
      </button>

      <button
        type="button"
        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
        onClick={() => applyDelta(p.id, -1)}
      >
        －
      </button>
    </div>

  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-center">
        <div className="mb-3 font-bold text-lg">
          本日のズレ:{" "}
          <span
            className={
              totalToday === 0
                ? "text-gray-500"
                : totalToday > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {totalToday > 0 ? `+${totalToday}` : totalToday}
          </span>
        </div>

        <ReflectButton
        scores={scores}
        totalToday={totalToday}
        />
      </div>
      </div>
    </>
  )
}
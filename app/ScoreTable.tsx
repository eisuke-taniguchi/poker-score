"use client"

import { useState } from "react"
import ReflectButton from "./ReflectButton"

type Player = {
  id: number
  name: string
  total_score: number
}

export default function ScoreTable({ players }: { players: Player[] }) {
  const [dailyScores, setDailyScores] = useState<Record<number, number>>({})
  const [deltas, setDeltas] = useState<Record<number, number>>({})

  const totalToday = Object.values(dailyScores).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  )

  const updateDaily = (id: number, value: number) => {
    setDailyScores(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const applyDelta = (id: number, sign: 1 | -1) => {
    const amount = deltas[id] || 0
    if (!amount) return

    setDailyScores(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + amount * sign
    }))

    setDeltas(prev => ({
      ...prev,
      [id]: 0
    }))
  }

  return (
    <>
      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-center">
              名前
            </th>
            <th className="border border-gray-300 p-3 text-center">
              今月
            </th>
            <th className="border border-gray-300 p-3 text-center">
              本日
            </th>
          </tr>
        </thead>

        <tbody>
          {players.map(p => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
              
              {/* 名前（中央） */}
              <td className="border border-gray-300 p-3 text-center">
                {p.name}
              </td>

              {/* 今月（右揃え） */}
              <td className="border border-gray-300 p-3 text-right">
                {p.total_score}
              </td>

              {/* 本日 */}
<td className="border border-gray-300 px-4 py-2">
  <div className="flex items-center justify-between">

    {/* 現在値（左側） */}
    <span
      className={`w-20 text-right text-lg font-bold ${
        (dailyScores[p.id] || 0) > 0
          ? "text-green-600"
          : (dailyScores[p.id] || 0) < 0
          ? "text-red-600"
          : "text-gray-400"
      }`}
    >
      {(dailyScores[p.id] || 0) > 0
        ? `+${dailyScores[p.id]}`
        : dailyScores[p.id] || 0}
    </span>

    {/* 調整エリア（右側に固定） */}
    <div className="flex items-center gap-2 text-sm text-gray-500">

      <span className="text-gray-400">入力欄</span>

      <input
        type="number"
        className="border border-gray-300 rounded px-2 py-1 w-20 text-right"
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
        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        onClick={() => applyDelta(p.id, 1)}
      >
        ＋
      </button>

      <button
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
          本日合計:{" "}
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
          scores={dailyScores}
          totalToday={totalToday}
        />
      </div>
    </>
  )
}
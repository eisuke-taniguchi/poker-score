"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HistoryClient({ results }: any) {
  const [selectedMonth, setSelectedMonth] = useState("total")

    const months: string[] = Array.from(
    new Set(
        results.map(
        (r: any) => `${r.seasons.year}-${r.seasons.month}`
        )
    )
    )

    const filtered =
    selectedMonth === "total"
        ? results
        : results.filter(
            (r: any) =>
            `${r.seasons.year}-${r.seasons.month}` === selectedMonth
        )

      const totalByPlayer =
        selectedMonth === "total"
          ? results.reduce((acc: any, r: any) => {
              const name = r.players.name
              if (!acc[name]) acc[name] = 0
              acc[name] += r.score
              return acc
            }, {})
          : {}

  const grouped = filtered.reduce((acc: any, r: any) => {
    const key = `${r.seasons.year}-${r.seasons.month}`
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  const router = useRouter()

  return (
    <div>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{ marginBottom: "16px" }}
      >
        <option value="total">累計</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

        {selectedMonth === "total" && (
          <div>
            <h2>累計</h2>

            {Object.entries(totalByPlayer)
              .sort((a: any, b: any) => b[1] - a[1])
              .map(([name, score]: any, index: number) => (
                <div key={name}>
                  {index === 0 && "👑 "}
                  {name} - {score}
                </div>
              ))}
          </div>
        )}

        {selectedMonth !== "total" &&
          Object.entries(grouped).map(([key, players]: any, seasonIndex) => {
            const [year, month] = key.split(":")

            return (
              <div
                key={key}   // ← これを追加
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h2>
                  シーズン{seasonIndex + 1} ({year}/{month})
                </h2>

                {players.map((p: any, index: number) => (
                  <div key={p.players.id ?? index}>
                    {index === 0 && "👑 "}
                    {p.players.name} - {p.score}
                  </div>
                ))}
              </div>
            )
          })}
        <div style={{ width: "100%", marginTop: "40px" }}>
        <button onClick={() => router.back()} 
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
                cursor: "pointer"
              }}>
            戻る
        </button>
        </div>
    </div>
    
  )
}
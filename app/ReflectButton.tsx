"use client"

import { useState } from "react"

type Props = {
  scores: Record<number, number>
  totalToday: number
}

export default function ReflectButton({
  scores,
  totalToday
}: Props) {
  const [loading, setLoading] = useState(false)

const handleReflect = async () => {
  console.log("clicked")

  if (totalToday !== 0) {
    alert("合計が0ではありません")
    return
  }

  setLoading(true)

  await fetch("/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scores })
  })

  location.reload()
}

  return (
    <button
      onClick={handleReflect}
      disabled={loading}
      style={{
        padding: "8px 16px",
        border: "1px solid #4CAF50",
        borderRadius: "6px",
        background: "#4CAF50",
        color: "white",
        cursor: "pointer"
      }}
    >
      {loading ? "反映中..." : "月へ反映"}
    </button>
  )
}
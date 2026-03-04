"use client"

import { finalizeSeason } from "../actions"
import { useTransition } from "react"

export default function FinalizeButton() {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    const ok = confirm("本当に次のシーズンへ進みますか？")
    if (!ok) return

    startTransition(() => {
      finalizeSeason()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        background: "#f44336",
        color: "white",
        border: "none"
      }}
    >
      {isPending ? "決算中..." : "決算して次のシーズンへ"}
    </button>
  )
}
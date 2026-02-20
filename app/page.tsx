"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [name, setName] = useState("")
  const [score, setScore] = useState("")

  const addData = async () => {
    if (!name || !score) return

    const { error } = await supabase
      .from("games")
      .insert([{ player_name: name, score: Number(score) }])

    if (error) {
      alert("保存失敗")
      console.log(error)
    } else {
      alert("保存成功")
      setName("")
      setScore("")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Poker Score</h1>

      <input
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="点数"
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <br /><br />

      <button onClick={addData}>
        保存
      </button>
    </div>
  )
}
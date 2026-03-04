"use client"

import { useFormStatus } from "react-dom"

export default function ConfirmButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("本当に確定しますか？")) {
          e.preventDefault()
        }
      }}
    >
      {pending ? "確定中..." : "確定"}
    </button>
  )
}
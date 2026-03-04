import { getScoreLogs } from "../actions"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function LogsPage() {
  const logs = await getScoreLogs()

  return (
    <div style={{ padding: "40px" }}>
      <h1>スコア履歴</h1>
        <div style={{ marginBottom: "20px" }}>
        <Link href="/"
            style={{
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            textDecoration: "none",
            background: "#fff",
            color: "black",
            display: "inline-block"
            }}>戻る</Link>
        </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>日時</th>
            <th>プレイヤー</th>
            <th>金額</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.players?.name}</td>
              <td
                style={{
                  color: log.amount > 0 ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                {log.amount > 0 ? `+${log.amount}` : log.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
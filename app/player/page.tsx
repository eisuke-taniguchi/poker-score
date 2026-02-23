import { getPlayers, addPlayer, deactivatePlayer } from '../actions'

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">プレイヤー管理</h1>

      <form action={addPlayer} className="mb-6">
        <input
          name="name"
          placeholder="名前"
          className="border p-2 mr-2"
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          追加
        </button>
      </form>

      <ul>
        {players.map(p => (
          <li key={p.id} className="flex justify-between mb-2">
            {p.name}
            <form action={deactivatePlayer}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-red-500">削除</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
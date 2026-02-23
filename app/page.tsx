import { getPlayers, getCurrentSeason } from './actions'

export default async function Home() {
  const players = await getPlayers()
  const season = await getCurrentSeason()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        シーズン {season?.season_number}
      </h1>

      <p className="mb-4 text-gray-500">
        {season?.year}年 {season?.month}月
      </p>

      <table className="w-full border">
        <thead>
          <tr>
            <th>名前</th>
            <th>累計</th>
            <th>今日</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} className="border-t">
              <td>{p.name}</td>
              <td>{p.total_score}</td>
              <td>
                <input
                  type="number"
                  className="border p-1 w-24"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
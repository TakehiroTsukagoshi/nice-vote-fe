type Poll = {
  id: string;
  title: string;
  votes_count: number;
};

type PollsResponse = {
  polls: Poll[];
};

async function getPolls(): Promise<Poll[]> {
  try {
    // ローカルで起動しているGoのAPIサーバーへリクエスト
    const res = await fetch("http://localhost:8080/api/polls", {
      // 開発時はキャッシュを残さず毎回最新を取得するように設定
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch polls");
    }

    const data: PollsResponse = await res.json();
    return data.polls;
  } catch (error) {
    console.error("Error fetching polls:", error);
    return []; // エラー時は空の配列を返す
  }
}

export default async function Page() {
  const polls = await getPolls();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pollify - 投票一覧</h1>

      {polls.length === 0 ? (
        <p className="text-gray-500">
          投票データが取得できないか、バックエンドサーバーが停止しています。
        </p>
      ) : (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li
              key={poll.id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white"
            >
              <span className="font-medium">{poll.title}</span>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                票数: {poll.votes_count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

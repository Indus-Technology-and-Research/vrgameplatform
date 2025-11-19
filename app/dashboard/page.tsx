import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch student data
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Fetch recent progress
  const { data: recentGames } = await supabase
    .from('student_progress')
    .select(`
      *,
      games (
        title,
        description,
        thumbnail_url
      )
    `)
    .eq('student_id', user?.id)
    .order('last_played_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {student?.full_name || 'Student'}!
        </h1>
        <p className="text-gray-400">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Current Grade</p>
              <p className="text-3xl font-bold text-white mt-1">
                Grade {student?.current_grade || 9}
              </p>
            </div>
            <div className="text-5xl opacity-50">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm font-medium">Games Played</p>
              <p className="text-3xl font-bold text-white mt-1">
                {recentGames?.length || 0}
              </p>
            </div>
            <div className="text-5xl opacity-50">🎮</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">
                {recentGames?.filter(g => g.completed).length || 0}
              </p>
            </div>
            <div className="text-5xl opacity-50">✅</div>
          </div>
        </div>
      </div>

      {/* Select Grade Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Select Your Grade</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[9, 10, 11, 12].map((grade) => (
            <Link
              key={grade}
              href={`/dashboard/grades/${grade}`}
              className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-cyan-600 hover:to-blue-700 rounded-xl p-6 text-center transition-all transform hover:scale-105 border border-white/10 hover:border-cyan-400"
            >
              <div className="text-4xl mb-2">📖</div>
              <p className="text-xl font-bold text-white">Grade {grade}</p>
              <p className="text-sm text-gray-400 mt-1">Explore subjects</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentGames && recentGames.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentGames.map((item: any) => (
              <Link
                key={item.id}
                href={`/game/${item.game_id}`}
                className="bg-gray-800/50 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all game-card"
              >
                <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-6xl">
                  🎮
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">
                    {item.games?.title || 'Game'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Score: {item.score || 0} | {item.completed ? '✅ Completed' : '⏳ In Progress'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

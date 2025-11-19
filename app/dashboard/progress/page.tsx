import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all progress
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select(`
      *,
      games (
        id,
        title,
        description,
        difficulty_level,
        subjects (name, color_theme),
        grades (grade_name)
      )
    `)
    .eq('student_id', user?.id)
    .order('last_played_at', { ascending: false })

  const totalGames = allProgress?.length || 0
  const completedGames = allProgress?.filter(p => p.completed).length || 0
  const totalScore = allProgress?.reduce((sum, p) => sum + (p.score || 0), 0) || 0
  const totalTime = allProgress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const difficultyColors: { [key: string]: string } = {
    'easy': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'hard': 'bg-red-500',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-gray-400">Track your learning journey</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <p className="text-blue-200 text-sm font-medium mb-1">Games Played</p>
          <p className="text-4xl font-bold text-white">{totalGames}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
          <p className="text-green-200 text-sm font-medium mb-1">Completed</p>
          <p className="text-4xl font-bold text-white">{completedGames}</p>
          <p className="text-xs text-green-200 mt-1">
            {totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
          <p className="text-purple-200 text-sm font-medium mb-1">Total Score</p>
          <p className="text-4xl font-bold text-white">{totalScore}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-6 shadow-lg">
          <p className="text-cyan-200 text-sm font-medium mb-1">Time Spent</p>
          <p className="text-4xl font-bold text-white">{formatTime(totalTime)}</p>
        </div>
      </div>

      {/* Game History */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Game History</h2>

        {allProgress && allProgress.length > 0 ? (
          <div className="space-y-4">
            {allProgress.map((progress: any) => (
              <div
                key={progress.id}
                className="bg-gray-800/50 rounded-lg p-6 border border-white/10 hover:border-cyan-400 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {progress.games?.title || 'Unknown Game'}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${difficultyColors[progress.games?.difficulty_level] || 'bg-gray-500'}`}>
                        {progress.games?.difficulty_level}
                      </span>
                      {progress.completed && (
                        <span className="px-2 py-1 bg-green-500 rounded text-xs font-semibold text-white">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3">
                      {progress.games?.subjects?.name} • {progress.games?.grades?.grade_name}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-400">Score:</span>
                        <span className="text-white font-bold ml-2">{progress.score || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Attempts:</span>
                        <span className="text-white font-bold ml-2">{progress.attempts || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white font-bold ml-2">{formatTime(progress.time_spent || 0)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Played:</span>
                        <span className="text-white font-bold ml-2">
                          {new Date(progress.last_played_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/game/${progress.game_id}`}
                    className="ml-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    {progress.completed ? 'Play Again' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">No Games Played Yet</h3>
            <p className="text-gray-400 mb-6">Start playing games to track your progress!</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Browse Games
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GameContainer from '@/components/games/GameContainer'

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  // Fetch game details
  const { data: game } = await supabase
    .from('games')
    .select(`
      *,
      subjects (name, color_theme),
      grades (grade_name, grade_number)
    `)
    .eq('id', gameId)
    .single()

  if (!game) {
    notFound()
  }

  // Fetch user progress
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('game_id', gameId)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/grades/${game.grades.grade_number}/subjects/${game.subject_id}`}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ← Back to Games
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white">{game.title}</h1>
                <p className="text-sm text-gray-400">
                  {game.subjects.name} • {game.grades.grade_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {progress && (
                <div className="text-sm">
                  <span className="text-gray-400">Best Score:</span>
                  <span className="text-white font-bold ml-2">{progress.score || 0}</span>
                </div>
              )}
              <div className="px-3 py-1 bg-cyan-600 rounded-full text-sm font-semibold">
                {game.difficulty_level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <GameContainer
              gameId={parseInt(gameId)}
              gameTitle={game.title}
              userId={user.id}
            />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-3">About This Game</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Learning Objectives */}
            {game.learning_objectives && game.learning_objectives.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-3">🎯 Learning Goals</h2>
                <ul className="space-y-2">
                  {game.learning_objectives.map((objective: string, idx: number) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Game Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">📊 Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Attempts</span>
                  <span className="text-white font-semibold">{progress?.attempts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Best Score</span>
                  <span className="text-white font-semibold">{progress?.score || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`font-semibold ${progress?.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {progress?.completed ? 'Completed ✓' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
              <h2 className="text-lg font-bold text-white mb-3">🎮 Controls</h2>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>• Click and drag to rotate the view</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Use buttons below the game to interact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

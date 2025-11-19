import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SubjectGamesPage({
  params
}: {
  params: Promise<{ gradeId: string; subjectId: string }>
}) {
  const { gradeId, subjectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch grade and subject information
  const { data: grade } = await supabase
    .from('grades')
    .select('*')
    .eq('grade_number', gradeId)
    .single()

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single()

  if (!grade || !subject) {
    notFound()
  }

  // Fetch games for this subject and grade
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .eq('grade_id', grade.id)
    .eq('subject_id', subject.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Fetch user progress for these games
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', user?.id)
    .in('game_id', games?.map(g => g.id) || [])

  const progressMap = progress?.reduce((acc: any, p) => {
    acc[p.game_id] = p
    return acc
  }, {})

  const difficultyColors: { [key: string]: string } = {
    'easy': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'hard': 'bg-red-500',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/grades/${gradeId}`}
          className="text-cyan-400 hover:text-cyan-300 mb-4 inline-flex items-center"
        >
          ← Back to Subjects
        </Link>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">
            {subject.name}
          </h1>
          <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold">
            {grade.grade_name}
          </span>
        </div>
        <p className="text-gray-400">{subject.description}</p>
      </div>

      {/* Games Gallery */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Available Games</h2>
          <div className="text-gray-400 text-sm">
            {games?.length || 0} games found
          </div>
        </div>

        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const gameProgress = progressMap?.[game.id]
              return (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition-all game-card"
                >
                  {/* Thumbnail */}
                  <div
                    className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-7xl"
                    style={{
                      background: game.thumbnail_url
                        ? `url(${game.thumbnail_url})`
                        : `linear-gradient(135deg, ${subject.color_theme}80 0%, ${subject.color_theme}40 100%)`
                    }}
                  >
                    🎮
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white flex-1">
                        {game.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${difficultyColors[game.difficulty_level] || 'bg-gray-500'}`}>
                        {game.difficulty_level}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <span className="mr-2">⏱️</span>
                        <span>{game.estimated_time} minutes</span>
                      </div>
                      {gameProgress && (
                        <div className="flex items-center text-sm text-cyan-400">
                          <span className="mr-2">
                            {gameProgress.completed ? '✅' : '⏳'}
                          </span>
                          <span>
                            {gameProgress.completed
                              ? `Completed - Score: ${gameProgress.score}`
                              : 'In Progress'
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Learning Objectives */}
                    {game.learning_objectives && game.learning_objectives.length > 0 && (
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-xs font-semibold text-gray-400 mb-2">Learning Goals:</p>
                        <ul className="space-y-1">
                          {game.learning_objectives.slice(0, 2).map((objective: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-start">
                              <span className="mr-1">•</span>
                              <span className="line-clamp-1">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
                      {gameProgress ? 'Continue Playing' : 'Start Game'}
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">No Games Available Yet</h3>
            <p className="text-gray-400">
              Games for this subject are coming soon! Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

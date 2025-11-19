import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function GradePage({ params }: { params: Promise<{ gradeId: string }> }) {
  const { gradeId } = await params
  const supabase = await createClient()

  // Fetch grade information
  const { data: grade } = await supabase
    .from('grades')
    .select('*')
    .eq('grade_number', gradeId)
    .single()

  if (!grade) {
    notFound()
  }

  // Fetch all subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('name')

  // Fetch games count for each subject in this grade
  const { data: games } = await supabase
    .from('games')
    .select('id, subject_id')
    .eq('grade_id', grade.id)
    .eq('is_active', true)

  // Count games per subject
  const gamesPerSubject = games?.reduce((acc: any, game) => {
    acc[game.subject_id] = (acc[game.subject_id] || 0) + 1
    return acc
  }, {})

  const subjectIcons: { [key: string]: string } = {
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'Mathematics': '📐',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-flex items-center">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">
          {grade.grade_name}
        </h1>
        <p className="text-gray-400">{grade.description}</p>
      </div>

      {/* Subjects Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Select a Subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects?.map((subject) => {
            const gameCount = gamesPerSubject?.[subject.id] || 0
            return (
              <Link
                key={subject.id}
                href={`/dashboard/grades/${gradeId}/subjects/${subject.id}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-400 transition-all transform hover:scale-105 game-card"
                style={{
                  background: `linear-gradient(135deg, ${subject.color_theme}20 0%, ${subject.color_theme}10 100%)`,
                }}
              >
                <div className="text-6xl mb-4">{subjectIcons[subject.name] || '📚'}</div>
                <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{subject.description}</p>
                <div className="flex items-center text-cyan-400">
                  <span className="text-sm font-semibold">{gameCount} games available</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">💡 Learning Tip</h3>
        <p className="text-gray-300">
          Choose a subject you want to explore. Each game is designed to make learning interactive
          and fun while helping you understand key concepts through hands-on 3D experiences.
        </p>
      </div>
    </div>
  )
}

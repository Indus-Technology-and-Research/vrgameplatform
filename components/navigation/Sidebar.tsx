'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: '🏠' },
  { name: 'My Grades', href: '/dashboard/grades', icon: '📚' },
  { name: 'Progress', href: '/dashboard/progress', icon: '📊' },
]

const grades = [
  { number: 9, name: 'Grade 9' },
  { number: 10, name: 'Grade 10' },
  { number: 11, name: 'Grade 11' },
  { number: 12, name: 'Grade 12' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
            🎮
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduPlay 3D</h1>
            <p className="text-xs text-gray-400">Learn & Play</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </h3>
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}

        <div className="pt-6 mt-6 border-t border-gray-700">
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Grades
          </h3>
          {grades.map((grade) => (
            <Link
              key={grade.number}
              href={`/dashboard/grades/${grade.number}`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname?.includes(`/grades/${grade.number}`)
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">📖</span>
              {grade.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <span className="mr-2">🚪</span>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

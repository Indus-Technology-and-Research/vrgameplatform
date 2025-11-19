import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">EduPlay 3D</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Interactive 3D educational games that make learning fun and engaging
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg font-semibold text-white border border-white/20 hover:bg-white/20 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

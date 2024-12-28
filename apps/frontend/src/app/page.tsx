"use client"
import ChessBoard from '@/components/ChessBoard'
import { signIn } from 'next-auth/react'

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ChessBoard />
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-green-800">
              Welcome to <br /> <span className="text-green-600">CheckMate.com</span>
            </h1>
            <p className="text-xl text-green-700">
              Play against players all around the world
            </p>
            <div className="space-y-4 flex flex-col justify-center items-center">
              <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80">
                Play as guest
              </button>
              <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80" onClick={() => signIn()}>
                Sign up
              </button>
              <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80" onClick={() => signIn()}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-green-600">
        CheckMate.com
      </footer>
    </div>
  )
}


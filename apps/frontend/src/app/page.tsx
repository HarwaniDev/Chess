"use client"
import ChessBoard from '@/components/LandingPageChessBoard'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ChessBoard />
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 text-center">
              Welcome to <br /> <span className="text-green-600">CheckMate.com</span>
            </h1>
            <div className="space-y-4 flex flex-col justify-center items-center">
              <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80"
                onClick={() => {
                  router.push("/game")
                }}>
                Play as guest
              </button>
              <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80" onClick={() => signIn("google", { callbackUrl: `/game` })}>
                {session.status === "loading" ? <ClipLoader /> : session.data?.user ? "Play as " + session.data.user.name : "Sign in with Google" }
              </button>
              {session.data?.user && <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 w-80" onClick={() => signOut()}>
                Log out
              </button>}
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


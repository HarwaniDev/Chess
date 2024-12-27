import ChessBoard from '../components/ChessBoard'
import { Button } from "@/components/ui/button"

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
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Play as Guest
              </Button>
              <Button className="w-full bg-white text-green-600 hover:bg-green-100 border border-green-600">
                Sign Up
              </Button>
              <Button className="w-full bg-green-100 text-green-600 hover:bg-green-200">
                Sign In
              </Button>
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


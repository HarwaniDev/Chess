'use client'

import { useState } from 'react'

const ChessBoard = () => {
  // Initial chess piece positions
  const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ]

  const [board] = useState(initialBoard)
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="grid grid-cols-8 gap-0 border-4 border-green-800 bg-white shadow-xl rounded-sm">
        {board.map((row, i) =>
          row.map((piece, j) => {
            const isWhite = (i + j) % 2 === 0
            return (
              <div
                key={`${i}-${j}`}
                className={`aspect-square flex items-center justify-center text-3xl
                  ${isWhite ? 'bg-white' : 'bg-green-600'}`}
              >
                <span className={`${isWhite ? 'text-green-800' : 'text-white'}`}>
                  {piece}
                </span>
              </div>
            )
          })
        )}
      </div>
      {/* Board coordinates */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-green-800">
        {ranks.map(rank => (
          <span key={rank} className="text-sm font-medium">{rank}</span>
        ))}
      </div>
      <div className="absolute left-0 right-0 -bottom-6 flex justify-around text-green-800">
        {files.map(file => (
          <span key={file} className="text-sm font-medium">{file}</span>
        ))}
      </div>
    </div>
  )
}

export default ChessBoard


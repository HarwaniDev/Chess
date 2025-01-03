import { MOVE } from "common";
import { Color, PieceSymbol, Square, Chess } from "chess.js";
import { useState } from "react";

const ChessBoard = ({ board, socket }: {
    board: ({
        square: Square,
        type: PieceSymbol,
        color: Color
    } | null)[][], socket: WebSocket
}) => {

    const [from, setFrom] = useState<Square | null>(null);
    
    return (
        <div className="w-full max-w-md mx-auto aspect-square">
            <div className="grid grid-cols-8 gap-0 border-4 border-green-800">
                {board.map((row, i) =>
                    row.map((square, j) => {
                        const isWhite = (i + j) % 2 === 0;
                        const squareNumber = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return (
                            <div
                                onClick={() => {
                                    if(!from){
                                        setFrom(squareNumber);
                                    } 
                                    else {
                                        socket.send(JSON.stringify({
                                            type: MOVE,
                                            move: {
                                                from: from,
                                                to: squareNumber
                                            }
                                        }))
                                        setFrom(null)
                                    }
                                }}
                                key={`${i}-${j}`}
                                className={`aspect-square ${isWhite ? 'bg-white' : 'bg-green-600'
                                    }`}
                            >
                                {square?.square}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChessBoard;


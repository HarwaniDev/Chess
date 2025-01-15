import { MOVE } from "common";
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

const ChessBoard = ({ board, socket }: {
    board: ({
        square: Square,
        type: PieceSymbol,
        color: Color
    } | null)[][],
    socket: WebSocket,
}) => {
    const [from, setFrom] = useState<Square | null>(null);

    return (
        <div className="w-full max-w-lg mx-auto aspect-square">
            <div className="grid grid-cols-8 gap-0 border-4 border-[#769656]">
                {board.map((row, i) =>
                    row.map((square, j) => {
                        const isLight = (i + j) % 2 === 0;
                        const squareNumber = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return (
                            <div
                                onClick={() => {

                                    if (!from) {
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
                                className={`aspect-square ${isLight ? 'bg-white' : 'bg-green-400'
                                    } flex justify-center items-center`}
                            >
                                {square?.type && square?.color && (
                                    <img
                                        src={`${square.color}${square.type}.png`}
                                        alt=""
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChessBoard;


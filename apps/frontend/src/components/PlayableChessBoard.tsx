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
                                {square?.type === "p" ? square?.color === "w" ? <img src="wp.png" alt="" /> : <img src="bp.png" alt="" /> : null}
                                {square?.type === "q" ? square?.color === "w" ? <img src="wq.png" alt="" /> : <img src="bq.png" alt="" /> : null}
                                {square?.type === "k" ? square?.color === "w" ? <img src="wk.png" alt="" /> : <img src="bk.png" alt="" />  : null}
                                {square?.type === "r" ? square?.color === "w" ? <img src="wr.png" alt="" /> : <img src="br.png" alt="" /> : null}
                                {square?.type === "b" ? square?.color === "w" ? <img src="wb.png" alt="" /> : <img src="bb.png" alt="" /> : null}
                                {square?.type === "n" ? square?.color === "w" ? <img src="wn.png" alt="" /> : <img src="bn.png" alt="" /> : null}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChessBoard;


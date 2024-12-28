"use client"
import ChessBoard from "@/components/PlayableChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "common";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

export default function Game() {
    const socket = useSocket();
    const chess = new Chess();
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    break;
                case MOVE: 
                    try {
                    chess.move(message.payload);   
                    setBoard(chess.board());
                    
                } catch (error) {
                        console.error(error);
                    }
                    break;
                case GAME_OVER: 
                    console.log("game over");
                    break;
                    
            }
        }
    }, [socket])
    if(!socket){
        return <div>Loading...</div>
    }
    return (
        <>
        <ChessBoard chess={chess} setBoard={setBoard} board={board} socket={socket}></ChessBoard>
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: INIT_GAME
            }))
        }}>
            Play
        </button>
        </>
    )
}
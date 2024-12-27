"use client"
import ChessBoard from "@/components/PlayableChessBoard";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../../../../ws/src/messages";
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
                    console.log(chess.board());
                    console.log("game initialized");
                    break;
                case MOVE: 
                    try {
                    console.log(message.payload);
                    chess.move(message.payload);   
                    setBoard(chess.board());
                    console.log("here after chess.board()");
                    
                } catch (error) {
                        console.error(error);
                    }
                    console.log("move made");
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
        <Button onClick={() => {
            socket?.send(JSON.stringify({
                type: INIT_GAME
            }))
        }}>
            Play
        </Button>
        </>
    )
}
"use client";
import ChessBoard from "@/components/PlayableChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "common";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Game() {
    const socket = useSocket();
    const chess = new Chess();
    const [board, setBoard] = useState(chess.board());
    const [userId, setUserId] = useState<string | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;
        if(userId !== null) return;
        async function fetchUserId() {
            try {
                const response = await fetch("http://localhost:3000/api/getUserId", {
                    method: "POST",
                    body: JSON.stringify({
                        email: session?.user?.email,
                    }),
                    headers: {
                        "Content-type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.response) {
                    setUserId(result.response);

                } else {
                    console.error("Error fetching user ID:", result.error);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        }

        fetchUserId();
    }, [session]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    break;
                case MOVE:
                        chess.move(message.payload);
                        setBoard(chess.board());
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        };
    }, [socket]);

    if (status === "loading" || !socket) {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div>Please log in to play the game.</div>;
    }

    return (
        <>
            <ChessBoard board={board} socket={socket} />
            <button
                onClick={() => {
                    socket?.send(
                        JSON.stringify({
                            type: INIT_GAME,
                            senderId: userId
                        })
                    );
                }}
            >
                Play
            </button>
        </>
    );
}

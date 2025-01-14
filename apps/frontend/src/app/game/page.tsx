"use client";
import ChessBoard from "@/components/PlayableChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "common";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Clock, Flag, HandshakeIcon, Trophy } from 'lucide-react';

export default function Game() {
    const socket = useSocket();
    const chess = useMemo(() => new Chess(), []);
    const [board, setBoard] = useState(chess.board());
    const [userId, setUserId] = useState<string | null>(null);
    const { data: sessionData, status } = useSession();
    const [whitePlayerName, setWhitePlayerName] = useState("");
    const [blackPlayerName, setBlackPlayerName] = useState("");
    const [moves, setMoves] = useState([
        { number: 1, white: "e4", black: "e5" },
        { number: 2, white: "Nf3", black: "Nc6" },
        { number: 3, white: "Bb5", black: "a6" },
    ]);

    const session = useMemo(() => sessionData, [sessionData]);

    useEffect(() => {
        if (status !== "authenticated") return;
        if (userId !== null) return;
        if (session === null) return;

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
                    setWhitePlayerName(message.whitePlayer);
                    setBlackPlayerName(message.blackPlayer)
                    break;
                case MOVE:
                    chess.move(message.payload);
                    setBoard(chess.board());
                    // Update moves here
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        };
    }, [socket]);

    const handlePlay = () => {
        socket?.send(
            JSON.stringify({
                type: INIT_GAME,
                senderId: userId,
                name: session?.user?.name
            })
        );
    };

    const handleDraw = () => {
        // Implement draw logic
    };

    const handleResign = () => {
        // Implement resign logic
    };

    if (status === "loading" || !socket) {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div>Please log in to play the game.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_300px] gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  {whitePlayerName}
                  {/* <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Your Turn
                  </span> */}
                </h3>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{blackPlayerName}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <ChessBoard board={board} socket={socket} />
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={handlePlay} className="flex justify-center items-center px-4 py-2 rounded-md bg-black text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <Clock className="w-4 h-4 mr-2" />
              Play
            </button>
            <button onClick={handleDraw} className="px-4 py-2 flex justify-center items-center rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <HandshakeIcon className="w-4 h-4 mr-2" />
              Offer Draw
            </button>
            <button onClick={handleResign} className="px-4 py-2 flex justify-center items-center rounded-md bg-red-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <Flag className="w-4 h-4 mr-2" />
              Resign
            </button>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Move History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>White</TableHead>
                  <TableHead>Black</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moves.map((move) => (
                  <TableRow key={move.number}>
                    <TableCell className="font-medium">{move.number}</TableCell>
                    <TableCell className="font-mono">{move.white}</TableCell>
                    <TableCell className="font-mono">{move.black}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
    );
}


"use client";
import ChessBoard from "@/components/PlayableChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { DRAW, GAME_OVER, INIT_GAME, MOVE } from "common";
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
import { MdOutlineHandshake } from "react-icons/md";
import { CiClock2, CiFlag1, CiTrophy } from "react-icons/ci";

export default function Game() {
  const socket = useSocket();
  const chess = useMemo(() => new Chess(), []);
  const [board, setBoard] = useState(chess.board());
  const [userId, setUserId] = useState<string | null>(null);
  const { data: sessionData, status } = useSession();
  const [whitePlayerName, setWhitePlayerName] = useState("");
  const [blackPlayerName, setBlackPlayerName] = useState("");
  const [playPressed, setPlayPressed] = useState(false);
  const [initGameRecieved, setInitGameRecieved] = useState(false);
  const [drawOffered, setDrawOffered] = useState(false);
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
          setBlackPlayerName(message.blackPlayer);
          setInitGameRecieved(true);
          break;
        case MOVE:
          chess.move(message.payload);
          setBoard(chess.board());
          // Update moves here
          break;
        case DRAW:
          setDrawOffered(true);
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
    setPlayPressed(true);
  };

  const handleDraw = () => {
    socket?.send(
      JSON.stringify({
        type: DRAW
      })
    )
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

  if(drawOffered){
    alert("draw offered")
    setDrawOffered(false);
  }
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_300px] gap-6">
        {playPressed ?
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CiTrophy  className="w-5 h-5" />
                Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {initGameRecieved ?
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {whitePlayerName}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 ml-3 rounded-full">
                        white
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {blackPlayerName}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 ml-3 rounded-full">
                        black
                      </span>
                      </h3>
                  </div>
                </div>
                :
                <p className="animate-pulse text-muted-foreground">
                  Waiting for a player to join...
                </p>
              }


            </CardContent>
          </Card> :
          <Card className="max-h-20 flex items-center justify-center">
            <CardContent className="mt-4">
              <span className="font-semibold text-muted-foreground">
                Press play to start
              </span>
            </CardContent>
          </Card>
        }

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <ChessBoard board={board} socket={socket} />
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={handlePlay} className="flex justify-center items-center px-4 py-2 rounded-md bg-black text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <CiClock2 className="w-4 h-4 mr-2" />
              Play
            </button>
            <button onClick={handleDraw} className="px-4 py-2 flex justify-center items-center rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <MdOutlineHandshake className="w-4 h-4 mr-2" />
              Offer Draw
            </button>
            <button onClick={handleResign} className="px-4 py-2 flex justify-center items-center rounded-md bg-red-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
              <CiFlag1 className="w-4 h-4 mr-2" />
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


import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { CHECK, GAME_OVER, INIT_GAME, MOVE } from "common";
import { prisma } from "@chessmate/db";
import { User } from "./User";

export class Game {
    public id: string;
    public whitePlayer: User;
    public blackPlayer: User;
    private board: Chess;
    private startTime: Date;
    private moves: string;

    constructor(gameid: string, whitePlayer: User, blackPlayer: User) {
        this.id = gameid;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.board = new Chess();
        this.startTime = new Date();
        this.moves = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        this.whitePlayer.socket.send(JSON.stringify({
            type: INIT_GAME,
            color: "white",
            whitePlayer: whitePlayer.name,
            blackPlayer: blackPlayer.name
        }))
        this.blackPlayer.socket.send(JSON.stringify({
            type: INIT_GAME,
            color: "black",
            whitePlayer: whitePlayer.name,
            blackPlayer: blackPlayer.name
        }))
    }

    async makeMove(socket: WebSocket, move: { from: string, to: string }) {
        // Validate move using zod

        if (this.board.turn() === 'w' && socket !== this.whitePlayer.socket) {
            this.blackPlayer.socket.send(JSON.stringify({
                type: "not your turn",
            }));
            return;
        }

        if (this.board.turn() === 'b' && socket !== this.blackPlayer.socket) {
            this.whitePlayer.socket.send(JSON.stringify({
                type: "not your turn",
            }));
            return;
        }

        try {
            this.board.move(move);

            this.whitePlayer.socket.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));

            this.blackPlayer.socket.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));

            this.moves = this.board.fen();

            // Add to Redis queue here

            await prisma.game.update({
                where: {
                    id: this.id,
                },
                data: {
                    currentFen: this.moves
                }
            });

            if (this.board.isCheck() && !this.board.isCheckmate()) {
                if (this.board.turn() === 'w') {
                    this.whitePlayer.socket.send(JSON.stringify({
                        type: CHECK
                    }));
                }
                else {
                    this.blackPlayer.socket.send(JSON.stringify({
                        type: CHECK,
                    }));
                }
                return;
            }

            if (this.board.isDraw()) {
                this.whitePlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "agreement"
                }));
                this.blackPlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "agreement"
                }));

                await prisma.game.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        status: "COMPLETED",
                        result: "DRAW",
                        endAt: new Date()
                    }
                })
                return;
            }

            if (this.board.isInsufficientMaterial()) {
                this.whitePlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "insufficient material"
                }));
                this.blackPlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "insufficient material"
                }));
                await prisma.game.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        status: "COMPLETED",
                        result: "DRAW",
                        endAt: new Date()
                    }
                })
                return;
            }

            if (this.board.isStalemate()) {
                this.whitePlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "stalemate"
                }));
                this.blackPlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    result: "draw",
                    reason: "stalemate"
                }));
                await prisma.game.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        status: "COMPLETED",
                        result: "DRAW",
                        endAt: new Date()
                    }
                })
                return;
            }


            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? "black" : "white";
                this.whitePlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    winner
                }));
                this.blackPlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    winner
                }));
                await prisma.game.update({
                    where: {
                        id: this.id
                    },
                    data: {
                        status: "COMPLETED",
                        result: this.board.turn() === "w" ? "BLACK_WINS" : "WHITE_WINS",
                        endAt: new Date()
                    }
                })
                return;
            }

        } catch (error) {
            console.error(error);
            socket.send(JSON.stringify({
                type: "error",
                message: "Invalid move"
            }));
        }
    }
}
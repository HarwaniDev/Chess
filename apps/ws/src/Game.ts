import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "common";
import { v4 as uuid } from "uuid";
import { prisma } from "@chessmate/db";

export class Game {
    public id: string;
    public whitePlayer: {id: string, socket: WebSocket};
    public blackPlayer: {id: string, socket: WebSocket};
    private board: Chess;
    private startTime: Date;
    private moves: string;

    constructor(whitePlayer: {id: string, socket: WebSocket}, blackPlayer: {id: string, socket: WebSocket}) {
        this.id = uuid();
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.board = new Chess();
        this.startTime = new Date();
        this.moves = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        this.whitePlayer.socket.send(JSON.stringify({
            type: INIT_GAME,
            color: "white",
        }))
        this.blackPlayer.socket.send(JSON.stringify({
            type: INIT_GAME,
            color: "black",
        }))
    }

    async makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        
            //validate move using zod

            if (this.board.turn() === 'w' && socket !== this.whitePlayer.socket) {
                this.blackPlayer.socket.send(JSON.stringify({
                    type: "not your turn",
                }))
                return;
            }
            if (this.board.turn() === 'b' && socket !== this.blackPlayer.socket) {
                this.whitePlayer.socket.send(JSON.stringify({
                    type: "not your turn",
                }))
                return;
            }

            try {
                this.board.move(move);
                this.whitePlayer.socket.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))

                this.blackPlayer.socket.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
                this.moves = this.board.fen();
                // add to redis queue here.
                await prisma.game.update({
                    where: {
                        id: this.id,
                    },
                    data: {
                        currentFen: this.moves
                    }
                }
                )

            } catch (error) {
                console.error(error);
            }

            if(this.board.isGameOver()){
                this.whitePlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }));
                this.blackPlayer.socket.send(JSON.stringify({
                    type: GAME_OVER,
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }));
                return;
            }
    }
}
import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            color: "white"
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            color: "black"
        }))
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        
            //validate move using zod

            if (this.board.turn() === 'w' && socket !== this.player1) {
                this.player2.send(JSON.stringify({
                    type: "not your turn",
                }))
                return;
            }
            if (this.board.turn() === 'b' && socket !== this.player2) {
                this.player1.send(JSON.stringify({
                    type: "not your turn",
                }))
                return;
            }

            try {
                this.board.move(move);
            } catch (error) {
                console.error(error);
            }

            if(this.board.isGameOver()){
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }));
                return;
            }

            if(this.board.turn() === 'w'){
                this.player1.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            }

            if(this.board.turn() === 'b'){
                this.player2.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            }  
    }
}
import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "common";
import { Game } from "./Game";
import { prisma } from "@chessmate/db"
import { v4 as uuidv4 } from 'uuid';
// User class

export class GameManager {
    private games: Game[];
    private pendingUser: {id: string, socket: WebSocket} | null;
    private users: WebSocket[];


    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.messageHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        //stop game because user has left
    }

    private async messageHandler(socket: WebSocket) {
        socket.on('message', async (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, {id: message.senderId, socket: socket});   
                    await prisma.game.create({
                        data: {
                            id: uuidv4(),
                            whitePlayerId: this.pendingUser.id,
                            blackPlayerId: message.senderId,
                            status: "IN_PROGRESS"
                        }
                    }) 
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = {id:message.senderId, socket:socket};
                }
            }
            if (message.type === MOVE) {
                const game = this.games.find(game => game.whitePlayer.socket === socket || game.blackPlayer.socket === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        })
    }
}
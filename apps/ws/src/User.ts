import { WebSocket } from "ws";

export interface User {
    id: string;
    socket: WebSocket;
    name:string;
}
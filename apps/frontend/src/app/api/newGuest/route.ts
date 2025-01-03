import { prisma } from "@chessmate/db";
import { NextRequest } from "next/server";
import {v4 as uuid} from "uuid";

async function createGuestUser(req: NextRequest) {
    await prisma.user.create({
        data: {
            id: uuid(),
            provider: "GUEST"
        }
    }) 
}   


export {createGuestUser as POST}
import { prisma } from "@chessmate/db";
import { getServerSession } from "next-auth";
import { POST } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

async function getUserId(req: NextRequest) {

    const session = await getServerSession(POST);

    if (!session) {
        return NextResponse.json({ response: "Unauthorized"});
    }

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ response: "Email is required"});
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json({
                response: "User not found",
            });
        }

        return NextResponse.json({
            response: user.id,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            response: "Internal Server Error",
        });
    }
}

export { getUserId as POST };

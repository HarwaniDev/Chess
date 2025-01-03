import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@chessmate/db";
const handler =  NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if(!user.email) {
                return false;
            }
            try {
                const isUserRegistered = await prisma.user.findFirst({
                    where: {
                        email: user.email
                    }
                })
                if(!isUserRegistered) {
                   await prisma.user.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            provider: "GOOGLE",
                        }
                    })
                }

            } catch (error) {
                console.error(error);
            }
            return true;
        }
    }
})

export {handler as GET, handler as POST}
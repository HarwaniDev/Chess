-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'TIME_UP', 'PLAYER_EXIT');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE_WINS', 'BLACK_WINS', 'DRAW');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL,
    "result" "GameResult",
    "startingFen" TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    "currentFen" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "timeTaken" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Game_status_result_idx" ON "Game"("status", "result");

-- CreateIndex
CREATE INDEX "Move_gameId_idx" ON "Move"("gameId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

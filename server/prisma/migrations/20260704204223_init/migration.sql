/*
  Warnings:

  - You are about to drop the column `avatarid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Avatar" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarid",
DROP COLUMN "name",
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

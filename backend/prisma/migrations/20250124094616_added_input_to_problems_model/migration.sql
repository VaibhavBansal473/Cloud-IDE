/*
  Warnings:

  - Added the required column `input` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "input" TEXT NOT NULL;

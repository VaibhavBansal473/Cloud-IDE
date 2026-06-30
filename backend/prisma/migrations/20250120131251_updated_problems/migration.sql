/*
  Warnings:

  - Added the required column `level` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

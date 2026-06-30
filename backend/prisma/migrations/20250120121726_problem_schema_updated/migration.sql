/*
  Warnings:

  - Added the required column `expectedOutput` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemStatement` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "expectedOutput" TEXT NOT NULL,
ADD COLUMN     "problemStatement" TEXT NOT NULL,
ADD COLUMN     "testCases" TEXT NOT NULL;

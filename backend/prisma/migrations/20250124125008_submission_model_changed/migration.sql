/*
  Warnings:

  - Added the required column `judge0TrackingId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "judge0TrackingId" TEXT NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SubState";

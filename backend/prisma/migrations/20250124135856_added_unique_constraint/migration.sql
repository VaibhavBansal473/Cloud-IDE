/*
  Warnings:

  - A unique constraint covering the columns `[judge0TrackingId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submission_judge0TrackingId_key" ON "Submission"("judge0TrackingId");

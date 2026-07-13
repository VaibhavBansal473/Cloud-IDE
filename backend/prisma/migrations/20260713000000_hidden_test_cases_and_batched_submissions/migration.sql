-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "currentBatchStart" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedTestCase" INTEGER,
ADD COLUMN     "judge0Tokens" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languageId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sourceCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "verdictMessage" TEXT NOT NULL DEFAULT '';

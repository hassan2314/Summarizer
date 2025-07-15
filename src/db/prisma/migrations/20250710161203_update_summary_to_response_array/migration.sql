/*
  Warnings:

  - You are about to drop the column `summary` on the `Summary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_userId_fkey";

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "summary",
ADD COLUMN     "response" TEXT[];

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

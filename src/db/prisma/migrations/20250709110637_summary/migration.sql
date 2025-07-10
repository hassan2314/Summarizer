/*
  Warnings:

  - You are about to drop the column `format` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Summary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "format",
DROP COLUMN "type";

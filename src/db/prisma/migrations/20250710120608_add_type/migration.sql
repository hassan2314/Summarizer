/*
  Warnings:

  - Added the required column `type` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "type" TEXT NOT NULL;

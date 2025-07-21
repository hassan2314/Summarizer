/*
  Warnings:

  - Changed the type of `type` on the `Summary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SummaryType" AS ENUM ('paragraph', 'question', 'bullet');



-- Step 2: Alter the column to use the enum with casting
ALTER TABLE "Summary"
  ALTER COLUMN "type" TYPE "SummaryType" USING "type"::"SummaryType";

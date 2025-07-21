/*
  Warnings:

  - The values [question,bullet] on the enum `SummaryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SummaryType_new" AS ENUM ('paragraph', 'questions', 'bullets');
ALTER TABLE "Summary" ALTER COLUMN "type" TYPE "SummaryType_new" USING ("type"::text::"SummaryType_new");
ALTER TYPE "SummaryType" RENAME TO "SummaryType_old";
ALTER TYPE "SummaryType_new" RENAME TO "SummaryType";
DROP TYPE "SummaryType_old";
COMMIT;

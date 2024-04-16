/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_option_id_fkey";

-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "votes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Vote";

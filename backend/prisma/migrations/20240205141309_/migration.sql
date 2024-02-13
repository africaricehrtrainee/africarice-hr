/*
  Warnings:

  - You are about to drop the column `dateTo` on the `steps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `steps` DROP COLUMN `dateTo`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `sent` BOOLEAN NOT NULL DEFAULT false;

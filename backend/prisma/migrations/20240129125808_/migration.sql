/*
  Warnings:

  - You are about to drop the column `deadline` on the `steps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `steps` DROP COLUMN `deadline`,
    ADD COLUMN `dateFrom` VARCHAR(191) NULL,
    ADD COLUMN `dateTo` VARCHAR(191) NULL;

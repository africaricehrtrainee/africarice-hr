/*
  Warnings:

  - You are about to drop the `updates` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `dateFrom` on table `steps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateTo` on table `steps` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `updates` DROP FOREIGN KEY `Updates_employeeId_fkey`;

-- AlterTable
ALTER TABLE `steps` MODIFY `dateFrom` VARCHAR(191) NOT NULL,
    MODIFY `dateTo` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `updates`;

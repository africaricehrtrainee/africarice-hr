/*
  Warnings:

  - You are about to drop the column `evaluationId` on the `objectives` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `Objectives_evaluationId_fkey`;

-- AlterTable
ALTER TABLE `objectives` DROP COLUMN `evaluationId`;

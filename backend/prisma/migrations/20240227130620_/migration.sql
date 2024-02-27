/*
  Warnings:

  - You are about to drop the column `evaluationStatus` on the `evaluation360` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `evaluation360` DROP COLUMN `evaluationStatus`;

-- AlterTable
ALTER TABLE `evaluator360` ADD COLUMN `evaluatorStatus` VARCHAR(191) NOT NULL DEFAULT 'draft';

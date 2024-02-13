/*
  Warnings:

  - You are about to drop the column `evaluatorFiveComment` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFiveGrade` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFiveId` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFiveJobTitle` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFourComment` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFourGrade` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFourId` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorFourJobTitle` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorOneComment` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorOneGrade` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorOneId` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorOneJobTitle` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorThreeComment` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorThreeGrade` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorThreeId` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorThreeJobTitle` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorTwoComment` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorTwoGrade` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorTwoId` on the `evaluation360` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatorTwoJobTitle` on the `evaluation360` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_evaluatorFiveId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_evaluatorFourId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_evaluatorOneId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_evaluatorThreeId_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation360` DROP FOREIGN KEY `Evaluation360_evaluatorTwoId_fkey`;

-- AlterTable
ALTER TABLE `evaluation360` DROP COLUMN `evaluatorFiveComment`,
    DROP COLUMN `evaluatorFiveGrade`,
    DROP COLUMN `evaluatorFiveId`,
    DROP COLUMN `evaluatorFiveJobTitle`,
    DROP COLUMN `evaluatorFourComment`,
    DROP COLUMN `evaluatorFourGrade`,
    DROP COLUMN `evaluatorFourId`,
    DROP COLUMN `evaluatorFourJobTitle`,
    DROP COLUMN `evaluatorOneComment`,
    DROP COLUMN `evaluatorOneGrade`,
    DROP COLUMN `evaluatorOneId`,
    DROP COLUMN `evaluatorOneJobTitle`,
    DROP COLUMN `evaluatorThreeComment`,
    DROP COLUMN `evaluatorThreeGrade`,
    DROP COLUMN `evaluatorThreeId`,
    DROP COLUMN `evaluatorThreeJobTitle`,
    DROP COLUMN `evaluatorTwoComment`,
    DROP COLUMN `evaluatorTwoGrade`,
    DROP COLUMN `evaluatorTwoId`,
    DROP COLUMN `evaluatorTwoJobTitle`;

-- CreateTable
CREATE TABLE `Evaluator360` (
    `evaluator360Id` INTEGER NOT NULL AUTO_INCREMENT,
    `evaluationId` INTEGER NOT NULL,
    `evaluatorId` INTEGER NOT NULL,
    `evaluatorJobTitle` VARCHAR(191) NOT NULL,
    `evaluatorGrade` INTEGER NOT NULL,
    `evaluatorComment` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`evaluator360Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation360`(`evaluation360Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `Employees`(`employeeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

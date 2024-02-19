-- DropForeignKey
ALTER TABLE `evaluator360` DROP FOREIGN KEY `Evaluator360_evaluationId_fkey`;

-- AddForeignKey
ALTER TABLE `Evaluator360` ADD CONSTRAINT `Evaluator360_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation360`(`evaluation360Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `objectivecomments` DROP FOREIGN KEY `ObjectiveComments_objectiveId_fkey`;

-- DropForeignKey
ALTER TABLE `objectivehistory` DROP FOREIGN KEY `ObjectiveHistory_objectiveId_fkey`;

-- AddForeignKey
ALTER TABLE `ObjectiveHistory` ADD CONSTRAINT `ObjectiveHistory_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `Objectives`(`objectiveId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectiveComments` ADD CONSTRAINT `ObjectiveComments_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `Objectives`(`objectiveId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `ObjectiveHistory` (
    `objectiveHistoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `objectiveId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `successConditions` VARCHAR(191) NOT NULL,
    `deadline` VARCHAR(191) NOT NULL,
    `kpi` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `selfComment` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`objectiveHistoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ObjectiveHistory` ADD CONSTRAINT `ObjectiveHistory_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `Objectives`(`objectiveId`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `attractionId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `offerId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `Attraction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfferAttraction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Attraction` DROP FOREIGN KEY `Attraction_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_attractionId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_offerId_fkey`;

-- DropForeignKey
ALTER TABLE `OfferAttraction` DROP FOREIGN KEY `OfferAttraction_attractionId_fkey`;

-- DropForeignKey
ALTER TABLE `OfferAttraction` DROP FOREIGN KEY `OfferAttraction_offerId_fkey`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `attractionId`,
    DROP COLUMN `offerId`,
    ADD COLUMN `locationId` VARCHAR(191) NULL,
    ADD COLUMN `routeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Attraction`;

-- DropTable
DROP TABLE `Offer`;

-- DropTable
DROP TABLE `OfferAttraction`;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `cityId` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `type` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `website` VARCHAR(255) NULL,
    `entryFee` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `description` TEXT NULL,
    `prices` VARCHAR(255) NOT NULL,
    `circular` BOOLEAN NOT NULL DEFAULT false,
    `length` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `locationId` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,

    UNIQUE INDEX `RouteLocation_locationId_routeId_key`(`locationId`, `routeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteLocation` ADD CONSTRAINT `RouteLocation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteLocation` ADD CONSTRAINT `RouteLocation_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
